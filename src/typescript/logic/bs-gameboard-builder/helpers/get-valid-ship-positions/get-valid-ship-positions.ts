import {
  AxisArrayKey,
  Coordinates,
  Gameboard,
  IPosition,
  IValidPlacementCallbackParams,
  IValidPositionsResult,
  Orientation,
} from '../../../types/logic-types';

export function getValidShipPositions({
  shipLength,
  orientation,
  gameboardInstance,
}: IValidPlacementCallbackParams): IValidPositionsResult {
  const validateArguments = (
    shipLength: number,
  ): void => {
    // Validate piece length
    if (shipLength < 2 || shipLength > 5) {
      throw new Error(
        'Invalid piece length. Ship length must be between 2 and 5 units.'
      );
    }
  };

  // TODO: creating a shipLength type will remove the need for this helper
  validateArguments(shipLength);

  const extractAxisArray = (
    axisIndex: number,
    orientation: Orientation,
    gameboard: Gameboard
  ): Array<symbol> => { // or symbol[]
    return orientation === 'horizontal'
      ? gameboard[axisIndex] // Returns row
      : gameboard.map(row => row[axisIndex]); // Returns column
  };

  const findValidPositionsInAxis = (
    axisArray: Array<symbol>, // or symbol[]
    orientation: Orientation,
    axisIndex: number,
    shipLength: number
  ): IPosition[] => {
    // Edge case check for ship length greater than row length
    if (shipLength > axisArray.length) {
      throw new Error('Ship length cannot be greater than axisArray length.');
    }

    let streak: number = 0;
    let validAxisPositions: IPosition[] = [];

    for (let i = 0; i < axisArray.length; i++) {
      if (axisArray[i] === gameboardInstance.fillValue) {
        streak++;

        if (streak >= shipLength) {
          const bowPosition: Coordinates =
            orientation === 'horizontal'
              ? [axisIndex, i - (shipLength - 1)]
              : [i - (shipLength - 1), axisIndex];
          
          const sternPosition: Coordinates =
            orientation === 'horizontal' ? [axisIndex, i] : [i, axisIndex];

          validAxisPositions.push({
            bow: bowPosition,
            stern: sternPosition,
          });
        }
      } else {
        streak = 0;
      }
    }
    
    return validAxisPositions;
  };

  let validPositionsPerAxis: IValidPositionsResult = {}; 
  const board: Gameboard = gameboardInstance.board;

  for (let axisIndex = 0; axisIndex < board.length; axisIndex++) {
    const axisArray: Array<symbol> = extractAxisArray(axisIndex, orientation, board);
    const validPositions: IPosition[] = findValidPositionsInAxis(
      axisArray,
      orientation,
      axisIndex,
      shipLength
    );

    const axisTemplate: AxisArrayKey =
      orientation === 'horizontal' ? `row-${axisIndex}` : `column-${axisIndex}`;

    validPositionsPerAxis[axisTemplate] = validPositions;
  }

  return validPositionsPerAxis;
}