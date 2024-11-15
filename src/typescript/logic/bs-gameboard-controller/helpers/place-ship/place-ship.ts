import {
  AnglesOfRotation,
  AxisArrayKey,
  Coordinates,
  CoordinatesArray,
  Gameboard,
  IPlacementConfigurations,
  IPlacePieceCallbackParams,
  IPosition,
  IShipPlacementConfigurations,
  IValidPositionsResult,
  Orientation,
  ShipLength,
  ShipSymbolValue,
  ShipType,
} from '../../../../types/logic-types';
import { arePositionsEqual, createPositionObject, isCoordinateInBounds } from '../../../../utilities/logic-utilities';
import { BattleshipBuilder } from '../../../bs-ship-builder/bs-ship-builder';

export function placeShip({
  ship,
  coordinates,
  orientation,
  battleshipBoardController,
  battleshipBoardBuilder,
  battleshipBoardRepository
}: IPlacePieceCallbackParams): void {  
  const shipLength: ShipLength = ship.length;
  const [bowX, bowY]: Coordinates = coordinates;
  const isHorizontal: boolean = orientation === 'horizontal';
  const axisStart: number = isHorizontal ? bowX : bowY;
  const axisEnd = axisStart + shipLength - 1;

  if (!isCoordinateInBounds(axisEnd, battleshipBoardBuilder.boardSize)) {
    const errorMessage: string = `Invalid Command: The ship placement attempt with the following configurations is out of bounds - Coordinates: ${coordinates}, Length: ${ship.length}, Orientation: ${orientation}.`;
    throw new Error(errorMessage);
  };

  if (ship.isPlaced()) {
    console.warn(`Invalid Command: The ${ship.type} has already been placed.`);
    return;
  };

  const isPositionValid = (
    position: IPosition,
    shipConfigurations: IShipPlacementConfigurations,
    axisArrayKey: AxisArrayKey
  ): boolean => {
    const validPositions: IValidPositionsResult =
      battleshipBoardController.getValidPositions(shipConfigurations);

    return validPositions[axisArrayKey].some((validPosition: IPosition) =>
      arePositionsEqual(position, validPosition)
    );
  };

  const position: IPosition = createPositionObject(
    coordinates,
    orientation,
    shipLength,
  );

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
      const gameboard: Gameboard = battleshipBoardBuilder.board;
      const shipSymbol: ShipSymbolValue = ship.symbol;

      shipPlacementCoordinates.forEach((coordinates) => {
        const [x, y]: Coordinates = coordinates;
        gameboard[y][x] = shipSymbol;
      });
    };
    const setShipConfigurations = (
      ship: BattleshipBuilder,
      coordinatesArray: CoordinatesArray,
      orientation: Orientation
    ): void => {
      const placementConfigurations: IPlacementConfigurations = { coordinatesArray, orientation };
      
      ship.currentplacementConfigurations = placementConfigurations;

      if (Object.values(ship.rotationalPivotConfigurations).every(value => value === null)) {
        ship.rotationalPivotConfigurations = {
          ...placementConfigurations,
          currentAngleOfRotation: AnglesOfRotation.Degrees0,
        }
      }      
    };
    const updateOccupiedCoordinatesSet = (
      shipType: ShipType,
      placementCoordinates: CoordinatesArray
    ): void => {
      battleshipBoardRepository.addShipToFleetCoordinates(
        shipType,
        placementCoordinates
      );
    };

    const placementCoordinates: CoordinatesArray = getPlacementCoordinates(
      position,
      isHorizontal
    );

    placeOnBoard(ship, placementCoordinates);
    setShipConfigurations(
      ship,
      placementCoordinates,
      orientation
    );
    updateOccupiedCoordinatesSet(ship.type, placementCoordinates);
  } else {
    const errorMessage: string = `Invalid Command: "${JSON.stringify(
      position
    )}" is unavailable for ship with Size: ${shipLength} and Orientation: ${orientation}.`;

    throw new Error(errorMessage);
  }
}
