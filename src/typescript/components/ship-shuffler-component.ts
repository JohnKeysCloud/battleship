import { BattleshipBoardController } from "../logic/bs-gameboard-controller/bs-gameboard-controller";
import { createElement } from "../utilities/random-utilities";
import { Fleet } from "../types/logic-types";
import { randomizeBSGameboard } from "../setup/randomize-bs-gameboard";
import GlobalEventBus from "../utilities/event-bus";

export class ShipShufflerButtonComponent {
  private readonly ShipShufflerButton: HTMLButtonElement;
  private readonly ShipShufflerButtonContainer: HTMLDivElement;
  private readonly ShipShufflerButtonTextContent: string = 'Shuffle Ships';

  constructor(
    private gameboardController: BattleshipBoardController,
    private fleet: Fleet,
    private gameboardTargetSelector: string,
    private id: string = 'randomizer-button',
    private classes: string[] = ['randomizer-button']
  ) {
    this.validateGameboardTarget(this.gameboardTargetSelector);

    this.ShipShufflerButton = this.createShipShufflerButton(this.id, this.classes);
    this.ShipShufflerButton.classList.add(...this.classes);
    this.ShipShufflerButton.textContent = this.ShipShufflerButtonTextContent;
    this.addEventListener(this.ShipShufflerButton);

    this.ShipShufflerButtonContainer = this.createShipShufflerButtonContainer();
    this.ShipShufflerButtonContainer.appendChild(this.ShipShufflerButton);
  }

  public getId() {
    return this.id;
  }

  public render(targetSelector: string) {
    const target: HTMLElement | null = document.querySelector(targetSelector);

    if (!target) {
      throw new Error(`Target element not found: "${targetSelector}."`);
    }

    target.appendChild(this.ShipShufflerButtonContainer);
  }

  private addEventListener(ShipShufflerButton: HTMLButtonElement) {
    ShipShufflerButton.addEventListener('click', () => {
      this.randomizeGameboard();
      this.renderGameboard(this.gameboardTargetSelector);
    });
  }

  private createShipShufflerButton(
    id: string,
    classes: string[]
  ): HTMLButtonElement {
    const button: HTMLButtonElement = createElement('button', [...classes], {
      id,
    });
    return button;
  }

  private createShipShufflerButtonContainer(): HTMLDivElement {
    const container: HTMLDivElement = createElement('div', [
      'randomizer-button-container',
    ]);
    return container;
  }

  private renderGameboard(targetSelector: string) {
    GlobalEventBus.emit('renderGameboard', targetSelector);
  }

  private randomizeGameboard() {
    this.gameboardController.removeAllPieces(this.fleet);
    randomizeBSGameboard(this.gameboardController, this.fleet);
  }

  private validateGameboardTarget(gameboardTargetSelector: string) {
    if (!document.querySelector(gameboardTargetSelector)) {
      throw new Error(
        `Invalid gameboard target selector: "${gameboardTargetSelector}"`
      );
    }
  }
}