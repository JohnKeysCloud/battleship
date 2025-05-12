import { initApp } from './typescript/meta/init-app';
import { DOMController } from './typescript/meta/dom-controller';
import { GameState } from './typescript/state/game-state';
import EventBus from './typescript/utilities/event-bus';
import { BillowBot } from './typescript/services/billow';
class App {
  public readonly eventBus: EventBus;
  public readonly gameState: GameState;
  public readonly domController: DOMController;
  
  // ? move elsewhere if multiplayer is implemented
  public readonly billowBot: BillowBot; // ? or null if multiplayer

  private constructor() {
    this.eventBus = new EventBus();
    this.gameState = new GameState(this.eventBus);
    // ? if multiplayer
    this.billowBot = new BillowBot();
    this.domController = new DOMController(this.gameState, this.billowBot);
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