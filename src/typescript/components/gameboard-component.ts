import { BattleshipFleetBuilder } from '../logic/bs-fleet-builder/bs-fleet-builder';
import {
  Coordinates,
  CoordinatesArray,
  Gameboard,
  Orientation,
  ShipLength,
  ShipSymbolValue,
  ShipType,
} from '../types/logic-types';
import {
  createElement,
  createPlayerIdentifier,
} from '../utilities/random-utilities';
import { GridPlacementValue } from '../types/css-types';
import { PlayerState } from '../types/state-types';
import GlobalEventBus from '../utilities/event-bus';

export class GameboardComponent {
  private boardContainer: HTMLElement;

  constructor(
    private readonly id: string,
    private readonly playerState: PlayerState
  ) {
    GlobalEventBus.on('renderGameboard', (targetSelector: string) => {
      this.render(targetSelector);
    });
  }

  public getId(): string {
    return this.id;
  }

  public render(targetSelector: string): void {
    const target: HTMLElement | null = document.querySelector(targetSelector);

    if (!target) {
      throw new Error(
        `Target element not found with ID - ${this.id} and selector - "${targetSelector}".`
      );
    }

    if (this.boardContainer) {
      this.clearBoardContainer();
    } else {
      this.boardContainer = this.generateBoardContainer(
        this.playerState.gameboardBuilder.boardSize
      );

      target.appendChild(this.boardContainer);
    }

    const gameboard: DocumentFragment = this.generateBoardFragment(
      this.playerState.gameboardBuilder.boardSize
    );

    this.boardContainer.appendChild(gameboard);
    this.placeFleet(this.playerState.fleetBuilder);
  }

  private getGridPlacementValue(
    coordinates: Coordinates,
    isHorizontal: boolean,
    shipLength: ShipLength
  ): [GridPlacementValue, number] {
    const [x, y] = coordinates;
    const gridStartMain = isHorizontal ? x + 1 : y + 1;
    const gridCrossAxis = isHorizontal ? y + 1 : x + 1;

    return [`${gridStartMain} / span ${shipLength}`, gridCrossAxis];
  }

  private clearBoardContainer(): void {
    while (this.boardContainer.firstChild) {
      this.boardContainer.removeChild(this.boardContainer.firstChild);
    }
  }

  private createBackgroundCellsFragment(
    gameboard: Gameboard
  ): DocumentFragment {
    const cellFragment: DocumentFragment = new DocumentFragment();

    // TODO: Create object stores row and column indices to fill gameboard div with missing empty cells
    gameboard.forEach((row: ShipSymbolValue[], rowIndex) => {
      row.forEach((symbol: ShipSymbolValue, colIndex) => {
        const symbolDescription: string = symbol.description!.toLowerCase();

        const gridCell: HTMLDivElement = createElement('div', [
          `${createPlayerIdentifier(this.id, symbolDescription)}-cell`,
          'grid-cell',
        ], {
          'aria-label': `Row ${rowIndex + 1}, Column ${colIndex + 1}`,
          role: 'gridCell',
        });

        const gridCellContainer: HTMLDivElement = createElement('div', [
          createPlayerIdentifier(
            this.id,
            `${symbolDescription}-cell-container`
          ),
          'grid-cell-container',
        ]);

        gridCellContainer.appendChild(gridCell);
        cellFragment.appendChild(gridCellContainer);
      });
    });

    return cellFragment;
  }

  private generateShipUnitFragment(
    shipLength: ShipLength,
    shipType: ShipType,
    id: string
  ): DocumentFragment {
    const shipUnitFragment: DocumentFragment = new DocumentFragment();

    for (let i = 0; i < shipLength; i++) {
      const isBow: boolean = i === 0;
      const shipUnit: HTMLDivElement = createElement('div', [
        'ship-unit',
        createPlayerIdentifier(id, shipType),
      ]);

      if (isBow) {
        shipUnit.classList.add('ship-bow');
        shipUnit.setAttribute(
          'id',
          createPlayerIdentifier(id, `${shipType}-bow`)
        );
      }

      shipUnitFragment.appendChild(shipUnit);
    }

    return shipUnitFragment;
  }

  private addDragStartListener(
    shipContainerElement: HTMLDivElement,
    isHorizontal: boolean
  ): void {
    const shipBowElement: HTMLDivElement | null = shipContainerElement.querySelector('.ship-bow');
    
    if (!shipBowElement) {
      console.warn('Ship-bow element not found.');
      return;
    }

    shipContainerElement.addEventListener('dragstart', (e: DragEvent) => {
      if (!e.dataTransfer) {
        console.error('DataTransfer is null');
        return; // Handle this gracefully if necessary
      }

      const shipBowRect: DOMRect = shipBowElement.getBoundingClientRect();
      const containerRect: DOMRect =
        shipContainerElement.getBoundingClientRect();
      
      const halfOfCellLength: number = shipBowRect.width / 2;

      let offsetX: number, offsetY: number;
      if (isHorizontal) {
        const horizontalDistanceFromContainerToShipBow = shipBowRect.left - containerRect.left;

        offsetX = horizontalDistanceFromContainerToShipBow + halfOfCellLength;
        offsetY = halfOfCellLength;
      } else {
        const verticalDistanceFromContainerToShipBow = shipBowRect.top - containerRect.top

        offsetX = halfOfCellLength;
        offsetY = verticalDistanceFromContainerToShipBow + halfOfCellLength;
      }

      e.dataTransfer.setDragImage(shipContainerElement, offsetX, offsetY);
    });
  }

  private createShipElement(
    shipType: ShipType,
    shipLength: ShipLength,
    gridPlacementValue: string,
    gridCrossAxis: number,
    isHorizontal: boolean
  ): HTMLElement {
    const shipUnitFragment: DocumentFragment = this.generateShipUnitFragment(shipLength, shipType, this.id);
    
    const shipContainerElement: HTMLDivElement = createElement('div', ['ship-container'], {
      id: createPlayerIdentifier(this.id, `${shipType}-container`),
      'data-length': shipLength.toString(),
      draggable: 'true',
    });
    shipContainerElement.style.display = 'grid';
    shipContainerElement.appendChild(shipUnitFragment);

    if (isHorizontal) {
      shipContainerElement.style.gridColumn = gridPlacementValue;
      shipContainerElement.style.gridRow = gridCrossAxis.toString();
      shipContainerElement.style.gridTemplateColumns = `repeat(${shipLength}, 1fr)`;
    } else {
      shipContainerElement.style.gridRow = gridPlacementValue;
      shipContainerElement.style.gridColumn = gridCrossAxis.toString();
      shipContainerElement.style.gridTemplateRows = `repeat(${shipLength}, 1fr)`;
    }

    this.addDragStartListener(shipContainerElement, isHorizontal);

    return shipContainerElement;
  }

  private generateBoardContainer(boardSize: number): HTMLElement {
    const gameboardContainer: HTMLDivElement = createElement('div', ['gameboard-container'], {
      id: createPlayerIdentifier(this.id, 'gameboard-container'),
    });

    gameboardContainer.style.setProperty('--grid-size', boardSize.toString());

    return gameboardContainer;
  }

  private generateBoardFragment(boardSize: number): DocumentFragment {
    const gameboardBackground: HTMLDivElement = createElement('div',['gameboard-background'], {
      id: createPlayerIdentifier(this.id, 'gameboard-background'),
    });
    gameboardBackground.appendChild(
      this.createBackgroundCellsFragment(
        this.playerState.gameboardBuilder.board
      )
    );

    const gameboard = createElement('div', ['gameboard'], {
      id: createPlayerIdentifier(this.id, 'gameboard'),
    });
    gameboard.style.setProperty('--grid-size', boardSize.toString());

    const boardFragment: DocumentFragment = new DocumentFragment();
    boardFragment.append(gameboardBackground, gameboard);

    return boardFragment;
  }

  private placeFleet(fleetBuilder: BattleshipFleetBuilder): void {
    const gameboardContainer =
      this.boardContainer.querySelector<HTMLDivElement>('.gameboard');

    if (!gameboardContainer) {
      throw new Error('Gameboard container not found.');
    }

    for (const ship of Object.values(fleetBuilder.fleet)) {
      const shipType: ShipType = ship.type;
      const shipLength: ShipLength = ship.length;

      const orientation: Orientation | null =
        ship.currentplacementConfigurations.orientation;
      const coordinatesArray: CoordinatesArray | null =
        ship.currentplacementConfigurations.coordinatesArray;

      if (!coordinatesArray || coordinatesArray.length === 0) {
        console.log(`The ${shipType} has not been placed. Continuing...`);
        continue;
      }

      const [x, y]: Coordinates = coordinatesArray[0];
      const isHorizontal: boolean = orientation === 'horizontal';
      const [gridPlacementValue, gridCrossAxis]: [GridPlacementValue, number] =
        this.getGridPlacementValue([x, y], isHorizontal, shipLength);

      const shipElement = this.createShipElement(
        shipType,
        shipLength,
        gridPlacementValue,
        gridCrossAxis,
        isHorizontal
      );

      gameboardContainer.appendChild(shipElement);
    }

    // TODO: fill empty cells here
  }
}
