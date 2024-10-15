import {
  Gameboard,
  IFleetCoordinates,
  IGridGameboardSquare,
  IPlacePieceWrapperParams,
  IPlacePieceCallbackParams,
  IPosition,
  IShipPlacementConfigurations,
  IValidPlacementCallbackParams,
  IValidPositionsResult,
  Orientation,
} from '../types/logic-types';
import { getValidShipPositions } from './helpers/get-valid-ship-positions/get-valid-ship-positions';
import { placeShip } from './helpers/place-ship/place-ship';

export class BattleshipBoardBuilder implements IGridGameboardSquare<symbol> {
  private static readonly vacant = Symbol('VC');

  private readonly _board: Gameboard;
  private readonly _boardSize: number = 10;
  private readonly _fillValue: symbol = BattleshipBoardBuilder.vacant;
  private readonly _fleetCoordinates: IFleetCoordinates = {};

  constructor() {
    this._board = Array.from({ length: this._boardSize }, () =>
      Array(this._boardSize).fill(this._fillValue)
    );
  }

  getValidPositions({
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

  placePiece({
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

  removePiece(bowCoordinates: IPosition) {}

  public prettyPrint() {
    return this._board.map((row) =>
      row.map((symbol) =>
        symbol.description === 'VC' ? null : symbol.description
      )
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
}

export function createShipConfigurations(
  shipLength: number,
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
