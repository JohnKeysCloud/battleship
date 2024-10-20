import { BattleshipBoardBuilder } from '../logic/bs-gameboard-builder/bs-gameboard-builder';
import {
  BattleshipBuilder,
  SHIP_SYMBOLS
} from '../logic/bs-ship-builder/bs-ship-builder';

// 💭 --------------------------------------------------------------
// 💭 Enumerations

export enum ShipType {
  Battleship = 'battleship',
  Carrier = 'carrier',
  Cruiser = 'cruiser',
  Destroyer = 'destroyer',
  PatrolBoat = 'patrolBoat',
  Submarine = 'submarine',
}

// 💭 --------------------------------------------------------------
// 💭 Types

export type AxisArrayKey = `row-${number}` | `column-${number}`;
export type Coordinates = [number, number];
export type CoordinatesArray = Coordinates[];
export type CoordinatesSet = Set<CoordinatesSetMember>;
export type CoordinatesSetMember = `[${number}, ${number}]`;
export type Fleet = {
  [key in ShipType]?: BattleshipBuilder;
};
export type FleetConfigs = {
  [key in ShipType]?: ShipConfig;
};
export type Gameboard = symbol[][];
export type OccupiedPositionsMap = {
  [key in ShipType]?: CoordinatesSet;
};
export type Orientation = 'horizontal' | 'vertical';
export type ShipConfig = {
  type: ShipType;
  version?: Version;
};
export type ShipLength = 2 | 3 | 4 | 5;
export type ShipSymbols = {
  [key in ShipType]: symbol; // Each key in ShipType maps to a symbol
};
export type ShipSymbolValue = typeof SHIP_SYMBOLS[ShipType];
export type SizeLookupKey = `${ShipType}-${Version}`;
export type Version = 1990 | 2002;

// 💭 --------------------------------------------------------------
// 💭 Interfaces

interface IGridGameboard<T> {
  readonly board: T[][];
  fillValue: T;
  placePiece(options: IPlacePieceWrapperParams): void;
  removePiece?(coordinates: Coordinates): void;
  resetBoard(): void;
}
export interface IGridGameboardSquare<T> extends IGridGameboard<T> {
  boardSize: number;
}
export interface IFleetCoordinates extends OccupiedPositionsMap { }

export interface IPlacementConfigurations {
  coordinatesArray: CoordinatesArray | null;
  orientation: Orientation | null;
}
export interface IPlacePieceWrapperParams {
  coordinates: Coordinates;
  orientation: Orientation;
  ship: BattleshipBuilder;
}
export interface IPlacePieceCallbackParams extends IPlacePieceWrapperParams {
  gameboardInstance: BattleshipBoardBuilder
}
export interface IPosition {
  bow: Coordinates; // [rowIndex, colIndex]
  stern: Coordinates; // [rowIndex, colIndex]
}
export interface IShipOptions {
  hitCounter: number;
  length: ShipLength;
  type: ShipType;
  version: Version;
}
export interface IShipPlacementConfigurations {
  orientation: Orientation;
  shipLength: ShipLength;
}
export interface ITestCaseShipHit {
  expected: string; // Expected output
  hits: number; // Function returning the string to be tested
}
export interface ITestCaseValidPositions {
  shipPlacementConfigs: IShipPlacementConfigurations;
  validPositions: IValidPositionsResult;
}
export interface IValidPlacementCallbackParams extends IShipPlacementConfigurations {
  gameboardInstance: BattleshipBoardBuilder;
}
export interface IValidPositionsResult {
  [key: AxisArrayKey]: IPosition[];
}