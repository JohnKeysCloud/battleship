import { DOMController } from './typescript/meta/dom-controller';
import { GameState } from './typescript/state/game-state';
import EventBus from './typescript/utilities/event-bus';
import { BillowBot } from './typescript/services/billow';
import { FleetVersion } from './typescript/types/logic-types';
import { PlayerCore } from './typescript/types/state-types';
import { initalizePlayerCore } from './typescript/state/player-state';
import { randomizeBSGameboards } from './typescript/meta/init/randomize-gameboard';

class App {
  // Instantiate foundational dependencies
  public readonly eventBus: EventBus = new EventBus();
  public readonly isMultiplayer: boolean = false;
  public readonly version: FleetVersion = 2002;
  public readonly playerCore: PlayerCore = initalizePlayerCore(this.version);

  // Runtime-initialized components
  public readonly gameState: GameState;
  public readonly billowBot: BillowBot | null;
  public readonly domController: DOMController;

  private constructor() {
    randomizeBSGameboards(this.playerCore);

    this.gameState = new GameState(
      this.isMultiplayer,
      this.eventBus,
      this.version
    );
    this.billowBot = !this.isMultiplayer ? new BillowBot(this.gameState) : null;
    this.domController = new DOMController(
      this.gameState,
      this.playerCore,
      this.billowBot
    );
  }

  public static powerOn() {
    const app = new App();
    app.pressStart();

    return app;
  }

  public pressStart = (): void => {
    this.domController.render();
  };
}

console.time('powerOn');
export const app = App.powerOn(); 
console.timeEnd('powerOn');