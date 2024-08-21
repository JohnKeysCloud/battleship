// Symbols to fill gameboard values
const VACANT = Symbol('VACANT');
const OCCUPIED = Symbol('OCCUPIED');

export interface Position {
  bow: number[]; // [rowIndex, colIndex]
  stern: number[]; // [rowIndex, colIndex]
}

export function checkValidPlacement<T>(
  direction: 'horizontal' | 'vertical', // Update to specific literals
  axisIndex: number,
  gamePieceSize: number,
  boardSize: number,
  gameboard: Array<Array<symbol>>
): Position[] {
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

  let validShipPositions: Position[] = [];
  let streak: number = 0;
  let axisArray: Array<symbol> = [];

  if (direction === 'horizontal') {
    // Get the row
    axisArray = gameboard[axisIndex];
  } else if (direction === 'vertical') {
    axisArray = [];

    // Populate axisArray with column data
    for (let i = 0; i < boardSize; i++) {
      const currentValue = gameboard[i][axisIndex];
      axisArray.push(currentValue);
    }
  }

  // Edge case check for ship length greater than row length
  if (gamePieceSize > axisArray.length) {
    throw new Error('Ship length cannot be greater than axisArray length.');
  }

  // Loop through axisArray to find valid positions
  for (let i = 0; i < boardSize; i++) {
    if (axisArray[i] === VACANT) {
      streak++;

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
    } else if (axisArray[i] === OCCUPIED) {
      streak = 0;
    }
  }

  return validShipPositions;
}