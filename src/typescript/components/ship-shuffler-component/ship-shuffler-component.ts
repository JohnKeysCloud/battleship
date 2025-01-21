import { BattleshipBoardController } from "../../logic/bs-gameboard-controller/bs-gameboard-controller";
import { createElement } from "../../utilities/random-utilities";
import { Fleet } from "../../types/logic-types";
import { randomizeBSGameboard } from "../../setup/randomize-bs-gameboard";
import GlobalEventBus from "../../utilities/event-bus";

export class ShipShufflerButtonComponent {
  private readonly shipShufflerButton: HTMLButtonElement;
  private readonly shipShufflerButtonContainer: HTMLDivElement;
  private readonly shipShufflerButtonTextContent: string = 'Shuffle';
  private readonly buttonClass: string = 'ship-shuffler-button'

  constructor(
    private id: string,
    private gameboardContainer: HTMLElement,
    private gameboardController: BattleshipBoardController,
    private fleet: Fleet,
  ) {
    this.shipShufflerButton = this.createshipShufflerButton(
      `${this.id}-${this.buttonClass}`,
      [this.buttonClass]
    );
    this.shipShufflerButton.classList.add(this.buttonClass);
    this.shipShufflerButton.textContent = this.shipShufflerButtonTextContent;
    this.addEventListener(this.shipShufflerButton);

    this.shipShufflerButtonContainer = this.createshipShufflerButtonContainer();
    this.shipShufflerButtonContainer.appendChild(this.shipShufflerButton);
  }

  public render(targetElement: HTMLElement) {
    if (!targetElement) {
      throw new Error(`Target element not found. Recieved ${targetElement}.`);
    }

    targetElement.appendChild(this.shipShufflerButtonContainer);
  }

  // 💭 --------------------------------------------------------------
  // 💭 Helpers

  private addEventListener(shipShufflerButton: HTMLButtonElement) {
    shipShufflerButton.addEventListener('click', () => {
      this.randomizeGameboard();
      this.updateGameboard(this.gameboardContainer);
    });
  }

  private createshipShufflerButton(
    id: string,
    classes: string[]
  ): HTMLButtonElement {
    const button: HTMLButtonElement = createElement('button', [...classes], {
      id,
    });
    return button;
  }

  private createshipShufflerButtonContainer(): HTMLDivElement {
    const container: HTMLDivElement = createElement('div', [
      'ship-shuffler-button-container',
    ]);
    return container;
  }

  private randomizeGameboard() {
    this.gameboardController.removeAllPieces(this.fleet);
    randomizeBSGameboard(this.gameboardController, this.fleet);
  }

  private updateGameboard(gameboardContainer: HTMLElement) {
    GlobalEventBus.emit('updateGameboard', gameboardContainer);
  }

  // 💭 --------------------------------------------------------------
  // 💭 Utilities

  public getId() {
    return this.id;
  }
}