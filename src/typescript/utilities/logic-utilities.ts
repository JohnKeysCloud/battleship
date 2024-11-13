import {
  AxisArrayKey,
  Coordinates,
  IPosition,
  IShipPlacementConfigurations,
  Orientation,
  ShipLength,
  Version
} from "../types/logic-types";
import { BattleshipBoardBuilder } from "../logic/bs-gameboard-builder/bs-gameboard-builder";
import { BattleshipBoardController } from "../logic/bs-gameboard-controller/bs-gameboard-controller";
import { BattleshipFleetBuilder } from "../logic/bs-fleet-builder/bs-fleet-builder";
import { areArraysEqual } from "./random-utilities";

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

// * BOUND CHECK FUNCTIONS
export const isCoordinateInBounds = (coordinate: number, boardSize: number) =>
  coordinate >= 0 && coordinate < boardSize;
export const areCoordinatesInBounds = (coordinates: Coordinates, boardSize: number): boolean => {
  return coordinates.every((coordinate) => isCoordinateInBounds(coordinate, boardSize)); 
}
export const isPositionInBounds = (position: IPosition, boardSize: number): boolean => {
  return areCoordinatesInBounds(position.bow, boardSize) && areCoordinatesInBounds(position.stern, boardSize);
};

// * HELPER FUNCTIONS
export function createAxisArrayKey(
  axisIndex: number,
  isHorizontal: boolean
): AxisArrayKey {
  return isHorizontal ? `row-${axisIndex}` : `column-${axisIndex}`;
}
export function createBattleshipFleets(version: Version = 2002) {
  const fleet =
    version === 2002
      ? BattleshipFleetBuilder.createHasbroFleet
      : BattleshipFleetBuilder.createMBFleet;

  return {
    playerOne: fleet(),
    playerTwo: fleet(),
  };
}
export function createBattleshipBoardController(gameboardBuilder: BattleshipBoardBuilder) {
  return new BattleshipBoardController(gameboardBuilder);
};

export function createBattleshipControllerSet(
  playerOneBoardBuilder: BattleshipBoardBuilder,
  playerTwoBoardBuilder: BattleshipBoardBuilder) {
  return {
    playerOneBoardController: createBattleshipBoardController(playerOneBoardBuilder),
    playerTwoBoardController: createBattleshipBoardController(playerTwoBoardBuilder),
  };
}
export function createBattleshipBoardSet() {
  return {
    playerOne: new BattleshipBoardBuilder(),
    playerTwo: new BattleshipBoardBuilder(),
  };
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
      stern: sternCoordinates
    }
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

