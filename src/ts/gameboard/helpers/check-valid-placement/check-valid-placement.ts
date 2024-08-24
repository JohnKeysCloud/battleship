// Symbols to fill gameboard values
const VACANT = Symbol('V');
const OCCUPIED = Symbol('O');

export interface Position {
  bow: number[]; // [rowIndex, colIndex]
  stern: number[]; // [rowIndex, colIndex]
}

export function checkValidPlacement<T>(
  direction: 'horizontal' | 'vertical', // Update to specific literals
  axisIndex: number,
  boardSize: number,
  gamePieceSize: number,
  gameboard: Array<Array<symbol>>
): Position[] {
  const testArguments = (
    gamePieceSize: number,
    axisIndex: number,
    boardSize: number
  ): void => {
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
  testArguments(gamePieceSize, axisIndex, boardSize);

  const getAxisArray = (
    direction: 'horizontal' | 'vertical',
    axisIndex: number,
    gameboard: Array<Array<symbol>>
  ): Array<symbol> => {
    let axisArray: Array<symbol> = [];

    if (direction === 'horizontal') {
      // Get the row
      axisArray = gameboard[axisIndex];
    } else if (direction === 'vertical') {
      axisArray = [];

      // Populate axisArray with column data
      gameboard.forEach(row => {
        const columnValue = row[axisIndex];
        axisArray.push(columnValue);
      });

      for (let i = 0; i < boardSize; i++) {
      }
    }

    return axisArray;
  };
  const getValidPositions = (
    axisArray: Array<symbol>,
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
      if (axisArray[i] === VACANT) {
        streak++;

        // Position is valid
        if (streak >= gamePieceSize) {
          const bowPosition =
            direction === 'horizontal' ? [axisIndex, i] : [i, axisIndex];
          const sternPosition =
            direction === 'horizontal'
              ? [axisIndex, i - (gamePieceSize - 1)]
              : [i - (gamePieceSize - 1), axisIndex];

          const validPosition: Position = {
            bow: bowPosition,
            stern: sternPosition,
          };

          validShipPositions.push(validPosition);
        }
      } else if (axisArray[i] === OCCUPIED) {
        streak = 0;
      }
    }

    return validShipPositions;
  };

  const axisArray: Array<symbol> = getAxisArray(direction, axisIndex, gameboard);

  // Loop through axisArray to find valid positions
  const validShipPositions: Position[] = getValidPositions(
    axisArray,
    direction,
    axisIndex,
    gamePieceSize,
  );

  return validShipPositions;
}