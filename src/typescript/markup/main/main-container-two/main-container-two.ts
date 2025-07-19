import { createElement } from "../../../utilities/random-utilities";

import { PlayerGameboardComponent } from "../../components/gameboard-component/player-gameboard-component/player-gameboard-component";
import { OpponentGameboardComponent } from "../../components/gameboard-component/opponent-gameboard-component/opponent-gameboard-component";

import { PlayerCore } from "../../../types/state-types";
import { GameState } from "../../../state/game-state";

export class MainContainerTwo {
  private readonly mainContainerTwo: HTMLElement;

  private readonly playerGameboardComponent: PlayerGameboardComponent;
  private readonly opponentGameboardComponent: OpponentGameboardComponent;
  
  constructor(
    private readonly playerCore: PlayerCore,
    private readonly gameState: GameState 

  ) {
    this.playerGameboardComponent = new PlayerGameboardComponent(
      this.playerCore.player,
      this.gameState
    );
    this.opponentGameboardComponent = new OpponentGameboardComponent(
      this.playerCore.opponent,
      this.gameState
    );

    this.mainContainerTwo = createElement('section', ['main-container', 'parabellum'], {
      id: 'main-container-two',
    });
  }

  get element() { 
    return this.mainContainerTwo;
  }

  get playerGameboard() {
    return this.playerGameboardComponent;
  }

  get opponentGameboard() {
    return this.opponentGameboardComponent;
  }

  render(targetElement: HTMLElement) {
    this.playerGameboardComponent.render(this.mainContainerTwo);
    this.opponentGameboardComponent.render(this.mainContainerTwo);

    targetElement.appendChild(this.mainContainerTwo);
  }
}

