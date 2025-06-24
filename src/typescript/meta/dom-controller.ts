import '../../styles/sass/index.scss';

import { GameState } from '../state/game-state';
import { players } from '../state/player-state';
import { CycloneLightboxController } from '../utilities/cycloneLightbox.ts/cyclone-lightbox';

// 💭 markup
import { createHeader } from '../markup/header/header';
import { MainComponent } from '../markup/main/main-component';
import { InstructionsDialogComponent } from '../markup/components/instructions-dialog-component/instructions-dialog-component';
import { CycloneSitRepScroller } from '../utilities/cycloneSitRepScroller.ts/cyclone-sit-rep-scroller';
import { AttackResult, PlayerType, gameboardStateValue } from '../types/state-types';
import { BillowBot } from '../services/billow';
import { waitForTransitionEnd } from '../utilities/random-utilities';

// 💭 --------------------------------------------------------------

export class DOMController {
  public readonly instructionsLightboxController: CycloneLightboxController;
  public readonly cycloneSitRepScroller: CycloneSitRepScroller =
    new CycloneSitRepScroller();
  public readonly mainComponent: MainComponent;

  private readonly content: HTMLElement;
  private readonly header: HTMLElement = createHeader();
  private readonly instructionsDialog: InstructionsDialogComponent =
    new InstructionsDialogComponent();
  // private readonly footer: HTMLElement;

  constructor(
    private readonly gameState: GameState,
    private readonly billowBot: BillowBot | null // make optional if multiplayer
  ) {
    if (!document) throw new Error('Fuck!');

    const content = document.getElementById('content');
    if (!content) throw new Error('Shit!');

    this.content = content;
    this.instructionsLightboxController = new CycloneLightboxController(
      this.instructionsDialog.element,
      'instructions-dialog-close-button'
    );
    this.mainComponent = new MainComponent(
      players,
      this.instructionsLightboxController,
      this.cycloneSitRepScroller,
      this.gameState
    );

    this.gameState.eventBus.on(
      'transitionToNextPhase',
      this.transitionToNextPhase
    );
    this.gameState.eventBus.on(
      'updateUIActiveGameboard',
      this.updateUIActiveGameboard
    );
    this.gameState.eventBus.on(
      'setAndScrollToNextSitRep',
      this.cycloneSitRepScroller.setAndScrollToNextSitRep
    );

    // this.footer = createFooter();
  }

  public render() {
    this.content.appendChild(this.header);
    this.mainComponent.render(this.content);
    this.instructionsDialog.render(document.body);
    // append footer via here
  }

  // ? sets initial turn state styles (I like this name better 😎). {TIMELESS ARTIFACT 💭}
  private readyPlayerOne = async (): Promise<void> => {
    await this.updateUIActiveGameboard();
    this.mainComponent.mainContainerTwo.opponentGameboard.toggleBellumListeners(
      gameboardStateValue.active
    );
    this.gameState.eventBus.emit(
      'togglePlayerGameboardControls',
      gameboardStateValue.inactive
    );
    this.gameState.eventBus.emit(
      'toggleOpponentGameboardControls',
      gameboardStateValue.active
    );
  };

  private updateUIActiveGameboard = async (): Promise<void> => {
    const container = this.mainComponent.mainContainerTwo.element;
    container.classList.toggle(
      'player-turn',
      this.gameState.currentPlayer === 'player'
    );

    await waitForTransitionEnd(container, 1000);
  };

  private transitionToNextPhase = async (): Promise<void> => {
    if (this.gameState.currentGamePhase === 'bellum') {
      this.gameState.setInitialPlayer();

      if (!this.gameState.currentPlayer)
        throw new Error('Current player must be set in game state.');

      // ? set initial sit rep scroller text content
      this.initializeSitRepScroller(this.gameState.currentPlayer); // ? make dynamic
    }

    this.mainComponent.mainContainerOne.swapByOrder();
    this.mainComponent.mainContainerThree.swapByOrder();

    await this.updateGameboardOnTransition(this.gameState);

    // TODO: If multiplayer becomes the dominant mode, reverse this check to reduce conditionals
    if (this.gameState.currentPlayer === 'opponent') {
      // ? && playing against billow (if multiplayer is introduced)

      console.log('billowBot', this.billowBot);

      if (this.billowBot) {
        const billowAttackResult: AttackResult = await this.billowBot.attack();

        // 💭 ADD STUFF HERE? --------------------------------------------------------------
        // * debugging
        console.log('billowAttackResult', billowAttackResult);

        // 💭 emit billowAttack
        // TODO: emit receive attack in the playergameboardcomponentin billowBot.ts
        // match coordinates with corresponding grid cell on player gameboard

        // 💭 method on billowBot `ponderAttackCoordinates` called by `billowAttack` event listener.
        // apply animation to multiple random unattacked grid cells one at a time.
        // (start off fast, slow down as time goes on (2 second long animation?)
        // selected grid cell gets 'selected cell' animation (1 second long animation?)
        // at the end of selected cell animation, apply hit / miss styles to the selected grid cell.

        // 💭 method on playerGameboardComponent `receiveAttack`? called by `billowAttack` event listener.
        // await one of the following:
        // if hit, add cooked to ship unit at that coordinate
        // if miss, add miss styles to grid cell at that coordinate

        // 💭 check end game state
        // check if all player ships are sunk
        // if yes, declare winner
        // if no, toggle turn
      }
    }
  };

  private updateGameboardOnTransition = async (
    gameState: GameState
  ): Promise<void> => {
    if (gameState.currentGamePhase === 'parabellum') {
      // TODO: reset gamePhase SCSS color
      this.resetGame();
    }

    if (gameState.currentGamePhase === 'bellum') {
      if (gameState.currentPlayer === 'player') {
        this.readyPlayerOne();
      }

      // TODO: change gamePhase SCSS color
      const mainContainerTwo = this.mainComponent.mainContainerTwo.element;
      // ? Do I want to manipulate the gameboard in anyway on transition to bellum
    }

    if (gameState.currentGamePhase === 'postBellum') {
      // TODO: change gamePhase SCSS color
      // ? do something fun ?
    }
  };

  private initializeSitRepScroller = (firstPlayer: PlayerType): void => {
    /*
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │   The event listener is dynamically triggered whenever a grid cell          │
    │   container is clicked, with a debounce of 3 seconds to prevent rapid       │
    │   interactions on the game board.                                           │
    │                                                                             │
    │   A front-end API schema story:                                             │
    │   I've implemented a container that manages the display of real-time        │
    │   battlefield situation reports(sit - rep). This system dynamically          │
    │   updates and transitions messages based on game flow. It integrates         │
    │   seamlessly by requiring only an `AttackResult` interface, which           │
    │   encapsulates all necessary data for determining hit / miss status, ship   │
    │   type, and whether a ship has sunk.                                        │
    └─────────────────────────────────────────────────────────────────────────────┘
    */

    if (!this.cycloneSitRepScroller.element) {
      console.error('CycloneSitRepScroller element is null or undefined!');
      return;
    }

    this.cycloneSitRepScroller.initialize(firstPlayer);
  };

  private resetGame = () => {
    this.mainComponent.mainContainerOne.swapFragmentByKey('parabellum');
    this.mainComponent.mainContainerThree.swapFragmentByKey('parabellum');
    this.gameState.resetGameState();

    // ? or re-render the entire dom to ensure no lingering state
    // ? or render a new main component ?
  };
}