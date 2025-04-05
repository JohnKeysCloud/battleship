import { initApp } from './typescript/meta/init-app';
import { DOMController } from './typescript/meta/dom-controller';
import { GameState } from './typescript/state/game-state';
import EventBus from './typescript/utilities/event-bus';
class App {
  public readonly eventBus: EventBus;
  public readonly gameState: GameState;
  public readonly domController: DOMController;

  private constructor() {
    this.eventBus = new EventBus();
    this.gameState = new GameState(this.eventBus);
    this.domController = new DOMController(this.gameState);
  }

  public static powerOn() {
    console.time('Loading');
    initApp(); 
    console.timeEnd('Loading');

    return new App();
  }

  public pressStart() {
    this.domController.render();
  }
}

console.time('powerOn');
export const app = App.powerOn();
console.timeEnd('powerOn');

console.time('pressStart');
app.pressStart();
console.timeEnd('pressStart');