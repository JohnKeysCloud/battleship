import { BattleshipBoardController } from "../../../../logic/bs-gameboard-controller/bs-gameboard-controller";
import { createElement } from "../../../../utilities/random-utilities";
import { Fleet } from "../../../../types/logic-types";
import { randomizeBSGameboard } from "../../../../setup/randomize-bs-gameboard";
import './ship-shuffler-component.scss';
import { GameState } from "../../../../state/game-state";

export class ShipShufflerButtonComponent {
  private readonly shipShufflerButton: HTMLButtonElement;
  private readonly shipShufflerButtonContainer: HTMLDivElement;
  private readonly shipShufflerButtonTextContent: string = 'Shuffle';
  private readonly buttonClass: string = 'ship-shuffler-button';

  #listenerAttached: boolean = false;
  private readonly shuffleShips: () => void = () => {
    this.randomizeGameboard();
    this.updateGameboard();
  };

  constructor(
    private id: string,
    // private gameboardContainer: HTMLElement, // TODO: do i need this?
    private gameboardController: BattleshipBoardController,
    private fleet: Fleet,
    private gameState: GameState
  ) {
    this.shipShufflerButton = this.createshipShufflerButton(
      `${this.id}-${this.buttonClass}`,
      [this.buttonClass]
    );
    this.shipShufflerButton.classList.add(this.buttonClass);
    this.shipShufflerButton.textContent = this.shipShufflerButtonTextContent;
    this.toggleEventListener();

    this.shipShufflerButtonContainer = this.createshipShufflerButtonContainer();
    this.shipShufflerButtonContainer.appendChild(this.shipShufflerButton);
  }

  public render(targetElement: HTMLElement) {
    if (!targetElement) {
      throw new Error(`Target element not found. Recieved ${targetElement}.`);
    }

    targetElement.appendChild(this.shipShufflerButtonContainer);
  }

  public toggleEventListener() {
    if (this.#listenerAttached === true) {
      this.shipShufflerButton.removeEventListener('click', this.shuffleShips)
      this.#listenerAttached = false;
    } else {
      this.shipShufflerButton.addEventListener('click', this.shuffleShips);
      this.#listenerAttached = true;
    }
  }

  // 💭 --------------------------------------------------------------
  // 💭 Helpers

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

  private updateGameboard(): void {
    this.gameState.eventBus.emit('refreshGameboard');
  }

  // 💭 --------------------------------------------------------------
  // 💭 Utilities

  public getId() {
    return this.id;
  }
}