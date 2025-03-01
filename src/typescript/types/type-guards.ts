import {
  AnglesOfRotation,
  Coordinates,
  OccupiedCoordinatesSet,
  OccupiedCoordinatesSetMemberKey,
  FleetCoordinates,
  IPlacePieceParams,
  IPosition,
  Orientation,
  OutOfBounds,
  RotatedCoordinatesValue,
  ShipLength,
  ShipType,
  PositionArray,
  ShipSymbolDescription,
} from '../types/logic-types';
import { PlayerType } from '../types/state-types';

export const isAngleOfRotation = (value: unknown): value is AnglesOfRotation => {
  return Object.values(AnglesOfRotation).includes(value as ShipType);
}
export const isCoordinates = (value: unknown): value is Coordinates => {
  if (!Array.isArray(value) || value.length !== 2) return false;

  return value.every((coordinate) => typeof coordinate === 'number');
};
export const isOccupiedCoordinatesSet = (
  value: unknown
): value is OccupiedCoordinatesSet => {
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
      return false;
    }

    const OccupiedCoordinatesSetOrNull = (value as FleetCoordinates)[
      key as ShipType
    ];

    if (
      OccupiedCoordinatesSetOrNull !== null &&
      !isOccupiedCoordinatesSet(OccupiedCoordinatesSetOrNull)
    ) {
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
};
export const isOrientation = (value: unknown): value is Orientation => {
  if (typeof value !== 'string') return false;
  return ['horizontal', 'vertical'].includes(value);
};
export const isOutOfBounds = (value: unknown): value is OutOfBounds => {
  return value === 'outOfBounds';
};
export const isPlacePieceParams = (
  value: unknown
): value is IPlacePieceParams => {
  if (typeof value !== 'object' || value === null) return false;

  if (!isCoordinates((value as IPlacePieceParams).coordinates)) return false;

  return true;
};
export const isPlayerType = (value: unknown): value is PlayerType => {
  return (
    typeof value === 'string' && (value === 'player' || value === 'opponent')
  );
};
export const isPosition = (value: unknown): value is IPosition => {
  if (!isPlainObject(value)) return false;

  const { bow, stern } = value as IPosition;

  return isCoordinates(bow) && isCoordinates(stern);
};
export const isPositionsArray = (value: unknown): value is PositionArray => {
  if (!Array.isArray(value)) return false;

  return value.every((position) => isPosition(position));
};
export const isOccupiedCoordinatesSetMemberKey = (
  value: unknown
): value is OccupiedCoordinatesSetMemberKey => {
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
};
export const isShipSymbolDescription = (
  value: unknown
): value is ShipSymbolDescription => {
  return (
    typeof value === 'string' &&
    ['CA', 'BS', 'CR', 'SB', 'DD', 'PB'].includes(value)
  );
};
export const isShipType = (value: unknown): value is ShipType => {
  return Object.values(ShipType).includes(value as ShipType);
};