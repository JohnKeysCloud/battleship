import {
  AxisArrayKey,
  Coordinates,
  CoordinatesArray,
  CoordinatesSet,
  CoordinatesSetMember,
  Gameboard,
  IFleetCoordinates,
  IPlacePieceCallbackParams,
  IPosition,
  IShipPlacementConfigurations,
  IValidPositionsResult,
  ShipSymbolValue,
  ShipType,
} from '../../../types/logic-types';
import { areArraysEqual } from '../../../../utilities/random-utilities'; 
import { BattleshipBuilder } from '../../../bs-ship-builder/bs-ship-builder';

export function placeShip({
  gameboardInstance,
  ship,
  coordinates,
  orientation
}: IPlacePieceCallbackParams): void {
  const checkIfCoordinatesInBounds = (
    axisStart: number,
    shipLength: number
  ) => {
    const errorMessage = `The ship placement attempt with the following configurations is out of bounds: Coordinates: ${coordinates}, Length: ${ship.length}, Orientation ${orientation}.`;
    if (axisStart + shipLength - 1 >= gameboardInstance.boardSize)
      throw new Error(errorMessage);
  };

  const shipLength: number = ship.length;
  const [bowX, bowY]: Coordinates = coordinates;
  const isHorizontal: boolean = orientation === 'horizontal';
  const axisStart: number = isHorizontal ? bowY : bowX;

  checkIfCoordinatesInBounds(axisStart, shipLength);
  
  const arePositionsEqual = (
    testPosition: IPosition,
    validPosition: IPosition
  ): boolean => {
    return (
      areArraysEqual(testPosition.bow, validPosition.bow) &&
      areArraysEqual(testPosition.stern, validPosition.stern)
    );
  };
  const isPositionValid = (
    position: IPosition,
    shipConfigurations: IShipPlacementConfigurations,
    axisArrayKey: AxisArrayKey
  ): boolean => {
    const validPositions: IValidPositionsResult =
      gameboardInstance.getValidPositions(shipConfigurations);

    return validPositions[axisArrayKey].some((validPosition: IPosition) =>
      arePositionsEqual(position, validPosition)
    );
  };
  
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
    const getPlacementCoordinates = (
      validPosition: IPosition,
      isHorizontal: Boolean
    ): CoordinatesArray => {
      const placementCoordinates: CoordinatesArray = [];

      const primary: number = isHorizontal
        ? validPosition.bow[0]
        : validPosition.bow[1];
      const axisStart: number = isHorizontal
        ? validPosition.bow[1]
        : validPosition.bow[0];
      const axisEnd: number = isHorizontal
        ? validPosition.stern[1]
        : validPosition.stern[0];

      for (let i = axisStart; i <= axisEnd; i++) {
        placementCoordinates.push(isHorizontal ? [primary, i] : [i, primary]);
      }

      return placementCoordinates;
    };
    const placeOnBoard = (
      ship: BattleshipBuilder,
      shipPlacementCoordinates: CoordinatesArray
    ): void => {
      const gameboard: Gameboard = gameboardInstance.board;
      const shipSymbol: ShipSymbolValue = ship.symbol;

      shipPlacementCoordinates.forEach((coordinates) => {
        const [x, y] = coordinates;
        gameboard[x][y] = shipSymbol;
      });
    };
    const updateOccupiedCoordinatesSet = (
      shipType: ShipType,
      placementCoordinates: CoordinatesArray
    ): void => {
      const fleetCoordinates: IFleetCoordinates = gameboardInstance.fleetCoordinates;

      if (!fleetCoordinates[shipType]) fleetCoordinates[shipType] = new Set();

      const shipCoordinatesSet: CoordinatesSet = fleetCoordinates[shipType];

      placementCoordinates.forEach((coordinates: Coordinates) => {
        const [x, y] = coordinates;
        const setMemberTemplate: CoordinatesSetMember = `[${x}, ${y}]`;
        shipCoordinatesSet.add(setMemberTemplate);
      });
    };

    const placementCoordinates: CoordinatesArray = getPlacementCoordinates(
      position,
      isHorizontal
    );

    placeOnBoard(ship, placementCoordinates);
    updateOccupiedCoordinatesSet(ship.type, placementCoordinates);
  } else {
    const errorMessage: string = `"${JSON.stringify(
      position
    )}" is unavailable for ship with Size: ${shipLength} and Orientation: ${orientation}.`;
    throw new Error(errorMessage);
  }
}
