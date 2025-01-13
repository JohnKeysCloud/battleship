import { BattleshipBoardController } from "../../logic/bs-gameboard-controller/bs-gameboard-controller";
import { createElement, createIdentifier } from "../../utilities/random-utilities";
import { Fleet } from "../../types/logic-types";
import { randomizeBSGameboard } from "../../setup/randomize-bs-gameboard";
import GlobalEventBus from "../../utilities/event-bus";

export class ShipShufflerButtonComponent {
  private readonly shipShufflerButton: HTMLButtonElement;
  private readonly shipShufflerButtonContainer: HTMLDivElement;
  private readonly shipShufflerButtonTextContent: string = 'Shuffle Ships';
  private readonly buttonClass: string = 'ship-shuffler-button'

  constructor(
    private id: string,
    private gameboardController: BattleshipBoardController,
    private fleet: Fleet,
    private gameboardTargetSelector: string,
  ) {
    this.validateGameboardTarget(this.gameboardTargetSelector);

    this.shipShufflerButton = this.createshipShufflerButton(
      createIdentifier(this.id, 'player', this.buttonClass),
      [this.buttonClass]
    );
    this.shipShufflerButton.classList.add(this.buttonClass);
    this.shipShufflerButton.textContent = this.shipShufflerButtonTextContent;
    this.addEventListener(this.shipShufflerButton);

    this.shipShufflerButtonContainer = this.createshipShufflerButtonContainer();
    this.shipShufflerButtonContainer.appendChild(this.shipShufflerButton);
  }

  public render(targetSelector: string) {
    const target: HTMLElement | null = document.querySelector(targetSelector);

    if (!target) {
      throw new Error(`Target element not found: "${targetSelector}."`);
    }

    target.appendChild(this.shipShufflerButtonContainer);
  }

  // 💭 --------------------------------------------------------------
  // 💭 Helpers

  private addEventListener(shipShufflerButton: HTMLButtonElement) {
    shipShufflerButton.addEventListener('click', () => {
      this.randomizeGameboard();
      this.updateGameboard(this.gameboardTargetSelector);
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

  private updateGameboard(targetSelector: string) {
    GlobalEventBus.emit('updateGameboard', targetSelector);
  }

  private validateGameboardTarget(gameboardTargetSelector: string) {
    if (!document.querySelector(gameboardTargetSelector)) {
      throw new Error(
        `Invalid gameboard target selector: "${gameboardTargetSelector}"`
      );
    }
  }

  // 💭 --------------------------------------------------------------
  // 💭 Utilities

  public getId() {
    return this.id;
  }
}