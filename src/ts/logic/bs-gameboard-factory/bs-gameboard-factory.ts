import { getValidShipPositions } from './helpers/get-valid-ship-positions/get-valid-ship-positions';
import { areArraysEqual } from '../../utilities/random-utilities';

export interface IPosition {
  bow: Coordinates; // [rowIndex, colIndex]
  stern: Coordinates; // [rowIndex, colIndex]
}
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
  removePiece(endpoint: IPosition): void;
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
  endpoint: IPosition;
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

    const arePositionsEqual = (endpoint: IPosition, position: IPosition) => {
      return areArraysEqual(endpoint.bow, position.bow) && areArraysEqual(endpoint.stern, position.stern);
    }

    const isPositionValid = (
      endpoint: IPosition,
      configurations: IValidPlacementWrapperParams
    ) => {      
      // an object of axis arrays containing position objects
      const validPositions = this.getValidPositions(configurations);

      // for each row/column
      for (const axisArray in validPositions) {
        if (validPositions[axisArray].some((position: IPosition) => {
          return arePositionsEqual(endpoint, position);
        })) {
          return true;
        }
      }
      return false;
    };

    const placeOnBoard = () => true;

    // Check if configurations is defined
    if (!configurations) {
      throw new Error('Configurations must be provided');
    }

    if (isPositionValid(endpoint, configurations)) {
      return placeOnBoard();
    } else {
      const errorMessage = `"${endpoint}" is unavailable for ship with configurations: ${configurations}`;
      
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
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