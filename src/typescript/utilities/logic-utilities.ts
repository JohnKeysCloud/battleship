import {
  AnglesOfRotation,
  AxisArrayKey,
  Coordinates,
  OccupiedCoordinatesSet,
  OccupiedCoordinatesSetMemberKey,
  FleetCoordinates,
  IBattlehipFleetBuilderSet,
  IBattleshipFleetBuilderSet,
  IBattleshipGameboardBuilderSet,
  IBattleshipGameboardControllerSet,
  IBattleshipGameboardRepositorySet,
  IPlacePieceParams,
  IPosition,
  IShipPlacementConfigurations,
  Orientation,
  OutOfBounds,
  RotatedCoordinatesValue,
  ShipLength,
  ShipType,
  Version,
  PositionArray
} from "../types/logic-types";
import { BattleshipBoardBuilder } from "../logic/bs-gameboard-builder/bs-gameboard-builder";
import { BattleshipBoardController } from "../logic/bs-gameboard-controller/bs-gameboard-controller";
import { BattleshipBoardRepository } from "../logic/bs-gameboard-repository/bs-gameboard-repository";
import { BattleshipFleetBuilder } from "../logic/bs-fleet-builder/bs-fleet-builder";
import { areArraysEqual } from "./random-utilities";

// 💭 --------------------------------------------------------------

// * FACTORY FUNCTIONS
export function createBattleshipBoardController(
  gameboardBuilder: BattleshipBoardBuilder,
  gameboardRepository: BattleshipBoardRepository,
): BattleshipBoardController {
  return new BattleshipBoardController({gameboardBuilder, gameboardRepository});
}
export function createBattleshipControllerSet(
  { playerOneBoardBuilder, playerTwoBoardBuilder}: IBattleshipGameboardBuilderSet,
  { playerOneBoardRepository, playerTwoBoardRepository }: IBattleshipGameboardRepositorySet,
): IBattleshipGameboardControllerSet {
  return {
    playerOneBoardController: createBattleshipBoardController(
      playerOneBoardBuilder,
      playerOneBoardRepository,
    ),
    playerTwoBoardController: createBattleshipBoardController(
      playerTwoBoardBuilder,
      playerTwoBoardRepository,
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
};
export const isCoordinates = (value: unknown): value is Coordinates => {
  if (!Array.isArray(value) || value.length !== 2) return false;

  return value.every((coordinate) => typeof coordinate === 'number');
};
export const isOccupiedCoordinatesSet = (value: unknown): value is OccupiedCoordinatesSet => {
  if (value === null) return true;
  if (!(value instanceof Set)) return false;

  for (const member of value) {
    if (!isOccupiedCoordinatesSetMemberKey(member)) {
      return false;
    }
  }

  return true;
};
export const isFleetCoordinates = (
  value: unknown
): value is FleetCoordinates => {
  if (typeof value !== 'object' || value === null) return false;

  for (const key in value) {
    if (!Object.values(ShipType).includes(key as ShipType)) {
      return false
    }

    const OccupiedCoordinatesSetOrNull = (value as FleetCoordinates)[
      key as ShipType
    ];

    if (OccupiedCoordinatesSetOrNull !== null && !isOccupiedCoordinatesSet(OccupiedCoordinatesSetOrNull)) {
      return false;
    }
  }
  return true;
};
export const isPlainObject = (value: unknown): value is object => {
  if (typeof value !== 'object' || value === null) return false;

  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
  // ? Why `proto === null`: Object.create(null) is a valid plain object.
}
export const isOrientation = (value: unknown): value is Orientation => {
  if (typeof value !== 'string') return false;
  return ['horizontal', 'vertical'].includes(value);
}
export const isOutOfBounds = (value: unknown): value is OutOfBounds => {
  return (value) === 'outOfBounds';
};
export const isPlacePieceParams = (
  value: unknown
): value is IPlacePieceParams => {
  if (typeof value !== 'object' || value === null) return false;

  if (!isCoordinates((value as IPlacePieceParams).coordinates)) return false;

  return true;
};
export const isPosition = (value: unknown): value is IPosition => {
  if (!isPlainObject(value)) return false;

  const { bow, stern } = value as IPosition;

  return isCoordinates(bow) && isCoordinates(stern);
};
export const isPositionsArray = (value: unknown): value is PositionArray => {
  if (!Array.isArray(value)) return false;

  return value.every(position => isPosition(position));
};
export const isOccupiedCoordinatesSetMemberKey = (value: unknown): value is OccupiedCoordinatesSetMemberKey => {
  if (typeof value !== 'string') return false;

  const match = value.match(/^\[\d{1}, \d{1}\]$/);
  return match !== null;
};
export const isRotatedCoordinatesValue = (
  value: unknown
): value is RotatedCoordinatesValue => {
  return isCoordinates(value) || isOutOfBounds(value);
};
export const isShipLength = (value: unknown): value is ShipLength => {
  return typeof value === 'number' && [2, 3, 4, 5].includes(value);
}
export const isShipType = (
  value: unknown
): value is ShipType => {
  return Object.values(ShipType).includes(value as ShipType);
};

// 💭 --------------------------------------------------------------

export const isNotNull = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
}