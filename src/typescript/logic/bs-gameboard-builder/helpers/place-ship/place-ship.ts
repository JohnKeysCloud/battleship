import {
  IPosition,
  IShipPlacementConfigurations,
  IPlacePieceCallbackParams,
  ShipSymbolValue,
} from '../../../types/logic-types';
import { areArraysEqual } from '../../../../utilities/random-utilities'; 

export function placeShip({
  gameboardInstance,
  ship,
  coordinates,
  orientation
}: IPlacePieceCallbackParams) {
  const arePositionsEqual = (endpoint: IPosition, position: IPosition) => {
    return (
      areArraysEqual(endpoint.bow, position.bow) &&
      areArraysEqual(endpoint.stern, position.stern)
    );
  };
  const isPositionValid = (
    position: IPosition,
    configurations: IShipPlacementConfigurations
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
    shipSymbol: ShipSymbolValue,
    isHorizontal: Boolean
  ) => {
    const gameboard = gameboardInstance.board;

    const primary = isHorizontal ? position.bow[0] : position.bow[1];
    const axisStart = isHorizontal ? position.bow[1] : position.bow[0];
    const axisEnd = isHorizontal ? position.stern[1] : position.stern[0];

    for (let i = axisStart; i <= axisEnd; i++) {
      isHorizontal
        ? (gameboard[primary][i] = shipSymbol)
        : (gameboard[i][primary] = shipSymbol);
    }

    return gameboard;
  };
  const checkIfCoordinatesInBounds = (axisStart: number, shipLength: number) => {
    const errorMessage = `The ship placement attempt with the following configurations is out of bounds: Coordinates: ${coordinates}, Length: ${ship.length}, Orientation ${orientation}.`;
    if (axisStart + shipLength >= gameboardInstance.boardSize)
      throw new Error(errorMessage);
  };

  const shipSymbol = ship.symbol;
  const shipLength = ship.length;
  const [bowRow, bowColumn] = coordinates;
  const isHorizontal = orientation === 'horizontal';
  const axisStart = isHorizontal ? bowColumn : bowRow;

  checkIfCoordinatesInBounds(axisStart, shipLength);

  const position: IPosition = {
    bow: coordinates,
    stern: isHorizontal
      ? [bowRow, bowColumn + shipLength - 1]
      : [bowRow + shipLength - 1, bowColumn],
  };

  const configurations: IShipPlacementConfigurations = {
    shipLength,
    orientation
  };

  if (isPositionValid(position, configurations)) {
    placeOnBoard(position, shipSymbol, isHorizontal);
  } else {
    const errorMessage = `"${JSON.stringify(
      position
    )}" is unavailable for ship with Size: ${
      shipLength
    } and Orientation: ${orientation}.`;
    throw new Error(errorMessage);
  }
}
