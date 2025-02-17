import { initApp } from './typescript/meta/init-app';
import { DOMController } from './typescript/meta/dom-controller';

class App {
  public readonly domController: DOMController;

  private constructor() {
    this.domController = new DOMController();
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
const app = App.powerOn();
console.timeEnd('powerOn');

console.time('pressStart');
app.pressStart();
console.timeEnd('pressStart');