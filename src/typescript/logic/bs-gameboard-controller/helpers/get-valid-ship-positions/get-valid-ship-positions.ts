import {
  AxisArrayKey,
  Coordinates,
  Gameboard,
  IValidPlacementCallbackParams,
  IValidPositionsResult,
  Orientation,
  PositionArray,
  ShipLength,
} from '../../../../types/logic-types';

export function getValidShipPositions({
  shipLength,
  orientation,
  battleshipBoardBuilder,
  battleshipBoardController
}: IValidPlacementCallbackParams): IValidPositionsResult {
  const extractAxisArray = (
    axisIndex: number,
    orientation: Orientation,
    gameboard: Gameboard
  ): Array<symbol> => { // or symbol[]
    
    return orientation === 'horizontal'
      ? gameboard[axisIndex] // Returns row #<axisIndex>
      : gameboard.map(row => row[axisIndex]) // `y` values at column-<axisIndex>
  };
  const findValidPositionsInAxis = (
    axisArray: Array<symbol>, // or symbol[]
    isHorizontal: boolean,
    axisIndex: number,
    shipLength: ShipLength
  ): PositionArray => {
    let streak: number = 0;
    let validAxisPositions: PositionArray = [];
    
    for (let i = 0; i < axisArray.length; i++) {
      if (axisArray[i] === battleshipBoardBuilder.fillValue) {
        streak++;
        
        if (streak >= shipLength) {
          const bowPosition: Coordinates =
            isHorizontal
            ? [i - (shipLength - 1), axisIndex]
            : [axisIndex, i - (shipLength - 1)];
          
          const sternPosition: Coordinates =
            isHorizontal
              ? [i, axisIndex]
              : [axisIndex, i];

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

  const validPositionsPerAxis: IValidPositionsResult = {}; 
  const board: Gameboard = battleshipBoardBuilder.board;
  const isHorizontal = orientation === 'horizontal';

  for (let axisIndex = 0; axisIndex < board.length; axisIndex++) {
    const axisArray: Array<symbol> = extractAxisArray(axisIndex, orientation, board);
    const validPositions: PositionArray = findValidPositionsInAxis(
      axisArray,
      isHorizontal,
      axisIndex,
      shipLength
    );
    
    const axisTemplate: AxisArrayKey =
      isHorizontal
        ? `row-${axisIndex}`
        : `column-${axisIndex}`;
    
    validPositionsPerAxis[axisTemplate] = validPositions;
  }

  return validPositionsPerAxis;
}