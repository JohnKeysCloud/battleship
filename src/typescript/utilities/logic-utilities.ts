import {
  AnglesOfRotation,
  AxisArrayKey,
  Coordinates,
  CoordinatesSet,
  CoordinatesSetMemberKey,
  IBattlehipFleetBuilderSet,
  IBattleshipGameboardBuilderSet,
  IBattleshipGameboardControllerSet,
  IBattleshipGameboardRepositorySet,
  IFleetCoordinates,
  IPlacePieceParams,
  IPosition,
  IShipPlacementConfigurations,
  OccupiedPositionsMap,
  Orientation,
  ShipLength,
  ShipType,
  Version
} from "../types/logic-types";
import { BattleshipBoardBuilder } from "../logic/bs-gameboard-builder/bs-gameboard-builder";
import { BattleshipBoardController } from "../logic/bs-gameboard-controller/bs-gameboard-controller";
import { BattleshipFleetBuilder } from "../logic/bs-fleet-builder/bs-fleet-builder";
import { areArraysEqual } from "./random-utilities";
import { BattleshipBoardRepository } from "../logic/bs-gameboard-repository/bs-gameboard-repository";

// 💭 --------------------------------------------------------------

// * FACTORY FUNCTIONS
export function createBattleshipBoardController(
  gameboardBuilder: BattleshipBoardBuilder,
  gameboardRepository: BattleshipBoardRepository
): BattleshipBoardController {
  return new BattleshipBoardController(gameboardBuilder, gameboardRepository);
}
export function createBattleshipControllerSet(
  { playerOneBoardBuilder, playerTwoBoardBuilder}: IBattleshipGameboardBuilderSet,
  { playerOneBoardRepository, playerTwoBoardRepository}: IBattleshipGameboardRepositorySet,
): IBattleshipGameboardControllerSet {
  return {
    playerOneBoardController: createBattleshipBoardController(
      playerOneBoardBuilder,
      playerOneBoardRepository
    ),
    playerTwoBoardController: createBattleshipBoardController(
      playerTwoBoardBuilder,
      playerTwoBoardRepository
    ),
  };
}
export function createBattleshipBoardBuilderSet(): IBattleshipGameboardBuilderSet {
  return {
    playerOneBoardBuilder: new BattleshipBoardBuilder(),
    playerTwoBoardBuilder: new BattleshipBoardBuilder(),
  };
}
export function createBattleshipBoardRepositorySet(): IBattleshipGameboardRepositorySet {
  return {
    playerOneBoardRepository: new BattleshipBoardRepository(),
    playerTwoBoardRepository: new BattleshipBoardRepository(),
  };
}
export function createBattleshipFleetBuilderSet(
  version: Version = 2002
): IBattlehipFleetBuilderSet {
  const createBattleshipFleetBuilder =
    version === 2002
      ? BattleshipFleetBuilder.createHasbroFleet
      : BattleshipFleetBuilder.createMBFleet;

  return {
    playerOneFleetBuilder: createBattleshipFleetBuilder(),
    playerTwoFleetBuilder: createBattleshipFleetBuilder(),
  };
}

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

// * TYPE GUARDS
export function isAngleOfRotation(
  value: unknown
): value is AnglesOfRotation {
  return Object.values(AnglesOfRotation).includes(value as ShipType);
}
export const isCoordinatesSet = (value: unknown): value is CoordinatesSet => {
  if (value === null) return true;
  if (!(value instanceof Set)) return false;

  for (const member of value) {
    if (!isCoordinatesSetMemberKey(member)) {
      return false;
    }
  }

  return true;
}
export const isFleetCoordinates = (
  value: unknown
): value is IFleetCoordinates => {
  if (typeof value !== 'object' || value === null) return false;

  for (const key in value) {
    if (!Object.values(ShipType).includes(key as ShipType)) {
      return false
    }

    const coordinatesSetOrNull = (value as OccupiedPositionsMap)[
      key as ShipType
    ];

    if (coordinatesSetOrNull !== null && !isCoordinatesSet(coordinatesSetOrNull)) {
      return false;
    }
  }
  return true;
}
export const isPlacePieceParams = (
  value: unknown
): value is IPlacePieceParams => {
  return (value as IPlacePieceParams).coordinates !== undefined;
}
export const isCoordinatesSetMemberKey = (value: unknown): value is CoordinatesSetMemberKey => {
  if (typeof value !== 'string') return false;

  const match = value.match(/^\[\d{1}, \d{1}\]$/);
  return match !== null;
}
export const isShipType = (
  value: unknown
): value is ShipType => {
  return Object.values(ShipType).includes(value as ShipType);
}