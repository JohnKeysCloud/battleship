import {
  AxisArrayKey,
  Coordinates,
  IPosition,
  IShipPlacementConfigurations,
  Orientation,
  ShipLength,
} from "../types/logic-types";
import { areArraysEqual } from "./random-utilities";

// 💭 --------------------------------------------------------------

// * GENERAL HELPER FUNCTIONS
export function createAxisArrayKey(
  axisIndex: number,
  isHorizontal: boolean
): AxisArrayKey {
  return isHorizontal ? `row-${axisIndex}` : `column-${axisIndex}`;
}
export function createPositionObject(
  [x, y]: Coordinates,
  orientation: Orientation,
  shipLength: ShipLength
): IPosition {
  const isHorizontal = orientation === 'horizontal';
  const bowCoordinates: Coordinates = [x, y];
  const sternCoordinates: Coordinates = isHorizontal
    ? [x + shipLength - 1, y]
    : [x, y + shipLength - 1];

  return {
    bow: bowCoordinates,
    stern: sternCoordinates,
  };
}
export function createShipConfigurations(
  shipLength: ShipLength,
  orientation: Orientation
): IShipPlacementConfigurations {
  return {
    orientation,
    shipLength,
  };
}

// 💭 --------------------------------------------------------------

// * BOUND CHECK HELPER FUNCTIONS
export const isCoordinateInBounds = (coordinate: number, boardSize: number): boolean =>
  coordinate >= 0 && coordinate < boardSize;
export const areCoordinatesInBounds = (coordinates: Coordinates, boardSize: number): boolean => {
  return coordinates.every((coordinate) => isCoordinateInBounds(coordinate, boardSize)); 
}
export const isPositionInBounds = (position: IPosition, boardSize: number): boolean => {
  return areCoordinatesInBounds(position.bow, boardSize) && areCoordinatesInBounds(position.stern, boardSize);
};

// 💭 --------------------------------------------------------------

// * UTILITY FUNCTIONS
export const arePositionsEqual = (
  positionOne: IPosition,
  positionTwo: IPosition
): boolean => {
  return (
    areArraysEqual(positionOne.bow, positionTwo.bow) &&
    areArraysEqual(positionOne.stern, positionTwo.stern)
  );
};

// 💭 --------------------------------------------------------------

export const isNotNull = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
}