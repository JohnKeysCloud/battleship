import { BattleshipBoardController } from "../../logic/bs-gameboard-controller/bs-gameboard-controller";
import { createElement } from "../../utilities/random-utilities";
import { Fleet } from "../../types/logic-types";
import { randomizeBSGameboard } from "../../setup/randomize-bs-gameboard";
import GlobalEventBus from "../../utilities/event-bus";

export class ReadyUpButton {
  private readonly readyUpButton: HTMLButtonElement;
  private readonly readyUpButtonContainer: HTMLDivElement;
  private readonly readyUpButtonTextContent: string = 'Ready Up';
  private readonly buttonClass: string = 'ready-up-button';

  constructor(
    private id: string,
    private gameboardContainer: HTMLElement,
    private gameboardController: BattleshipBoardController,
    private fleet: Fleet // do i need this for this button?
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
      // this.updateGameboard(this.gameboardContainer); // ? this.lockGameBoard?
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

  private readyUp() {
    console.log('Ready up button clicked');

    // handle component
    // remove drag and click listeners from player gameboard
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

  public getId() {
    return this.id;
  }
}