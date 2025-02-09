import { createElement } from "../../../utilities/random-utilities";
import { PlayerGameboardComponent } from "../../player-gameboard-component/player-gameboard-component";
import { ShipShufflerButtonComponent } from "../ship-shuffler-component/ship-shuffler-component";
import './ready-up-component.scss';

// move to `state` folder
interface GameState {
  playerTurn: 'player' | 'opponent'; 
  gamePhase: 'parabellum' | 'bellum' | 'postBellum';
}

export class ReadyUpButton {
  private readonly readyUpButton: HTMLButtonElement;
  private readonly readyUpButtonContainer: HTMLDivElement;
  private readonly readyUpButtonTextContent: string = 'Ready Up';
  private readonly buttonClass: string = 'ready-up-button';

  #listenerAttached: boolean = false;

  private readonly readyUp: () => Promise<any> = async () => { // TODO: replace any with GameState?
    this.anchorShips();
    this.removeParabellumButtonListeners();

    // TODO:
    await this.randomizeTurnState(); // return Math.random() > 0.5 ? 'player' : 'opponent';
    await this.transitionToBellum(); 
  };

  constructor(
    private playerGameboardComponent: PlayerGameboardComponent,
    private shipShufflerButton: ShipShufflerButtonComponent
  ) {
    this.readyUpButton = this.createReadyUpButton(this.buttonClass);

    this.readyUpButton.classList.add(this.buttonClass);
    this.toggleEventListener();

    this.readyUpButtonContainer = this.createReadyUpButtonContainer();
    this.readyUpButtonContainer.appendChild(this.readyUpButton);
  }

  public render(targetElement: HTMLElement) {
    if (!targetElement) {
      throw new Error(`Target element not found. Recieved ${targetElement}.`);
    }

    targetElement.appendChild(this.readyUpButtonContainer);
  }

  public toggleEventListener() {
    if (this.#listenerAttached === true) {
      this.readyUpButton.removeEventListener('click', this.readyUp);
      this.#listenerAttached = false;
    } else {
      this.readyUpButton.addEventListener('click', this.readyUp);
      this.#listenerAttached = true;
    }
  }

  // 💭 --------------------------------------------------------------

  private anchorShips() {
    // remove event listners from gameboard
    this.playerGameboardComponent.toggleGameboardContainerEventListeners();

    // remove draggable attribute from ships
    this.playerGameboardComponent.toggleShipsDraggable();

    // remove `adrift` class from ship containers
    this.playerGameboardComponent.toggleShipAdriftClass();
  }

  private createReadyUpButton(id: string): HTMLButtonElement {
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
    button.append(activeReadyUpButton, inactiveReadyUpButton, readyUpTextSpan);

    return button;
  }

  private createReadyUpButtonContainer(): HTMLDivElement {
    const container: HTMLDivElement = createElement('div', [
      'ready-up-button-container',
    ]);
    return container;
  }

  private async randomizeTurnState() {
    console.log('buttpoop');
  }

  private removeParabellumButtonListeners() {
    // TODO:
    // create instructions button component
    // import into main container one parabellum fragment and render
    // access instructions button component & remove instructions button listener
    this.shipShufflerButton.toggleEventListener();
    this.toggleEventListener();
  }

  private async transitionToBellum() {
    // change game phase state to bellum
    console.log('poopbutt');
  }
}