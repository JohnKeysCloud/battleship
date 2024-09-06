import type {Position} from './helpers/check-valid-placement/check-valid-placement.ts'
import {checkValidPlacement} from "./helpers/check-valid-placement/check-valid-placement.ts";

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
  private readonly _fillValue: symbol = Symbol('V');

  constructor() {
    this._board = Array.from({ length: this._boardSize }, () =>
      Array(this._boardSize).fill(this._fillValue)
    );
  }

  checkValidShipPlacement(
    axisIndex: number,
    gamePieceSize: number,
    direction: 'horizontal' | 'vertical'
  ): Position[] {
    return checkValidPlacement(
      direction,
      axisIndex,
      gamePieceSize,
      this._boardSize,
      this._board
    );
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