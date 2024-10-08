import { BattleshipBoardBuilder } from '../bs-gameboard-builder/bs-gameboard-builder';
import {
  BattleshipBuilder,
  SHIP_SYMBOLS
} from '../bs-ship-builder/bs-ship-builder';

// 💭 --------------------------------------------------------------
// 💭 Enumerations

export enum ShipType {
  Carrier = 'carrier',
  Battleship = 'battleship',
  Cruiser = 'cruiser',
  Destroyer = 'destroyer',
  Submarine = 'submarine',
  PatrolBoat = 'patrolBoat',
}

// 💭 --------------------------------------------------------------
// 💭 Types

export type AxisName = `row-${number}` | `column-${number}`;
export type Coordinates = [number, number];
export type Fleet = {
  [key in ShipType]?: BattleshipBuilder;
};
export type FleetConfigs = {
  [key in ShipType]?: ShipConfig;
};
export type Orientation = 'horizontal' | 'vertical';
export type ShipConfig = {
  type: ShipType;
  version?: Version;
};
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
  removePiece(endpoint: IPosition): void;
  resetBoard(): void;
}
export interface IGridGameboardSquare<T> extends IGridGameboard<T> {
  boardSize: number;
}
export interface IPlacePieceWrapperParams {
  ship: BattleshipBuilder;
  coordinates: Coordinates;
  orientation: Orientation;
}
export interface IPlacePieceCallbackParams extends IPlacePieceWrapperParams {
  gameboardInstance: BattleshipBoardBuilder
}
export interface IPosition {
  bow: Coordinates; // [rowIndex, colIndex]
  stern: Coordinates; // [rowIndex, colIndex]
}
export interface IShipOptions {
  type: ShipType;
  length: number;
  hitCounter: number;
  version: Version;
}
export interface IShipPlacementConfigurations {
  shipLength: number;
  orientation: Orientation;
}
export interface ITestCaseShipHit {
  hits: number; // Function returning the string to be tested
  expected: string; // Expected output
}
export interface ITestCaseValidPositions {
  shipPlacementConfigs: IShipPlacementConfigurations;
  validPositions: IValidPositionsResult;
}
export interface IValidPlacementCallbackParams extends IShipPlacementConfigurations {
  gameboardInstance: BattleshipBoardBuilder;
}
export interface IValidPositionsResult {
  [key: AxisName]: IPosition[];
}