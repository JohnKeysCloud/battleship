import { createElement } from "../../../utilities/random-utilities";

import { PlayerGameboardComponent } from "../../components/player-gameboard-component/player-gameboard-component";
import { OpponentGameboardComponent } from "../../components/opponent-gameboard-component/opponent-gameboard-component";

import { PlayerState } from "../../../types/state-types";

export class MainContainerTwo {
  private readonly mainContainerTwo: HTMLElement;

  private readonly playerGameboardComponent: PlayerGameboardComponent;
  private readonly opponentGameboardComponent: OpponentGameboardComponent;
  
  constructor(
    players: { player: PlayerState; opponent: PlayerState }
  ) {
    this.playerGameboardComponent = new PlayerGameboardComponent(players.player);
    this.opponentGameboardComponent = new OpponentGameboardComponent(players.opponent);

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

