import { createElement } from "../../../../utilities/random-utilities";
import { PlayerGameboardComponent } from "../../gameboard-component/player-gameboard-component/player-gameboard-component";
import { InstructionsComponent } from "../instructions-component/instructions-component";
import { ShipShufflerButtonComponent } from "../ship-shuffler-component/ship-shuffler-component";
import './ready-up-component.scss';

// ! for testing
import { app } from "../../../../../app";

export class ReadyUpButtonComponent {
  private readonly readyUpButton: HTMLButtonElement;
  private readonly readyUpButtonContainer: HTMLDivElement;
  private readonly readyUpButtonTextContent: string = 'Ready Up';
  private readonly buttonId: string = 'ready-up-button';

  #listenerAttached: boolean = false;

  private readonly readyUp: () => void = () => { // TODO: replace any with GameState?
    this.anchorShips();
    this.removeParabellumButtonListeners();
    this.transitionToBellum(); 
  };

  constructor(
    private playerGameboardComponent: PlayerGameboardComponent,
    private shipShufflerButton: ShipShufflerButtonComponent,
    private instructionsButton: InstructionsComponent,
    private transitionToNextPhase: () => void
  ) {
    this.readyUpButton = this.createReadyUpButton(this.buttonId);

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

    // ! for testing
    this.playerGameboardComponent.gameboardContainer.addEventListener('click', () => app.gameState.togglePlayerTurn());
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

  private removeParabellumButtonListeners() {
    this.shipShufflerButton.toggleEventListener();
    this.instructionsButton.toggleEventListener();
    this.toggleEventListener();
  }

  private transitionToBellum() {
    this.transitionToNextPhase();
  }
}