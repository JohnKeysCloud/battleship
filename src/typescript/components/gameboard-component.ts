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
import { createElement } from '../utilities/random-utilities';
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

  private calculateGridPlacement(
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

    gameboard.forEach((row: ShipSymbolValue[], rowIndex) => {
      row.forEach((symbol: ShipSymbolValue, colIndex) => {
        const symbolDescription: string = symbol.description!.toLowerCase();

        const gridCell: HTMLDivElement = createElement(
          'div',
          [`${this.createIdentifier(symbolDescription)}-cell`, 'grid-cell'],
          {
            'aria-label': `Row ${rowIndex + 1}, Column ${colIndex + 1}`,
            role: 'gridCell',
          }
        );

        const gridCellContainer: HTMLDivElement = createElement('div', [
          this.createIdentifier(`${symbolDescription}-cell-container`),
          'grid-cell-container',
        ]);

        gridCellContainer.appendChild(gridCell);
        cellFragment.appendChild(gridCellContainer);
      });
    });

    return cellFragment;
  }

  private createIdentifier(identifier: string): string {
    const playerNumber = this.id.toLowerCase().split('player')[1];
    return `player-${playerNumber}-${identifier}`;
  }

  private createShipElement(
    shipType: ShipType,
    shipLength: ShipLength,
    gridPlacementValue: string,
    gridCrossAxis: number,
    isHorizontal: boolean
  ): HTMLElement {
    const shipElement: HTMLDivElement = createElement('div', ['ship'], {
      id: this.createIdentifier(shipType),
    });

    const shipContainerElement: HTMLDivElement = createElement(
      'div',
      ['ship-container'],
      {
        id: this.createIdentifier(`${shipType}-container`),
        'data-length': shipLength.toString(),
      }
    );

    shipContainerElement.appendChild(shipElement);

    if (isHorizontal) {
      shipContainerElement.style.gridColumn = gridPlacementValue;
      shipContainerElement.style.gridRow = gridCrossAxis.toString();
    } else {
      shipContainerElement.style.gridRow = gridPlacementValue;
      shipContainerElement.style.gridColumn = gridCrossAxis.toString();
    }

    return shipContainerElement;
  }

  private generateBoardContainer(boardSize: number): HTMLElement {
    const gameboardContainer: HTMLDivElement = createElement(
      'div',
      ['gameboard-container'],
      {
        id: this.createIdentifier('gameboard-container'),
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
        id: this.createIdentifier('gameboard-background'),
      }
    );
    gameboardBackground.appendChild(
      this.createBackgroundCellsFragment(
        this.playerState.gameboardBuilder.board
      )
    );

    const gameboard = createElement('div', ['gameboard'], {
      id: this.createIdentifier('gameboard'),
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
        this.calculateGridPlacement([x, y], isHorizontal, shipLength);

      const shipElement = this.createShipElement(
        shipType,
        shipLength,
        gridPlacementValue,
        gridCrossAxis,
        isHorizontal
      );

      gameboardContainer.appendChild(shipElement);
    }
  }
}