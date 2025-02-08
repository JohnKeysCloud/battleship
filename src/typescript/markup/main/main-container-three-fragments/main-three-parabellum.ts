import { PlayerGameboardComponent } from "../../../components/player-gameboard-component/player-gameboard-component";
import { BattleshipBoardController } from "../../../logic/bs-gameboard-controller/bs-gameboard-controller";
import { Fleet } from "../../../types/logic-types";
import { createElement } from "../../../utilities/random-utilities";
import { ShipShufflerButtonComponent } from "../../../components/ship-shuffler-component/ship-shuffler-component";
import { ReadyUpButton } from "../../../components/ready-up-component/ready-up-component";

export function createMainThreeParabellumFragment(
  playerGameboardComponent: PlayerGameboardComponent,
  gameboardController: BattleshipBoardController,
  fleet: Fleet
): DocumentFragment {
  const shipShufflerButton = new ShipShufflerButtonComponent(
    playerGameboardComponent.id,
    playerGameboardComponent.gameboardContainer,
    gameboardController,
    fleet
  );
  
  const readyUpButton = new ReadyUpButton(
    playerGameboardComponent,
    shipShufflerButton
  );
  
  const mainContainerThreeParabellumWrapper: HTMLDivElement = createElement(
    'div',
    ['parabellum'],
    {
      id: 'main-container-three-parabellum',
    }
  );
  shipShufflerButton.render(mainContainerThreeParabellumWrapper);
  readyUpButton.render(mainContainerThreeParabellumWrapper);

  const parabellumFragment = new DocumentFragment();
  parabellumFragment.appendChild(mainContainerThreeParabellumWrapper);

  return parabellumFragment;
};

