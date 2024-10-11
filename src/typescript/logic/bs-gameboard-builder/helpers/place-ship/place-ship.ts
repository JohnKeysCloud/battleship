import {
  IPosition,
  IShipPlacementConfigurations,
  IPlacePieceCallbackParams,
  ShipSymbolValue,
  AxisArrayKey,
} from '../../../types/logic-types';
import { areArraysEqual } from '../../../../utilities/random-utilities'; 

export function placeShip({
  gameboardInstance,
  ship,
  coordinates,
  orientation
}: IPlacePieceCallbackParams): void {
  const arePositionsEqual = (testPosition: IPosition, validPosition: IPosition) => {
    return (
      areArraysEqual(testPosition.bow, validPosition.bow) &&
      areArraysEqual(testPosition.stern, validPosition.stern)
    );
  };
  const isPositionValid = (
    position: IPosition,
    shipConfigurations: IShipPlacementConfigurations,
    axisArrayKey: AxisArrayKey
  ) => {
    const validPositions = gameboardInstance.getValidPositions(shipConfigurations);
    
    return validPositions[axisArrayKey].some((validPosition: IPosition) => 
      arePositionsEqual(position, validPosition));
  };
  const placeOnBoard = (
    validPosition: IPosition,
    shipSymbol: ShipSymbolValue,
    isHorizontal: Boolean
  ) => {
    const gameboard = gameboardInstance.board;

    const primary = isHorizontal ? validPosition.bow[0] : validPosition.bow[1];
    const axisStart = isHorizontal ? validPosition.bow[1] : validPosition.bow[0];
    const axisEnd = isHorizontal ? validPosition.stern[1] : validPosition.stern[0];

    for (let i = axisStart; i <= axisEnd; i++) {
      isHorizontal
        ? (gameboard[primary][i] = shipSymbol)
        : (gameboard[i][primary] = shipSymbol);
    }

    return gameboard;
  };
  const checkIfCoordinatesInBounds = (axisStart: number, shipLength: number) => {
    const errorMessage = `The ship placement attempt with the following configurations is out of bounds: Coordinates: ${coordinates}, Length: ${ship.length}, Orientation ${orientation}.`;
    if (axisStart + shipLength - 1 >= gameboardInstance.boardSize)
      throw new Error(errorMessage);
  };

  const shipLength = ship.length;
  const [bowX, bowY] = coordinates;
  const isHorizontal = orientation === 'horizontal';
  const axisStart = isHorizontal ? bowY : bowX;

  checkIfCoordinatesInBounds(axisStart, shipLength);
  
  const position: IPosition = {
    bow: coordinates,
    stern: isHorizontal
      ? [bowX, bowY + shipLength - 1]
      : [bowX + shipLength - 1, bowY],
  };

  const shipConfigurations: IShipPlacementConfigurations = {
    shipLength,
    orientation
  };

  const axisArrayKey: AxisArrayKey = isHorizontal
    ? `row-${bowX}`
    : `column-${bowY}`; 

  if (isPositionValid(position, shipConfigurations, axisArrayKey)) {
    placeOnBoard(position, ship.symbol, isHorizontal);
  } else {
    const errorMessage = `"${JSON.stringify(
      position
    )}" is unavailable for ship with Size: ${shipLength} and Orientation: ${orientation}.`;
    throw new Error(errorMessage);
  }
}
