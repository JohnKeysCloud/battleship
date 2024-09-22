import { getValidShipPositions } from './helpers/get-valid-ship-positions/get-valid-ship-positions';
import { IPosition } from './helpers/get-valid-ship-positions/get-valid-ship-positions'

export type PositionStates = {
  vacant: symbol,
  occupied: symbol
}
export type Coordinates = [number, number];
export type AxisName = `row-${number}` | `column-${number}`;

interface IGridGameboard<T> {
  readonly board: T[][];
  fillValue: T;
  placePiece(options: IPlacePieceWrapperParams): void;
  removePiece(endpoint: Coordinates): void;
  resetBoard(): void;
}

interface IGridGameboardSquare<T> extends IGridGameboard<T> {
  boardSize: number;
}
export interface IValidPlacementCallbackParams {
  direction: 'horizontal' | 'vertical';
  gamePieceSize: number;
  gameboard: BattleshipBoardFactory;
}

export interface IValidPlacementWrapperParams extends Omit<IValidPlacementCallbackParams, 'gameboard'> { };

export interface IValidPositionsResult {
  [key: AxisName]: IPosition[];
}

export interface IPlacePieceWrapperParams {
  endpoint: Coordinates;
  configurations?: IValidPlacementWrapperParams;
}

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
  }: IValidPlacementWrapperParams): IValidPositionsResult {
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

  placePiece({
    endpoint,
    configurations,
  }: IPlacePieceWrapperParams) {
    const [bowX, bowY] = endpoint;



    // Check if configurations is defined
    if (!configurations) {
      throw new Error('Configurations must be provided');
    }

    const { direction, gamePieceSize } = configurations;

    return 'test';
  }

  removePiece(bowCoordinates: Coordinates) {}

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

export function createPlacementParams(
  direction: 'horizontal' | 'vertical',
  gamePieceSize: number
): IValidPlacementWrapperParams {
  return {
    direction,
    gamePieceSize
  }
};

export function createBattleshipBoardSet() {
  return {
    playerOne: new BattleshipBoardFactory(),
    playerTwo: new BattleshipBoardFactory()
  }
};