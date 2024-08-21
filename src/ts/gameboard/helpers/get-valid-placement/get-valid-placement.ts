// Symbols
const VACANT = Symbol('VACANT');
const OCCUPIED = Symbol('OCCUPIED');

export interface Position {
  bow: [number, number]; // [rowIndex, colIndex]
  stern: [number, number]; // [rowIndex, colIndex]
}

export function getValidPlacement<T>(
  index: number,
  pieceLength: number,
  direction: 'horizontal' | 'vertical', // Update to specific literals
  boardSize: number,
  gameboard: Array<Array<symbol>>
): Position[] {
  // Edge case checks
  if (index < 0 || index >= boardSize) {
    throw new Error('Invalid index number.');
  }

  if (pieceLength <= 0) {
    throw new Error('Ship length must be greater than zero.');
  }

  const row: Array<symbol> = gameboard[index];

  // Edge case check for ship length greater than row length
  if (pieceLength > row.length) {
    throw new Error('Ship length cannot be greater than row length.');
  }

  let validShipPositions: Position[] = [];
  let streak: number = 0;

  if (direction === 'horizontal') {
    for (let i = 0; i <= boardSize - 1; i++) {
      if (row[i] === VACANT) {
        streak++;

        if (streak >= pieceLength) {
          const validPosition: Position = {
            bow: [index, i - (pieceLength - 1)],
            stern: [index, i],
          };

          validShipPositions.push(validPosition);
        }
      } else if (row[i] === OCCUPIED) {
        streak = 0;
      }
    }
  } else if (direction === 'vertical') {
    // youAreHere 💭
  }

  return validShipPositions;
}
