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
import { areArraysEqual } from '../../utilities/random-utilities';


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
    if (!configurations) {
      throw new Error('Configurations must be provided');
    }

    const arePositionsEqual = (endpoint: IPosition, position: IPosition) => {
      return (
        areArraysEqual(endpoint.bow, position.bow) &&
        areArraysEqual(endpoint.stern, position.stern)
      );
    };
    const isPositionValid = (
      position: IPosition,
      configurations: IShipConfigurations
    ) => {
      const validPositions = this.getValidPositions(configurations);

      // for each row/column
      for (const axisArray in validPositions) {
        if (
          validPositions[axisArray].some((validPosition: IPosition) => {
            return arePositionsEqual(position, validPosition);
          })
        ) {
          return true;
        }
      }
      return false;
    };
    const placeOnBoard = (
      position: IPosition,
      configurations: IShipConfigurations
    ) => {
      const gameboard = this._board;

      const isHorizontal = configurations.direction === 'horizontal';

      const primary = isHorizontal ? position.bow[0] : position.bow[1];
      const axisStart = isHorizontal ? position.bow[1] : position.bow[0];
      const axisEnd = isHorizontal ? position.stern[1] : position.stern[0];

      for (let i = axisStart; i <= axisEnd; i++) {
        isHorizontal
          ? (gameboard[primary][i] = POSITION_STATES.occupied)
          : (gameboard[i][primary] = POSITION_STATES.occupied);
      }

      return gameboard;
    };

    const [bowRow, bowColumn] = coordinates;
    const shipLength = configurations.gamePieceSize;

    const position: IPosition =
      configurations.direction === 'horizontal'
        ? { bow: coordinates, stern: [bowRow, bowColumn + shipLength - 1] }
        : { bow: coordinates, stern: [bowRow + shipLength - 1, bowColumn] };

    if (isPositionValid(position, configurations)) {
      return placeOnBoard(position, configurations);
    } else {
      const errorMessage = `"${JSON.stringify(
        position
      )}" is unavailable for ship with configurations: ${JSON.stringify(
        configurations
      )}`;
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
