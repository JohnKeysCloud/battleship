import {
  PositionStates,
  IPosition,
  IGridGameboardSquare,
  IShipConfigurations,
  IValidPositionsResult,
  IPlacePieceWrapperParams,
  IValidPlacementCallbackParams,
} from '../bs-types';
import { getValidShipPositions } from './helpers/get-valid-ship-positions/get-valid-ship-positions';
import { placeShip } from './helpers/place-ship/place-ship';

// 💭 --------------------------------------------------------------

export const POSITION_STATES: PositionStates = {
  vacant: Symbol('V'),
  occupied: Symbol('O'),
};
export class BattleshipBoardFactory implements IGridGameboardSquare<symbol> {
  private readonly _board: symbol[][];
  private readonly _boardSize: number = 10;
  private readonly _fillValue: symbol = POSITION_STATES.vacant;

  constructor() {
    this._board = Array.from({ length: this._boardSize }, () =>
      Array(this._boardSize).fill(this._fillValue)
    );
  }

  getValidPositions({
    direction,
    gamePieceSize,
  }: IShipConfigurations): IValidPositionsResult {
    const validPlacementArg: IValidPlacementCallbackParams = {
      direction,
      gamePieceSize,
      gameboard: this,
    };

    return getValidShipPositions(validPlacementArg);
  }

  resetBoard(): void {
    for (let i = 0; i < this._board.length; i++) {
      this._board[i].fill(this._fillValue);
    }
  }

  placePiece({ coordinates, configurations }: IPlacePieceWrapperParams) {
    placeShip(this, {coordinates, configurations});
  }

  removePiece(bowCoordinates: IPosition) {}

  public get board(): symbol[][] {
    return this._board;
  }

  public get fillValue(): symbol {
    return this._fillValue;
  }

  public get boardSize(): number {
    return this._boardSize;
  }
}

// 💭 --------------------------------------------------------------

export function createShipConfigurations(
  direction: 'horizontal' | 'vertical',
  gamePieceSize: number
): IShipConfigurations {
  return {
    direction,
    gamePieceSize,
  };
}

export function createBattleshipBoardSet() {
  return {
    playerOne: new BattleshipBoardFactory(),
    playerTwo: new BattleshipBoardFactory(),
  };
}
