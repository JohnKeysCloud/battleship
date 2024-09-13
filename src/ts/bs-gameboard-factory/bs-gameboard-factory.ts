import type { Position } from './helpers/get-valid-positions/get-valid-positions'
import { getValidPositions } from './helpers/get-valid-positions/get-valid-positions';

// Symbols to fill gameboard values
export const POSITION_STATES = {
  vacant: Symbol('V'),
  occupied: Symbol('O')
};
export interface ValidPlacementCallbackParams {
  direction: 'horizontal' | 'vertical';
  axisIndex: number;
  gamePieceSize: number;
  boardSize: number;
  gameboard: symbol[][];
}

export interface ValidPlacementWrapperParams extends Omit<ValidPlacementCallbackParams, 'boardSize' | 'gameboard'> {};

interface IGridGameboard<T> {
  readonly board: T[][];
  fillValue: T;
  placePiece(
    xPos: number,
    yPos: number,
    length?: number,
    direction?: 'horizontal' | 'vertical'
  ): void;
  removePiece(
    xPos: number,
    yPos: number
  ): void;
  resetBoard(): void;
}

interface IGridGameboardSquare<T> extends IGridGameboard<T> {
  boardSize: number; 
}
export class BattleshipBoardFactory implements IGridGameboardSquare<symbol> {
  private readonly _board: symbol[][];
  private readonly _boardSize: number = 10;
  private readonly _fillValue: symbol = POSITION_STATES.vacant;

  constructor() {
    this._board = Array.from({ length: this._boardSize }, () =>
      Array(this._boardSize).fill(this._fillValue)
    );
  }

  getValidShipPositions({
    direction,
    axisIndex,
    gamePieceSize,
  }: ValidPlacementWrapperParams): Position[] {
    const validPlacementArg: ValidPlacementCallbackParams = {
      direction,
      axisIndex,
      gamePieceSize,
      boardSize: this._boardSize,
      gameboard: this._board,
    };

    return getValidPositions(validPlacementArg);
  }

  resetBoard(): void {
    for (let i = 0; i < this._board.length; i++) {
      this._board[i].fill(this._fillValue);
    }
  }

  placePiece(input, orientation) {}
  removePiece(input) {}

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

export const BattleshipBoards = {
  'playerOne': new BattleshipBoardFactory(),
  'playerTwo': new BattleshipBoardFactory(),
};