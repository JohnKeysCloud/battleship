import {
  IPosition,
  IShipConfigurations,
  IPlacePieceWrapperParams,
} from '../../../bs-types';
import { BattleshipBoardFactory, POSITION_STATES } from '../../bs-gameboard-factory';
import { areArraysEqual } from '../../../../utilities/random-utilities'; 

export function placeShip(gameboardInstance: BattleshipBoardFactory, { coordinates, configurations }: IPlacePieceWrapperParams) {
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
    const validPositions = gameboardInstance.getValidPositions(configurations);

    // for each row/column
    for (const axisArray in validPositions) {
      if (
        validPositions[axisArray].some((validPosition: IPosition) =>
          arePositionsEqual(position, validPosition)
        )
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
    const gameboard = gameboardInstance.board;

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
  const areCoordinatesInBounds = (axisStart: number, shipLength: number) => {
    const errorMessage = `The ship placement starting at ${coordinates} with length ${shipLength} exceeds the board size of ${gameboardInstance.boardSize}.`;
    if (axisStart + shipLength >= gameboardInstance.boardSize)
      throw new Error(errorMessage);
  };

  const { direction, gamePieceSize: shipLength } = configurations;
  const isHorizontal = direction === 'horizontal';
  const [bowRow, bowColumn] = coordinates;
  const axisStart = isHorizontal ? bowColumn : bowRow;

  areCoordinatesInBounds(axisStart, shipLength);

  const position: IPosition = {
    bow: coordinates,
    stern: isHorizontal
      ? [bowRow, bowColumn + shipLength - 1]
      : [bowRow + shipLength - 1, bowColumn],
  };

  if (isPositionValid(position, configurations)) {
    placeOnBoard(position, configurations);
  } else {
    const errorMessage = `"${JSON.stringify(
      position
    )}" is unavailable for ship with configurations: ${JSON.stringify(
      configurations
    )}`;
    throw new Error(errorMessage);
  }
}
