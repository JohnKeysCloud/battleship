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
  Orientation,
  ShipLength,
  ShipSymbolValue,
  ShipType,
} from '../../../../types/logic-types';
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
    shipLength: ShipLength
  ): void => {
    const errorMessage = `The ship placement attempt with the following configurations is out of bounds: Coordinates: ${coordinates}, Length: ${ship.length}, Orientation ${orientation}.`;
    if (axisStart + shipLength - 1 >= gameboardInstance.boardSize)
      throw new Error(errorMessage);
  };

  const shipLength: ShipLength = ship.length;
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
      ? [bowX + shipLength - 1, bowY]
      : [bowX, bowY + shipLength - 1],
  };

  const shipConfigurations: IShipPlacementConfigurations = {
    shipLength,
    orientation
  };
  const axisArrayKey: AxisArrayKey = isHorizontal
    ? `row-${bowY}`
    : `column-${bowX}`; 
    
  if (isPositionValid(position, shipConfigurations, axisArrayKey)) {
    const getPlacementCoordinates = (
      validPosition: IPosition,
      isHorizontal: Boolean
    ): CoordinatesArray => {
      const placementCoordinates: CoordinatesArray = [];

      const [bowX, bowY]: Coordinates = validPosition.bow;
      const [sternX, sternY]: Coordinates = validPosition.stern;

      const primary: number = isHorizontal
        ? bowY
        : bowX;
      const axisStart: number = isHorizontal
        ? bowX
        : bowY;
      const axisEnd: number = isHorizontal
        ? sternX
        : sternY;

      for (let i = axisStart; i <= axisEnd; i++) {
        placementCoordinates.push(isHorizontal ? [i, primary] : [primary, i]);
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
        const [x, y]: Coordinates = coordinates;
        gameboard[y][x] = shipSymbol;
      });
    };
    const setShipPlacementConfigurations = (
      ship: BattleshipBuilder,
      coordinatesArray: CoordinatesArray,
      orientation: Orientation
    ): void => {
      ship.placementConfigurations = {
        coordinatesArray,
        orientation,
      };
    };
    const updateOccupiedCoordinatesSet = (
      shipType: ShipType,
      placementCoordinates: CoordinatesArray
    ): void => {
      const fleetCoordinates: IFleetCoordinates = gameboardInstance.fleetCoordinates;

      if (!fleetCoordinates[shipType]) fleetCoordinates[shipType] = new Set();

      const shipCoordinatesSet: CoordinatesSet = fleetCoordinates[shipType];

      placementCoordinates.forEach((coordinates: Coordinates) => {
        const [x, y]: Coordinates = coordinates;
        const setMemberTemplate: CoordinatesSetMember = `[${x}, ${y}]`;
        shipCoordinatesSet.add(setMemberTemplate);
      });
    };

    const placementCoordinates: CoordinatesArray = getPlacementCoordinates(
      position,
      isHorizontal
    );

    placeOnBoard(ship, placementCoordinates);
    setShipPlacementConfigurations(
      ship,
      placementCoordinates,
      orientation
    );
    updateOccupiedCoordinatesSet(ship.type, placementCoordinates);
  } else {
    const errorMessage: string = `"${JSON.stringify(
      position
    )}" is unavailable for ship with Size: ${shipLength} and Orientation: ${orientation}.`;

    throw new Error(errorMessage);
  }
}
