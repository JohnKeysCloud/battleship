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
      const shipHitCounterLabel = createElement('span', [
        'hit-counter-label',
        `${playerType}-hit-counter-label`,
      ]);
      shipHitCounterLabel.textContent = `${ship.type}:`;

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

      const shipStatusContainer: HTMLDivElement = createElement('div', [
        'ship-status-container',
        `${ship.type}-status-container`,
      ]);
      shipStatusContainer.append(shipHitCounterLabel, hitCounterContainer);

      fleetStatusContainer.appendChild(shipStatusContainer);
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

  const mainContainerThreeBellumWrapper = createElement('div', ['bellum'], {
    id: 'main-container-three-bellum',
  });
  mainContainerThreeBellumWrapper.append(...fleetStatusContainers);

  const bellumFragment = new DocumentFragment();
  bellumFragment.appendChild(mainContainerThreeBellumWrapper);

  return bellumFragment;
}

