import {
  Coordinates,
  CoordinatesArray,
  CoordinatesSetMember,
  Gameboard,
  IBattleshipGameboard,
  IFleetCoordinates,
  IPlacePieceWrapperParams,
  IPlacePieceCallbackParams,
  IPosition,
  IShipPlacementConfigurations,
  IValidPlacementCallbackParams,
  IValidPositionsResult,
  Orientation,
  ShipType,
} from '../../types/logic-types';
import { BattleshipBuilder } from '../bs-ship-builder/bs-ship-builder';
import { getValidShipPositions } from './helpers/get-valid-ship-positions/get-valid-ship-positions';
import { placeShip } from './helpers/place-ship/place-ship';
import { createAxisArrayKey, createTestPosition } from '../../utilities/logic-utilities';
import { areArraysEqual } from '../../utilities/random-utilities';

export class BattleshipBoardBuilder implements IBattleshipGameboard<symbol> {
  private static readonly vacant: symbol = Symbol('VC');

  private readonly _board: Gameboard;
  private readonly _boardSize: number = 10;
  private readonly _fillValue: symbol = BattleshipBoardBuilder.vacant;
  private readonly _fleetCoordinates: IFleetCoordinates = {};

  constructor() {
    this._board = Array.from({ length: this._boardSize }, () =>
      Array(this._boardSize).fill(this._fillValue)
    );
  }

  public get board(): Gameboard {
    return this._board;
  }

  public get boardSize(): number {
    return this._boardSize;
  }

  public get fillValue(): symbol {
    return this._fillValue;
  }

  public get fleetCoordinates(): IFleetCoordinates {
    return this._fleetCoordinates;
  }

  public getValidPositions({
    orientation,
    shipLength,
  }: IShipPlacementConfigurations): IValidPositionsResult {
    const validPlacementArg: IValidPlacementCallbackParams = {
      orientation,
      shipLength,
      gameboardInstance: this,
    };

    return getValidShipPositions(validPlacementArg);
  }

  public resetBoard(): void {
    for (let i = 0; i < this._board.length; i++) {
      this._board[i].fill(this._fillValue);
    }
  }

  public placePiece({
    ship,
    coordinates,
    orientation,
  }: IPlacePieceWrapperParams): void {
    const placeShipArg: IPlacePieceCallbackParams = {
      ship,
      coordinates,
      orientation,
      gameboardInstance: this,
    };

    placeShip(placeShipArg);
  }

  public removePiece(ship: BattleshipBuilder): void {
    if (!this.isShipValidForRemoval(ship)) return;

    const removeShipFromBoard = (shipCoordinates: CoordinatesArray): void => {
      shipCoordinates.forEach(([x, y]) => {
        this.board[y][x] = this.fillValue;
      });
    };
    const nullifyShipCoordinateSetValue = (shipType: ShipType): void => {
      this.fleetCoordinates[shipType] = null;
    };
    const resetShipConfigurationsProperty = (ship: BattleshipBuilder): void => {
      ship.remove();
    };

    const shipCoordinates: CoordinatesArray =
      ship.placementConfigurations.coordinatesArray!;
    const shipType: ShipType = ship.type;

    removeShipFromBoard(shipCoordinates);
    nullifyShipCoordinateSetValue(shipType);
    resetShipConfigurationsProperty(ship);
  }

  public movePiece(ship: BattleshipBuilder, newBowCoordinates: Coordinates) {
    // new bow coordinates destructured
    const [x, y]: Coordinates = newBowCoordinates;

    // preserved orientation of ship being moved
    const orientation: Orientation = ship.placementConfigurations.orientation!;

    // all current valid positions
    const validPositions: IValidPositionsResult = this.getValidPositions({
      orientation,
      shipLength: ship.length,
    });

    // to enhance readability in `axisArrayKey` generation
    const isHorizontal: boolean = orientation === 'horizontal';

    // targets specific array in `validPositions` object
    const axisArrayKey = createAxisArrayKey(isHorizontal ? y : x, isHorizontal);

    // targeted row/column where new position might exist
    const axisArray: IPosition[] = validPositions[axisArrayKey];

    // new position to compare with valid positions in `axisArray`
    const newPosition: IPosition = createTestPosition(
      newBowCoordinates,
      orientation,
      ship.length
    );

    // comparing new position to `axisArray` positions
    if (
      axisArray.some(
        (position: IPosition) =>
          // compares position bow and stern coordinates
          areArraysEqual(position.bow, newPosition.bow) &&
          areArraysEqual(position.stern, newPosition.stern)
      )
    ) {
      // removes ship because the new ship is valid
      this.removePiece(ship);

      // object used as parameter to place ship at new position
      const placeShipArg: IPlacePieceWrapperParams = {
        ship,
        coordinates: newBowCoordinates,
        orientation,
      };

      // places the ship at the new position
      this.placePiece(placeShipArg);
    } else {
      // new position is invalid

      console.error(
        `Invalid ${ship.type} position - Bow: [${newPosition.bow}] Stern: [${newPosition.stern}]is unavailable.`
      );
    }
  }

  public rotatePiece(ship: BattleshipBuilder, currentCoordinates: Coordinates) {
    if (!this.isShipValidForRemoval(ship)) return;

    const shipToRotate = this.getShipCoordinatesAt(currentCoordinates);

    // removePiece(shipToRotate)
    // ...
  }

  public prettyPrint() {
    console.table(
      this._board.map((row) =>
        row.map((symbol) =>
          symbol.description === 'VC' ? null : symbol.description
        )
      )
    );
  }

  private areCoordinatesVacant(coordinates: Coordinates) {
    const [x, y] = coordinates;
    return this.board[y][x] === this.fillValue;
  }

  private getShipCoordinatesAt(coordinates: Coordinates) {
    if (this.areCoordinatesVacant(coordinates)) return;

    const [x, y] = coordinates;
    const formattedInputCoordinates: CoordinatesSetMember = `[${x}, ${y}]`;

    for (const shipType in this.fleetCoordinates) {
      const shipCoordinateSet = this.fleetCoordinates[shipType];

      if (shipCoordinateSet.has(formattedInputCoordinates)) {
        return {
          type: shipType,
          shipCoordinateSet,
        };
      }
    }
  }

  private isShipValidForRemoval(ship: BattleshipBuilder): boolean {
    if (
      !ship.placementConfigurations.coordinatesArray ||
      this.fleetCoordinates[ship.type] === null
    ) {
      console.error(
        `Error removing ship: ${ship.type} is missing coordinates or not in the fleet.`
      );
      return false;
    }

    return true;
  }
}


