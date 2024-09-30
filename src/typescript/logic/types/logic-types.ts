import { BattleshipFactory } from '../bs-ship-factory/bs-ship-factory';

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
  [key in ShipType]?: BattleshipFactory;
};
export type PositionStates = {
  vacant: symbol;
  occupied: symbol;
};
export type ShipConfig = {
  type: ShipType;
  version?: Version;
};
export type ShipConfigs = {
  [key in ShipType]?: ShipConfig;
};
export type ShipStates = {
  [key in ShipType]?: symbol;
};
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
  coordinates: Coordinates;
  configurations?: IShipConfigurations;
}
export interface IPosition {
  bow: Coordinates; // [rowIndex, colIndex]
  stern: Coordinates; // [rowIndex, colIndex]
}
export interface IShipConfigurations {
  direction: 'horizontal' | 'vertical';
  gamePieceSize: number;
}
export interface IShipOptions {
  type: ShipType;
  size: number;
  hitCounter?: number;
  version?: Version;
}
export interface ITestCaseShipHit {
  hits: number; // Function returning the string to be tested
  expected: string; // Expected output
}
export interface ITestCaseValidPositions {
  shipConfigs: IShipConfigurations;
  validPositions: IValidPositionsResult;
}
export interface IValidPlacementCallbackParams extends IShipConfigurations {
  gameboard: IGridGameboardSquare<symbol>;
}
export interface IValidPositionsResult {
  [key: AxisName]: IPosition[];
}