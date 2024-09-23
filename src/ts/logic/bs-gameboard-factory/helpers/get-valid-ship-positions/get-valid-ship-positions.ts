import {
  IValidPlacementCallbackParams,
  IValidPositionsResult,
  IPosition,
  POSITION_STATES
} from "../../bs-gameboard-factory";

export function getValidShipPositions({
  gamePieceSize,
  direction,
  gameboard,
}: IValidPlacementCallbackParams): IValidPositionsResult {
  const validateArguments = (
    direction: 'horizontal' | 'vertical',
    gamePieceSize: number,
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
  };

  // TODO: Consider wrapping this function in a try-catch block when integrating with event handlers
  validateArguments(direction, gamePieceSize);

  const extractAxisArray = (
    direction: 'horizontal' | 'vertical',
    axisIndex: number,
    gameboard: Array<Array<symbol>> // or symbol[][]
  ): Array<symbol> => {
    return direction === 'horizontal'
      ? gameboard[axisIndex] // Returns row
      : gameboard.map((row) => row[axisIndex]); // Returns column
  };

  const findValidPositionsInAxis = (
    axisArray: Array<symbol>, // or symbol[]
    direction: 'horizontal' | 'vertical',
    axisIndex: number,
    gamePieceSize: number
  ): IPosition[] => {
    // Edge case check for ship length greater than row length
    if (gamePieceSize > axisArray.length) {
      throw new Error('Ship length cannot be greater than axisArray length.');
    }

    let streak: number = 0;
    let validAxisPositions: IPosition[] = [];

    for (let i = 0; i < axisArray.length; i++) {
      if (axisArray[i] === POSITION_STATES.vacant) {
        streak++;

        if (streak >= gamePieceSize) {
          const bowPosition: [number, number] =
            direction === 'horizontal'
              ? [axisIndex, i - (gamePieceSize - 1)]
              : [i - (gamePieceSize - 1), axisIndex];
          
          const sternPosition: [number, number] =
            direction === 'horizontal' ? [axisIndex, i] : [i, axisIndex];

          validAxisPositions.push({
            bow: bowPosition,
            stern: sternPosition,
          });
        }
      } else {
        // Reset streak if position is occupied
        streak = 0;
      }
    }
    
    return validAxisPositions;
  };

  let validPositionsPerAxis: IValidPositionsResult = {}; 
  const board = gameboard.board;

  for (let axisIndex = 0; axisIndex < board.length; axisIndex++) {
    const axisArray = extractAxisArray(direction, axisIndex, board);
    const validPositions = findValidPositionsInAxis(
      axisArray,
      direction,
      axisIndex,
      gamePieceSize
    );

    const axisTemplate =
      direction === 'horizontal'
        ? `row-${axisIndex}`
        : `column-${axisIndex}`;
    
    validPositionsPerAxis[axisTemplate] = validPositions;
  }

  return validPositionsPerAxis;
}