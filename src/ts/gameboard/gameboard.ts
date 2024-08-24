import {
  checkValidPlacement,
  Position
} from "./helpers/check-valid-placement/check-valid-placement.ts";


interface IGameboard<T> {
  board: T[][];
  fillValue: T;
  resetBoard(): void;
  placePiece(
    xPos: number,
    yPos: number,
    length?: number,
    direction?: 'horizontal' | 'vertical'
  ): void;
}

interface IGameboardSquare<T> extends IGameboard<T> {
  boardSize: number; 
}

class BattlefieldBoard<T extends symbol> implements IGameboardSquare<T> {
  public board: T[][];

  constructor(public boardSize: number, public fillValue: T) {
    // Ensure the size is positive
    if (boardSize <= 0) {
      throw new Error('Board size must be greater than zero.');
    }

    this.boardSize = boardSize;

    // Initialize the board as a square 2D array
    this.board = Array.from({ length: boardSize }, () =>
      Array(boardSize).fill(fillValue)
    );
  }

  // 💭 --------------------------------------------------------------

  checkValidShipPlacement(
    index: number,
    pieceLength: number,
    direction: 'horizontal' | 'vertical'
  ): Position[] {
    return checkValidPlacement(
      direction,
      index,
      pieceLength,
      this.boardSize,
      this.board
    );
  }

  resetBoard(): void {
    const size = this.board.length;
    this.board = Array.from({ length: size }, () =>
      Array(size).fill(this.fillValue)
    );
  }

  get size(): number {
    return this.boardSize;
  }

  // 💭 --------------------------------------------------------------

  placePiece() {
    // youAreHere 💭
  }
}

export const battleFieldBoards = {
  'playerOne': new BattlefieldBoard(10, Symbol('VACANT')),
  'playerTwo': new BattlefieldBoard(10, Symbol('VACANT')),
};