import './score-board-component.scss';
import { HitMarkPayload, HitPointMap } from './score-board.types';

import { GameState } from '../../../state/game-state';
import { Fleet, FleetSet, ShipType } from "../../../types/logic-types";
import { PlayerType } from "../../../types/state-types";
import { isHTMLDivElement, isPlayerType } from '../../../types/type-guards';

import { capitalize, createElement } from "../../../utilities/random-utilities";

export class ScoreBoardComponent {
  private readonly scoreBoardID: string = 'score-board';
  private readonly scoreBoardContainer: HTMLDivElement;
  private readonly shipLabelList: HTMLDivElement;
  private readonly fleetStatusContainers: HTMLDivElement[];
  public readonly hitPointMap: HitPointMap = {
    player: {
      battleship: [],
      carrier: [],
      cruiser: [],
      destroyer: [],
      patrolBoat: [],
      submarine: [],
    },
    opponent: {
      battleship: [],
      carrier: [],
      cruiser: [],
      destroyer: [],
      patrolBoat: [],
      submarine: [],
    },
  };

  constructor(
    private readonly gameState: GameState,
    private readonly fleets: FleetSet,
    private readonly shipTypes: ShipType[],
  ) {
    this.fleetStatusContainers = this.createFleetStatusContainers(this.fleets);
    this.shipLabelList = this.createShipLabelList(this.shipTypes);
    this.scoreBoardContainer = this.createScoreBoardContainer();

    this.gameState.eventBus.on('markNextHitPoint',this.markNextHitPoint);
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

      this.storeShipHitPointData(hitPointContainer, playerType, ship.type);

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

  private createFleetStatusContainers(fleets: FleetSet) {
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

  private markNextHitPoint = (hitMarkPayload: HitMarkPayload): void => {
    const { playerType, shipType } = hitMarkPayload;

    if (!this.hitPointMap[playerType]?.[shipType]) {
      throw new Error(`Missing hit-point data for: ${playerType} - ${shipType}.`);
    }
    
    const nextHitPoint = this.hitPointMap[playerType][shipType].pop();
    nextHitPoint?.classList.add('hit');
  }

  private storeShipHitPointData(
    hitPointContainer: HTMLDivElement,
    playerType: PlayerType,
    shipType: ShipType
  ): void {
    const reversedHitPointArray = Array.from(
      hitPointContainer.children
    ).reverse();

    this.hitPointMap[playerType][shipType] =
      reversedHitPointArray.filter(isHTMLDivElement);
  }
}