import {
  Coordinates,
  CoordinatesArray,
  Fleet,
  Gameboard,
  IPlacementConfigurations,
  Orientation,
  ShipLength,
  ShipSymbolValue,
  ShipSymbolValueArray,
  ShipType
} from '../../../../types/logic-types';
import {
  createElement
} from '../../../../utilities/random-utilities';
import { AttackResult, PlayerState } from '../../../../types/state-types';
import '../gameboard-component.scss';
import '../gameboard-animations.scss';

import { isShipType } from '../../../../types/type-guards';
import { BattleshipBuilder } from '../../../../logic/bs-ship-builder/bs-ship-builder';
import { GridPlacementValue } from '../../../../types/css-types';
import { BattleshipFleetBuilder } from '../../../../logic/bs-fleet-builder/bs-fleet-builder';

export class OpponentGameboardComponent {
  private readonly id: string = 'opponent';

  private gameboardContainer: HTMLDivElement;
  private fleetElements: Map<ShipType, HTMLDivElement> = new Map();

  private listenersAdded: boolean = false;

  constructor(
    public readonly playerState: PlayerState,
    private readonly setAndScrollToNextSitRep: (
      attackResult: AttackResult
    ) => void,
    private readonly togglePlayerTurn: () => void,
    private readonly transitionToNextPhase: () => void
  ) {
    this.gameboardContainer = this.generateBoardContainer(
      this.playerState.gameboardBuilder.boardSize
    );

    this.updateFleetElements(this.playerState.fleetBuilder);
  }

  public render(targetElement: HTMLElement): void {
    if (!targetElement) {
      throw new Error(
        `Target element not found with ID - ${this.id} and selector - "${targetElement}".`
      );
    }

    const gameboard: DocumentFragment = this.generateBoardFragment(
      this.playerState.gameboardBuilder.boardSize
    );
    this.gameboardContainer.appendChild(gameboard);

    this.placeFleetOnGameboard(this.fleetElements);

    this.toggleGameboardContainerEventListeners();

    targetElement.appendChild(this.gameboardContainer);
  }

  public toggleGameboardContainerEventListeners(): void {
    if (!this.gameboardContainer) return;

    const method = this.listenersAdded
      ? 'removeEventListener'
      : 'addEventListener';

    this.gameboardContainer[method](
      'click',
      this.handleCellClick as EventListener
    );
  }

  // 💭 --------------------------------------------------------------
  // 💭 Helpers

  private setGridPlacementValue(
    gridPlacementValue: GridPlacementValue,
    gridCrossAxis: number,
    shipContainerElement: HTMLDivElement,
    orientation: Orientation,
    shipLength: ShipLength
  ): void {
    const isHorizontal: boolean = orientation === 'horizontal';
    if (isHorizontal) {
      shipContainerElement.style.gridColumn = gridPlacementValue;
      shipContainerElement.style.gridRow = gridCrossAxis.toString();
      shipContainerElement.style.gridTemplateColumns = `repeat(${shipLength}, 1fr)`;
    } else {
      shipContainerElement.style.gridRow = gridPlacementValue;
      shipContainerElement.style.gridColumn = gridCrossAxis.toString();
      shipContainerElement.style.gridTemplateRows = `repeat(${shipLength}, 1fr)`;
    }
  }

  private createBackgroundCellsFragment(
    gameboard: Gameboard
  ): DocumentFragment {
    const cellFragment: DocumentFragment = new DocumentFragment();

    gameboard.forEach((row: ShipSymbolValueArray, rowIndex: number) => {
      row.forEach((_: ShipSymbolValue, colIndex: number) => {
        const hitMarker: HTMLDivElement = createElement('div', [
          `${this.id}-hit-marker`,
          'hit-marker',
        ]);

        const gridCell: HTMLDivElement = createElement(
          'div',
          [`${this.id}-grid-cell`, 'grid-cell'],
          {
            'data-x': colIndex.toString(),
            'data-y': rowIndex.toString(),
            'aria-label': `Row ${rowIndex + 1}, Column ${colIndex + 1}`,
            role: 'gridCell',
          }
        );
        gridCell.appendChild(hitMarker);

        const gridCellContainer: HTMLDivElement = createElement('div', [
          `${this.id}-grid-cell-container`,
          'grid-cell-container',
        ]);
        gridCellContainer.appendChild(gridCell);

        cellFragment.appendChild(gridCellContainer);
      });
    });

    return cellFragment;
  }

  private createShipElement(
    shipType: ShipType,
    shipLength: ShipLength,
    orientation: Orientation
  ): HTMLDivElement {
    const shipUnitFragment: DocumentFragment = this.generateShipUnitFragment(
      shipLength,
      shipType,
      orientation,
      this.id
    );

    const shipContainerElement: HTMLDivElement = createElement(
      'div',
      ['opponent-ship-container'],
      {
        id: `${this.id}-${shipType}-container`,
      }
    );
    shipContainerElement.appendChild(shipUnitFragment);

    return shipContainerElement;
  }

  private updateFleetElements(fleetBuilder: BattleshipFleetBuilder): void {
    const fleet: Fleet = fleetBuilder.fleet;

    for (const ship of Object.values(fleet)) {
      const shipType: ShipType = ship.type;
      const shipLength: ShipLength = ship.length;

      const orientation: Orientation | null =
        ship.currentplacementConfigurations.orientation;

      if (!orientation) throw new Error('Orientation not set.');

      const coordinatesArray: CoordinatesArray | null =
        ship.currentplacementConfigurations.coordinatesArray;

      if (!coordinatesArray || coordinatesArray.length === 0) {
        console.error(`The ${shipType} has not been placed. Continuing...`);
        continue;
      }

      const shipContainerElement: HTMLDivElement = this.createShipElement(
        shipType,
        shipLength,
        orientation
      );

      this.fleetElements.set(shipType, shipContainerElement);
    }
  }

  private generateBoardContainer(boardSize: number): HTMLDivElement {
    const gameboardContainer: HTMLDivElement = createElement(
      'div',
      ['gameboard-container'],
      {
        id: `${this.id}-gameboard-container`,
      }
    );

    gameboardContainer.style.setProperty('--grid-size', boardSize.toString());

    return gameboardContainer;
  }

  private generateBoardFragment(boardSize: number): DocumentFragment {
    const gameboardBackground: HTMLDivElement = createElement(
      'div',
      ['gameboard-background'],
      {
        id: `${this.id}-gameboard-background`,
      }
    );
    gameboardBackground.appendChild(
      this.createBackgroundCellsFragment(
        this.playerState.gameboardBuilder.board
      )
    );

    const gameboard = createElement('div', ['gameboard'], {
      id: `${this.id}-gameboard`,
    });
    gameboard.style.setProperty('--grid-size', boardSize.toString());

    this.fleetElements.forEach((shipContainerElement) => {
      gameboard.appendChild(shipContainerElement);
    });

    const boardFragment: DocumentFragment = new DocumentFragment();
    boardFragment.append(gameboardBackground, gameboard);

    return boardFragment;
  }

  private generateShipUnitFragment(
    shipLength: ShipLength,
    shipType: ShipType,
    orientation: Orientation,
    id: string
  ): DocumentFragment {
    const shipUnitFragment: DocumentFragment = new DocumentFragment();

    for (let i = 0; i < shipLength; i++) {
      const isBow: boolean = i === 0;
      const isStern: boolean = i === shipLength - 1;
      const shipUnit: HTMLDivElement = createElement('div', [
        'ship-unit',
        `${shipType}-unit`,
        `${id}-${shipType}-unit`,
      ]);

      const isHorizontal: boolean = orientation === 'horizontal';

      isHorizontal
        ? shipUnit.classList.add('ship-unit-horizontal')
        : shipUnit.classList.add('ship-unit-vertical');

      if (isBow) {
        shipUnit.classList.add('ship-bow');
        shipUnit.setAttribute('id', `${id}-${shipType}-bow`);
      }

      if (isStern) {
        shipUnit.classList.add('ship-stern');
        shipUnit.setAttribute('id', `${id}-${shipType}-stern`);
      }

      shipUnitFragment.appendChild(shipUnit);
    }

    return shipUnitFragment;
  }

  private getAndSetGridPlacementValue(
    shipContainerElement: HTMLDivElement,
    bowCoordinates: Coordinates,
    orientation: Orientation,
    shipLength: ShipLength
  ): void {
    const [gridPlacementValue, gridCrossAxis]: [GridPlacementValue, number] =
      this.getGridPlacementValue(bowCoordinates, orientation, shipLength);

    this.setGridPlacementValue(
      gridPlacementValue,
      gridCrossAxis,
      shipContainerElement,
      orientation,
      shipLength
    );
  }

  private getGridPlacementValue(
    coordinates: Coordinates,
    orientation: Orientation,
    shipLength: ShipLength
  ): [GridPlacementValue, number] {
    const isHorizontal = orientation === 'horizontal';

    const [x, y] = coordinates;
    const gridStartMain = isHorizontal ? x + 1 : y + 1;
    const gridCrossAxis = isHorizontal ? y + 1 : x + 1;

    return [`${gridStartMain} / span ${shipLength}`, gridCrossAxis];
  }

  private getShipGridPlacementData(ship: BattleshipBuilder): { bowCoordinates: Coordinates, orientation: Orientation, shipLength: ShipLength } {
    const placementConfigurations: IPlacementConfigurations =
      ship.currentplacementConfigurations;

    if (
      !placementConfigurations.coordinatesArray ||
      !placementConfigurations.orientation
    )
      throw new Error(
        `The ${ship.type} has no placement configurations.`
      );

    const bowCoordinates: Coordinates =
      placementConfigurations.coordinatesArray[0];
    const orientation: Orientation = placementConfigurations.orientation;

    const shipLength: ShipLength = ship.length;
    
    return {
      bowCoordinates,
      orientation,
      shipLength
    }
  }

  private handleCellClick = (e: MouseEvent): void => {
    if (
      !(e.target instanceof HTMLDivElement) ||
      !e.target.matches('.grid-cell')
    )
      return;

    const gridCell: HTMLDivElement = e.target;

    const dataX = gridCell.getAttribute('data-x');
    const dataY = gridCell.getAttribute('data-y');

    if (dataX === null || dataY === null) {
      throw new Error('Could not retrieve coordinates from grid cell.');
    }

    const coordinates: Coordinates = [+dataX, +dataY];

    if (this.hasTargetBeenAttacked(coordinates)) {
      // TODO: apply miss animation
      return;
    }

    const attackResult: AttackResult =
      this.playerState.gameboardController.receiveAttack(coordinates);

    this.setAndScrollToNextSitRep(attackResult);
    this.updateGameboardPostAttack(attackResult, gridCell);

    // 💭 --------------------------------------------------------------
    // 💭 toggleTurnState

    const { hit, isSunk, type } = attackResult;

    if ((hit && !isSunk) || !hit) {
      // GameState

      // return;
    }

    // a ship has been sunk at this point
    if (
      this.playerState.gameboardRepository.areAllShipsSunk()
    ) {
      // ? get winner
      this.transitionToNextPhase();
      // return;
    }

    // ? toggle player turn state
    // 💭 --------------------------------------------------------------
  };

  private handleShipUnitCooked(e: AnimationEvent): void {
    const shipContainerElement = e.target as HTMLDivElement;
    const shipUnits = shipContainerElement.children;
    for (let i = 0; i < shipUnits.length; i++) {
      setTimeout(() => {
        shipUnits[i].classList.add('cooked');
      }, 333 * (i + 1));
    }
    shipContainerElement.removeEventListener('animationend', this.handleShipUnitCooked);
  }

  private placeFleetOnGameboard(
    fleetElements: Map<ShipType, HTMLDivElement>
  ): void {
    const gameboard =
      this.gameboardContainer.querySelector<HTMLDivElement>('.gameboard');

    if (!gameboard) {
      throw new Error('Gameboard container not found.');
    }

    fleetElements.forEach((shipElement) => gameboard.appendChild(shipElement));
  }

  private hasTargetBeenAttacked(coordinates: Coordinates): boolean {
    const alreadyAttacked =
      this.playerState.gameboardRepository.hasTargetBeenAttacked(coordinates);

    if (!alreadyAttacked) {
      this.playerState.gameboardRepository.addAttackedCoordinates(
        coordinates
      );
    }

    return alreadyAttacked;
  }

  private updateGameboardPostAttack({ hit, isSunk, type }: AttackResult, gridCell: HTMLDivElement): void {
    if (!hit) {
      gridCell.classList.add('miss');
      this.togglePlayerTurn();
    }

    if (hit && !isSunk) {
      gridCell.classList.add('hit');
      this.togglePlayerTurn();
    }

    if (hit && isSunk) {
      if (!isShipType(type))
        throw new Error(`The ${type} is not a valid ship type.`);

      gridCell.classList.add('hit');
      const ship: BattleshipBuilder =
        this.playerState.fleetBuilder.getShip(type);

      const { bowCoordinates, orientation, shipLength } =
        this.getShipGridPlacementData(ship);

      if (!this.fleetElements.has(ship.type)) {
        throw new Error(`The ${ship.type} has no fleet element.`);
      }

      const shipContainerElement = this.fleetElements.get(ship.type);

      if (!shipContainerElement) {
        throw new Error(`The ${ship.type} has no fleet element.`);
      }

      this.getAndSetGridPlacementValue(
        shipContainerElement,
        bowCoordinates,
        orientation,
        shipLength
      );

      this.sinkShip(shipContainerElement);

      // ? after the is cooked animation check for win
      // ? if no win, trigger player turn state
      // ? if win, trigger post-bellum state
    }
  }

  private sinkShip(shipContainerElement: HTMLDivElement): void {
    shipContainerElement.classList.add('sunk');
      shipContainerElement.addEventListener(
        'animationend',
        this.handleShipUnitCooked
      );
  }


  // 💭 --------------------------------------------------------------
  // 💭 Utilities

  // TODO: Do I need this
  public getId(): string {
    return this.id;
  }
}


// TODO: add click listener that receieves an attack, toggles the state (updating main container one), etc.
