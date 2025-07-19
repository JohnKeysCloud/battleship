    
import { HitPointCollection } from '../../../../types/dom-types';
import { Fleet, ShipType } from "../../../../types/logic-types";
import { PlayerType } from "../../../../types/state-types";
import { capitalize, createElement } from "../../../../utilities/random-utilities";
import { isPlayerType } from '../../../../types/type-guards';

export class ScoreBoardComponent {
  private readonly scoreBoardID: string = 'score-board';
  private readonly scoreBoardContainer: HTMLDivElement;
  private readonly shipLabelList: HTMLDivElement;
  private readonly fleetStatusContainers: HTMLDivElement[];

  constructor(
    private readonly fleets: { [key in PlayerType]: Fleet },
    private readonly shipTypes: ShipType[]
  ) {
    this.fleetStatusContainers = this.createFleetStatusContainers(this.fleets);
    this.shipLabelList = this.createShipLabelList(this.shipTypes);
    this.scoreBoardContainer = this.createScoreBoardContainer();
  }

  public render(targetElement: HTMLElement) {
    if (!targetElement) {
      throw new Error(`Target element not found. Recieved ${targetElement}.`);
    }

    const [
      playerOneFleetStatusContainer,
      playerTwoFleetStatusContainer,
    ]: HTMLDivElement[] = this.fleetStatusContainers;

    this.scoreBoardContainer.append(
      playerOneFleetStatusContainer,
      this.shipLabelList,
      playerTwoFleetStatusContainer
    );

    targetElement.appendChild(this.scoreBoardContainer);
  }

  private createHitPointContainersFragment(
    playerType: PlayerType,
    fleet: Fleet
  ): DocumentFragment {
    const hitPointsFragment: DocumentFragment = new DocumentFragment();

    Object.values(fleet).forEach((ship) => {
      const hitPointContainer: HTMLDivElement = createElement(
        'div',
        ['hit-point-container', `${ship.type}-hit-point-container`],
        {
          id: `${playerType}-${ship.type}-hit-point-container`,
        }
      );

      for (let i = 0; i < ship.length; i++) {
        const hitpointElement: HTMLDivElement = createElement('div', [
          'hit-point',
          `${ship.type}-hit-point`,
          `${playerType}-${ship.type}-hit-point`,
        ]);

        hitPointContainer.append(hitpointElement);
      }

      hitPointsFragment.appendChild(hitPointContainer);
    });

    return hitPointsFragment;
  }

  private createFleetStatusContainer(
    playerType: PlayerType,
    fleet: Fleet
  ): HTMLDivElement {
    const fleetStatusHeading: HTMLHeadingElement = createElement(
      'h3',
      ['fleet-status-heading'],
      {
        id: `${playerType}-fleet-status-heading`,
      }
    );
    fleetStatusHeading.textContent = capitalize(playerType);

    const hitPointContainersFragment: DocumentFragment =
      this.createHitPointContainersFragment(playerType, fleet);

    const fleetStatusContainer: HTMLDivElement = createElement(
      'div',
      ['fleet-status-container'],
      {
        id: `${playerType}-fleet-status-container`,
      }
    );
    fleetStatusContainer.append(fleetStatusHeading, hitPointContainersFragment);

    return fleetStatusContainer;
  }

  private createFleetStatusContainers(fleets: { [key in PlayerType]: Fleet }) {
    const fleetStatusContainers = Object.entries(fleets).map(
      ([playerType, fleet]) => {
        if (!isPlayerType(playerType)) throw new Error('Invalid player type.');

        return this.createFleetStatusContainer(playerType, fleet);
      }
    );

    return fleetStatusContainers;
  }

  private createScoreBoardContainer(): HTMLDivElement {
    const scoreBoardContainer: HTMLDivElement = createElement('div', [], {
      id: `${this.scoreBoardID}-container`,
    });

    return scoreBoardContainer;
  }

  private createShipLabelList(shipTypes: ShipType[]): HTMLDivElement {
    const shipLabelListItemsFragment: DocumentFragment = new DocumentFragment();
    shipTypes.map((shipType) => {
      const shipLabelListElement = createElement(
        'li',
        ['ship-hit-point-label'],
        { id: `${shipType}-hit-point-label` }
      );
      shipLabelListElement.textContent = shipType;

      shipLabelListItemsFragment.appendChild(shipLabelListElement);
    });

    const shipLabelList: HTMLDivElement = createElement('div', [], {
      id: 'ship-label-list',
    });
    shipLabelList.appendChild(shipLabelListItemsFragment);

    return shipLabelList;
  }
}
