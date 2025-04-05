import { createElement } from "../../../utilities/random-utilities";

import { PlayerGameboardComponent } from "../../components/gameboard-component/player-gameboard-component/player-gameboard-component";
import { OpponentGameboardComponent } from "../../components/gameboard-component/opponent-gameboard-component/opponent-gameboard-component";

import { AttackResult, PlayerState } from "../../../types/state-types";
import EventBus from "../../../utilities/event-bus";
import { GameState } from "../../../state/game-state";

export class MainContainerTwo {
  private readonly mainContainerTwo: HTMLElement;

  private readonly playerGameboardComponent: PlayerGameboardComponent;
  private readonly opponentGameboardComponent: OpponentGameboardComponent;
  
  constructor(
    players: { player: PlayerState; opponent: PlayerState },
    private readonly gameState: GameState 

  ) {
    this.playerGameboardComponent = new PlayerGameboardComponent(players.player, this.gameState.eventBus);
    this.opponentGameboardComponent = new OpponentGameboardComponent(
      players.opponent,
      this.gameState
    );

    this.mainContainerTwo = createElement('section', ['main-container'], {
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

