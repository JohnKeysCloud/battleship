import { DOMController } from './typescript/meta/dom-controller';
import { GameState } from './typescript/state/game-state';
import EventBus from './typescript/utilities/event-bus';
import { BillowBot } from './typescript/services/billow';
import { FleetVersion } from './typescript/types/logic-types';
import { PlayerCore } from './typescript/types/state-types';
import { initalizePlayerCore } from './typescript/state/player-state';
import { randomizeBSGameboards } from './typescript/meta/init/randomize-gameboard';

export class App {
  // Instantiate foundational dependencies
  public readonly isMultiplayer: boolean = false;
  public readonly version: FleetVersion = 1990;
  public eventBus: EventBus = new EventBus();
  public playerCore: PlayerCore = initalizePlayerCore(this.version);

  // Runtime-initialized components
  public readonly gameState: GameState;
  public billowBot: BillowBot | null;
  public domController: DOMController;

  private constructor() {
    randomizeBSGameboards(this.playerCore);

    this.gameState = new GameState(
      this.playerCore,
      this.eventBus,
      this.isMultiplayer,
      this.version
    );
    this.billowBot = !this.isMultiplayer
      ? new BillowBot(this.gameState)
      : null;
    this.domController = new DOMController(
      this.gameState,
      this.playerCore,
      this.billowBot
    );
  }

  public static pressStart() {
    const app = new App();
    app.bootUp();
    return app;
  }

  public bootUp = (): void => {
    console.time('bootUp');
    this.domController.render();
    console.timeEnd('bootUp');
  };
}

console.time('pressStart');
App.pressStart(); 
console.timeEnd('pressStart');