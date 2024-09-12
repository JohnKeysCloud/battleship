import { ValidPlacementCallbackParams } from "../../bs-gameboard-factory";
import { POSITION_STATES } from "../../bs-gameboard-factory";

export interface Position {
  bow: number[]; // [rowIndex, colIndex]
  stern: number[]; // [rowIndex, colIndex]
}

export function validatePlacement({
  direction,
  axisIndex,
  gamePieceSize,
  boardSize,
  gameboard,
}: ValidPlacementCallbackParams): Position[] {
  const testArguments = (
    direction: 'horizontal' | 'vertical',
    gamePieceSize: number,
    axisIndex: number,
    boardSize: number
  ): void => {
    // Validate direction
    if (!['horizontal', 'vertical'].includes(direction)) {
      throw new Error(`Invalid direction. Must be 'horizontal' or 'vertical'.`);
    }

    // Validate piece length
    if (gamePieceSize < 2 || gamePieceSize > 5) {
      throw new Error(
        'Invalid piece length. Game piece length must be between 2 and 5.'
      );
    }

    // Edge case checks
    if (axisIndex < 0 || axisIndex >= boardSize) {
      throw new Error('Invalid axisIndex number.');
    }
  };

  // TODO: Consider wrapping this function in a try-catch block when integrating with event handlers
  testArguments(direction, gamePieceSize, axisIndex, boardSize);

  const getAxisArray = (
    direction: 'horizontal' | 'vertical',
    axisIndex: number,
    gameboard: Array<Array<symbol>> // or symbol[][]
  ): Array<symbol> => {
    return direction === 'horizontal'
      ? gameboard[axisIndex]
      : gameboard.map((row) => row[axisIndex]);
  };

  const getValidPositions = (
    axisArray: Array<symbol>, // or symbol[]
    direction: 'horizontal' | 'vertical',
    axisIndex: number,
    gamePieceSize: number
  ): Position[] => {
    // Edge case check for ship length greater than row length
    if (gamePieceSize > axisArray.length) {
      throw new Error('Ship length cannot be greater than axisArray length.');
    }

    let streak: number = 0;
    let validShipPositions: Position[] = [];

    for (let i = 0; i < axisArray.length; i++) {
      if (axisArray[i] === POSITION_STATES.vacant) {
        streak++;

        // Position is valid
        if (streak >= gamePieceSize) {
          const bowPosition =
            direction === 'horizontal'
              ? [axisIndex, i - (gamePieceSize - 1)]
              : [i - (gamePieceSize - 1), axisIndex];
          const sternPosition =
            direction === 'horizontal' ? [axisIndex, i] : [i, axisIndex];

          const validPosition: Position = {
            bow: bowPosition,
            stern: sternPosition,
          };

          validShipPositions.push(validPosition);
        }
      } else if (axisArray[i] === POSITION_STATES.vacant) {
        streak = 0;
      }
    }
    
    return validShipPositions;
  };

  const axisArray: Array<symbol> = getAxisArray(
    direction,
    axisIndex,
    gameboard
  );

  // Loop through axisArray to find valid positions
  const validShipPositions: Position[] = getValidPositions(
    axisArray,
    direction,
    axisIndex,
    gamePieceSize
  );

  return validShipPositions;
}