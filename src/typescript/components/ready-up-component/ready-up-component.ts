import { createElement } from "../../utilities/random-utilities";
import { PlayerGameboardComponent } from "../player-gameboard-component/player-gameboard-component";
import { ShipShufflerButtonComponent } from "../ship-shuffler-component/ship-shuffler-component";
import './ready-up-component.scss';

interface GameState {
  playerTurn: 'player' | 'opponent'; 
  gamePhase: 'parabellum' | 'bellum' | 'postBellum';
}

export class ReadyUpButton {
  private readonly readyUpButton: HTMLButtonElement;
  private readonly readyUpButtonContainer: HTMLDivElement;
  private readonly readyUpButtonTextContent: string = 'Ready Up';
  private readonly buttonClass: string = 'ready-up-button';

  constructor(
    private playerGameboardComponent: PlayerGameboardComponent,
    private shipShufflerButton: ShipShufflerButtonComponent
  ) {
    // ! check for constructor errors

    this.readyUpButton = this.createReadyUpButton(this.buttonClass);

    this.readyUpButton.classList.add(this.buttonClass);
    this.addEventListener(this.readyUpButton);

    this.readyUpButtonContainer = this.createReadyUpButtonContainer();
    this.readyUpButtonContainer.appendChild(this.readyUpButton);
  }

  private addEventListener(readyUpButton: HTMLButtonElement) {
    readyUpButton.addEventListener('click', () => {
      this.readyUp(); 
    });
  }

  private createReadyUpButton(
    id: string,
  ): HTMLButtonElement {
    const readyUpTextSpan = createElement('span', ['ready-up-button-text']);
    readyUpTextSpan.textContent = this.readyUpButtonTextContent;

    const inactiveReadyUpButton = createElement(
      'img',
      ['inactive-ready-up-button'],
      {
        alt: 'Ready Up (Inactive)',
        src: 'https://cyclone-studios.s3.us-east-2.amazonaws.com/s3_cyclone-studios/assets/images/big-red-button/btn-inactive.svg',
      }
    );

    const activeReadyUpButton = createElement(
      'img',
      ['active-ready-up-button'],
      {
        alt: 'Ready Up (Active)',
        src: 'https://cyclone-studios.s3.us-east-2.amazonaws.com/s3_cyclone-studios/assets/images/big-red-button/btn-active.svg',
      }
    );

    const button: HTMLButtonElement = createElement('button', [], {
      id,
    });
    button.append(
      activeReadyUpButton,
      inactiveReadyUpButton,
      readyUpTextSpan
    );

    return button;
  }

  private createReadyUpButtonContainer(): HTMLDivElement {
    const container: HTMLDivElement = createElement('div', [
      'ready-up-button-container',
    ]);
    return container;
  }

  public async readyUp(): Promise<any> {
    console.log('Ready up button clicked');

    this.lockGameboard();
    // remove drag and click listeners from player gameboard
    // remove `adrift` class from gameboard

    // await this.randomizeTurnState(); // return Math.random() > 0.5 ? 'player' : 'opponent';

    this.transitionToPhaseTwo();

    // adjust game state

    // ? do i need this?
    // this.gameboardController.lockShips();
  }

  public render(targetElement: HTMLElement) {
    if (!targetElement) {
      throw new Error(`Target element not found. Recieved ${targetElement}.`);
    }

    targetElement.appendChild(this.readyUpButtonContainer);
  }

  // 💭 --------------------------------------------------------------
  // 💭 Helpers

  // 💭 --------------------------------------------------------------
  // 💭 Utilities

  private lockGameboard() {
    // remove event listners from gameboard
    this.playerGameboardComponent.toggleGameboardContainerEventListeners();

    // remove draggable attr from ships
    this.playerGameboardComponent.toggleShipsDraggable();

    // remove `adrift` class from gameboard
    this.playerGameboardComponent.toggleShipAdriftClass();

    this.shipShufflerButton.toggleEventListener();

    // what else bitch?
    // remove listener from shuffle button 
  }

  private transitionToPhaseTwo() {
    // change game phase state to bellum
    //

  }


}