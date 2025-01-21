import { createElement } from "../../../utilities/random-utilities";

import { PlayerGameboardComponent } from "../../../components/player-gameboard-component/player-gameboard-component";
import { OpponentGameboardComponent } from "../../../components/opponent-gameboard-component/opponent-gameboard-component";

export class MainContainerTwo {
  private readonly mainContainerTwo: HTMLElement;
  
  constructor(
    private readonly playerGameboardComponent: PlayerGameboardComponent,
    private readonly opponentGameboardComponent: OpponentGameboardComponent
  ) {
    this.mainContainerTwo = createElement('section', ['main-container'], {
      id: 'main-container-two',
    });
  }

  get getPlayerGameboardComponent() {
    return this.playerGameboardComponent;
  }

  render(targetElement: HTMLElement) {
    this.playerGameboardComponent.render(this.mainContainerTwo);
    this.opponentGameboardComponent.render(this.mainContainerTwo);

    targetElement.appendChild(this.mainContainerTwo);
  }
}

