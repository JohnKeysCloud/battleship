import type { Position } from './helpers/validate-placement/validate-placement'
import { validatePlacement } from './helpers/validate-placement/validate-placement';

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

export interface ValidPlacementParams {
  direction: 'horizontal' | 'vertical';
  axisIndex: number;
  gamePieceSize: number;
  boardSize: number;
  gameboard: symbol[][];
}

interface ValidShipPlacementParams extends Omit<ValidPlacementParams, 'boardSize' | 'gameboard'> {};

export class BattleshipBoardFactory implements IGridGameboardSquare<symbol> {
  private readonly _board: symbol[][];
  private readonly _boardSize: number = 10;
  private readonly _fillValue: symbol = Symbol('V');

  constructor() {
    this._board = Array.from({ length: this._boardSize }, () =>
      Array(this._boardSize).fill(this._fillValue)
    );
  }

  validateShipPlacement(validShipPlacementArg: ValidShipPlacementParams): Position[] {
    const { direction, axisIndex, gamePieceSize } = validShipPlacementArg;

    const validPlacementArg: ValidPlacementParams = {
      direction,
      axisIndex,
      gamePieceSize,
      boardSize: this._boardSize,
      gameboard: this._board
    };

    return validatePlacement(validPlacementArg);
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