import { initApp } from './typescript/meta/init-app';
import { DOMController } from './typescript/meta/dom-controller';
import { GameState } from './typescript/state/game-state';

class App {
  public readonly domController: DOMController;
  public readonly gameState: GameState;

  private constructor() {
    this.gameState = new GameState();
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