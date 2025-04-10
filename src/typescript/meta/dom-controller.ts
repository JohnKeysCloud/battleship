import '../../styles/sass/index.scss';

import { GameState } from '../state/game-state';
import { players } from '../state/player-state';
import { CycloneLightboxController } from '../utilities/cycloneLightbox.ts/cyclone-lightbox';

// 💭 markup
import { createHeader } from '../markup/header/header';
import { MainComponent } from '../markup/main/main-component';
import { InstructionsDialogComponent } from '../markup/components/instructions-dialog-component/instructions-dialog-component';
import { CycloneSitRepScroller } from '../utilities/cycloneSitRepScroller.ts/cyclone-sit-rep-scroller';
import { AttackResult, PlayerType } from '../types/state-types';

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
      this.gameState, 
    );

    this.gameState.eventBus.on('transitionToNextPhase', this.transitionToNextPhase);
    this.gameState.eventBus.on('togglePlayerTurn', this.togglePlayerTurn);
    this.gameState.eventBus.on('setAndScrollToNextSitRep', this.cycloneSitRepScroller.setAndScrollToNextSitRep);

    // this.footer = createFooter();
  }

  public render() {
    this.content.appendChild(this.header);
    this.mainComponent.render(this.content);
    this.instructionsDialog.render(document.body);
    // append footer via here
  }

  // ? sets initial turn state styles (I like this name better 😎). {TIMELESS ARTIFACT 💭}
  private readyPlayerOne = (): void => {
    if (this.gameState.currentPlayer === 'player') {
      this.mainComponent.mainContainerTwo.element.classList.add('player-turn');
    }
  }

  private togglePlayerTurn = (): void => {    
    if (this.gameState.currentPlayer === 'player') {
      this.mainComponent.mainContainerTwo.element.classList.add('player-turn');
    } else {
      this.mainComponent.mainContainerTwo.element.classList.remove('player-turn');
    }
  }

  private transitionToNextPhase = async (): Promise<void> => {
    this.mainComponent.mainContainerOne.swapByOrder();

    if (this.gameState.currentGamePhase === 'bellum') {
      this.gameState.setInitialPlayer();
      if (!this.gameState.currentPlayer) throw new Error('Current player must be set in game state.');
        this.initializeSitRepScroller(this.gameState.currentPlayer); // ? make dynamic 
    }

    this.mainComponent.mainContainerThree.swapByOrder();

    await this.updateGameboardOnTransition(this.gameState);
  };

  private updateGameboardOnTransition = async (gameState: GameState): Promise<void> => {
    if (this.gameState.currentGamePhase === 'parabellum') {
      // TODO: reset gamePhase SCSS color 
      this.resetGame();
    }

    if (this.gameState.currentGamePhase === 'bellum') {  
      this.readyPlayerOne();
      // TODO: change gamePhase SCSS color 
      const mainContainerTwo = this.mainComponent.mainContainerTwo.element;
      // ? Do I want to manipulate the gameboard in anyway on transition to bellum
    }
    
    if (this.gameState.currentGamePhase === 'postBellum') {
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