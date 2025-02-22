import '../../styles/sass/index.scss';

import { GameState } from '../state/game-state';
import { players } from '../state/player-state';
import { CycloneLightboxController } from '../utilities/cycloneLightbox.ts/cyclone-lightbox';

// 💭 markup
import { createHeader } from '../markup/header/header';
import { MainComponent } from '../markup/main/main-component';
import { InstructionsDialogComponent } from '../markup/components/instructions-dialog-component/instructions-dialog-component';
// import { instructionsDialog } from '../markup/lightboxes/instructions-dialog';

// 💭 --------------------------------------------------------------

export class DOMController {
  public readonly instructionsLightboxController: CycloneLightboxController;
  public readonly mainComponent: MainComponent;

  private readonly content: HTMLElement;
  private readonly header: HTMLElement;
  private readonly instructionsDialog: InstructionsDialogComponent;
  // private readonly footer: HTMLElement;

  constructor(private readonly gameState: GameState) {
    if (!document) throw new Error('Fuck!');

    const content = document.getElementById('content');
    if (!content) throw new Error('Shit!');

    this.content = content;
    this.header = createHeader();
    this.instructionsDialog = new InstructionsDialogComponent();
    this.instructionsLightboxController = new CycloneLightboxController(
      this.instructionsDialog.element,
      'instructions-dialog-close-button'
    );
    this.mainComponent = new MainComponent(
      players,
      this.instructionsLightboxController,
      this.transitionToNextPhase,
    );
    // this.footer = createFooter();
  }

  public render() {
    this.content.appendChild(this.header);
    this.mainComponent.render(this.content);
    this.instructionsDialog.render(document.body);
    // append footer via this.footer
  }

  private transitionToNextPhase = async () => {
    this.gameState.setNextPhase();

    this.mainComponent.mainContainerOne.swapByOrder();
    this.mainComponent.mainContainerThree.swapByOrder();
    
    await this.updateGameboardContainer(this.gameState);
  }

  private updateGameboardContainer = async (gameState: GameState) => {
    if (this.gameState.currentGamePhase === 'parabellum') {
      this.resetGame();
    }

    if (this.gameState.currentGamePhase === 'bellum') {
      // use game state to
      const mainContainerTwo = this.mainComponent.mainContainerTwo.element;
      
      gameState.setInitialPlayer();

      // TODO: Add turn randomization animation
      // ? Randomzation animation and potential board swap will be async
      // ? so we need to await the completion of the animation before
      // ? potentially swapping the active board and continuing the game

      console.log(gameState.currentPlayer);
      if (gameState.currentPlayer === 'opponent') mainContainerTwo.classList.add('opponent-turn');
    }

    if (this.gameState.currentGamePhase === 'postBellum') {
      // ? do something fun ?
    }
  };

  private resetGame = () => {
    this.mainComponent.mainContainerOne.swapFragmentByKey('parabellum');
    this.mainComponent.mainContainerThree.swapFragmentByKey('parabellum');
    this.gameState.resetGameState();

    // ? or re-render the entire dom to ensure no lingering state 
    // ? or render a new main component ?
  }
}