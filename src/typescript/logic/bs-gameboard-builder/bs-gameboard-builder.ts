import {
  Coordinates,
  CoordinatesSetMember,
  Gameboard,
  IBattleshipGameboard,
  IFleetCoordinates,
  IPlacePieceWrapperParams,
  IPlacePieceCallbackParams,
  IShipPlacementConfigurations,
  IValidPlacementCallbackParams,
  IValidPositionsResult,
  Orientation,
  ShipLength,
} from '../../types/logic-types';
import { BattleshipBuilder } from '../bs-ship-builder/bs-ship-builder';
import { getValidShipPositions } from './helpers/get-valid-ship-positions/get-valid-ship-positions';
import { placeShip } from './helpers/place-ship/place-ship';

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

  resetBoard(): void {
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
          shipCoordinateSet
        };
      }
    }
  }

  removePiece(ship: BattleshipBuilder): void {
    let shipCoordinates = ship.placementConfigurations.coordinatesArray;

    console.log(shipCoordinates);
    shipCoordinates?.forEach(coordinates => {
      const [x, y] = coordinates;
      this.board[y][x] = this.fillValue;
    });



    // return void
  }

  movePiece(currentCoordinates: Coordinates, newBowCoordinates: Coordinates) {
    const shipToMove = this.getShipCoordinatesAt(currentCoordinates);

    // removePiece(shipToMove)
    // ...
  }

  rotatePiece(currentCoordinates: Coordinates) {
    const shipToRotate = this.getShipCoordinatesAt(currentCoordinates);

    // removePiece(shipToRotate)
    // ...
  }

  public prettyPrint() {
    console.table(this._board.map((row) =>
      row.map((symbol) =>
        symbol.description === 'VC' ? null : symbol.description
      )
    ));
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
}

export function createShipConfigurations(
  shipLength: ShipLength,
  orientation: Orientation,
): IShipPlacementConfigurations {
  return {
    orientation,
    shipLength,
  };
}

export function createBattleshipBoardSet() {
  return {
    playerOne: new BattleshipBoardBuilder(),
    playerTwo: new BattleshipBoardBuilder(),
  };
}
