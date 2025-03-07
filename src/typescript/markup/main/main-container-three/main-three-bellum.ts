import { capitalize, createElement } from "../../../utilities/random-utilities";
import { players } from "../../../state/player-state";
import { Fleet } from "../../../types/logic-types";
import { PlayerType } from "../../../types/state-types";
import { isPlayerType } from "../../../types/type-guards";

export function createMainThreeBellumFragment(): DocumentFragment {
  const createFleetStatusContainer = (playerType: PlayerType, fleet: Fleet) => {
    const fleetStatusHeading: HTMLHeadingElement = createElement(
      'h3',
      ['fleet-status-heading'],
      {
        id: `${playerType}-fleet-status-heading`,
      }
    );
    fleetStatusHeading.textContent = capitalize(playerType);

    const fleetStatusContainer: HTMLDivElement = createElement(
      'div',
      ['fleet-status-container'],
      {
        id: `${playerType}-fleet-status-container`,
      }
    );
    fleetStatusContainer.appendChild(fleetStatusHeading);

    Object.values(fleet).forEach((ship) => {
      const hitCounterContainer: HTMLDivElement = createElement(
        'div',
        ['hit-counter-container', `${ship.type}-hit-counter-container`],
        {
          id: `${playerType}-${ship.type}-hit-counter-container`,
        }
      );

      for (let i = 0; i < ship.length; i++) {
        const hitCounterElement: HTMLDivElement = createElement('div', [
          'hitpoint',
          `${ship.type}-hitpoint`,
          `${playerType}-${ship.type}-hitpoint`,
        ]);

        hitCounterContainer.append(hitCounterElement);
      }

      fleetStatusContainer.appendChild(hitCounterContainer);
    });

    return fleetStatusContainer
  }

  const fleetStatusContainers = Object.entries(players).map(
    ([playerType, playerData]) => {
      if (!isPlayerType(playerType)) throw new Error('Invalid player type.');

      return createFleetStatusContainer(
        playerType,
        playerData.fleetBuilder.fleet
      )
    }
  );

  const shipLabelListItemsFragment = new DocumentFragment();
  Object.values(players.player.fleetBuilder.fleet).map(ship => {
    const shipLabelListElement = createElement('li', ['ship-hit-counter-label'], { id: `${ship.type}-hit-counter-label` });
    shipLabelListElement.textContent = ship.type;
    
    shipLabelListItemsFragment.appendChild(shipLabelListElement);
  });

  const shipLabelList = createElement('div', [], { id: 'ship-label-list' });
  shipLabelList.appendChild(shipLabelListItemsFragment);

  const mainContainerThreeBellumWrapper = createElement('div', ['bellum'], {
    id: 'main-container-three-bellum',
  });

  const [playerOneFleetStatusContainer, playerTwoFleetStatusContainer] = fleetStatusContainers;
  mainContainerThreeBellumWrapper.append(
    playerOneFleetStatusContainer,
    shipLabelList,
    playerTwoFleetStatusContainer
  );

  const bellumFragment = new DocumentFragment();
  bellumFragment.appendChild(mainContainerThreeBellumWrapper);

  return bellumFragment;
}

