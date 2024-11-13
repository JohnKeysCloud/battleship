import {
  Gameboard,
  IGridGameboardSquare,
} from '../../types/logic-types';

export class BattleshipBoardBuilder implements IGridGameboardSquare<symbol> {
  private static readonly vacant: symbol = Symbol('VC');

  private readonly _board: Gameboard;
  private readonly _boardSize: number = 10;
  private readonly _fillValue: symbol = BattleshipBoardBuilder.vacant;

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
}