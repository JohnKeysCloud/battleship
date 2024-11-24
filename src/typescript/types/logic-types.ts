import { BattleshipFleetBuilder } from '../logic/bs-fleet-builder/bs-fleet-builder';
import { BattleshipBoardBuilder } from '../logic/bs-gameboard-builder/bs-gameboard-builder';
import { BattleshipBoardController } from '../logic/bs-gameboard-controller/bs-gameboard-controller';
import { BattleshipBoardRepository } from '../logic/bs-gameboard-repository/bs-gameboard-repository';
import {
  BattleshipBuilder,
  SHIP_SYMBOLS
} from '../logic/bs-ship-builder/bs-ship-builder';
import { PlayerState } from './state-types';

// 💭 --------------------------------------------------------------
// 💭 Enumerations

export enum AnglesOfRotation {
  Degrees0 = 0,
  Degrees90 = 90,
  Degrees180 = 180,
  Degrees270 = 270
};
export enum ShipType {
  Battleship = 'battleship',
  Carrier = 'carrier',
  Cruiser = 'cruiser',
  Destroyer = 'destroyer',
  PatrolBoat = 'patrolBoat',
  Submarine = 'submarine',
};

// 💭 --------------------------------------------------------------
// 💭 Types

export type AngleOfRotation = null | AnglesOfRotation;
export type AxisArrayKey = `row-${number}` | `column-${number}`;
export type Coordinates = [number, number];
export type CoordinatesArray = Coordinates[];
export type CoordinatesSet = Set<CoordinatesSetMemberKey> | null;
export type CoordinatesSetMemberKey = `[${number}, ${number}]`;
export type Fleet = {
  [key in ShipType]?: BattleshipBuilder;
};
export type FleetConfigs = {
  [key in ShipType]?: ShipConfig;
};
export type FleetCoordinates = {
  [key in ShipType]?: CoordinatesSet | null;
};

export type FleetValidRotationalParams = {
  [key in ShipType]?: ValidRotationalPositionMap | null;
};
export type Gameboard = symbol[][];
export type OutOfBounds = 'outOfBounds';
export type Orientation = 'horizontal' | 'vertical';
export type RotatedCoordinatesValue = Coordinates | OutOfBounds;
export type RotatedPlacePieceParams = {
  [Key in AnglesOfRotation]?: RotatedPlacePieceParamsValue;
};
export type RotatedPlacePieceParamsValue = IPlacePieceParams | OutOfBounds;
export type RotatedPlacePieceConfigurations = IPlacePieceParams | OutOfBounds;
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
export type ValidRotationalPositionMap = Map<AnglesOfRotation, IPlacePieceParams>;
export type Version = 1990 | 2002;

// 💭 --------------------------------------------------------------
// 💭 Interfaces

interface IGridGameboard<T> {
  readonly board: T[][];
  fillValue: T;

};
export interface IGridGameboardSquare<T> extends IGridGameboard<T> {
  boardSize: number;
};
export interface IBattlehipFleetBuilderSet {
  playerOneFleetBuilder: BattleshipFleetBuilder;
  playerTwoFleetBuilder: BattleshipFleetBuilder;
}
export interface IBattleshipGameboardBuilderSet {
  playerOneBoardBuilder: BattleshipBoardBuilder;
  playerTwoBoardBuilder: BattleshipBoardBuilder;
}
export interface IBattleshipFleetBuilderSet {
  playerOneFleetBuilder: BattleshipFleetBuilder;
  playerTwoFleetBuilder: BattleshipFleetBuilder;
}
export interface IBattleshipGameboardController extends IGridGameboardController {
  playerState: Omit<PlayerState, 'gameboardController' | 'fleetBuilder'>;
  getValidPositions(
    shipPlacementConfigs: IShipPlacementConfigurations
  ): IValidPositionsResult;
  movePiece(ship: BattleshipBuilder, newBowCoordinates: Coordinates): void;
  placePiece(options: IPlacePieceWrapperParams): void;
  prettyPrint(): void;
  removePiece(ship: BattleshipBuilder, resetInitialConfigs: boolean): void;
  removeAllPieces(fleet: Fleet): void;
  rotatePiece(ship: BattleshipBuilder): void;
}
export interface IBattleshipGameboardControllerSet {
  playerOneBoardController: BattleshipBoardController;
  playerTwoBoardController: BattleshipBoardController;
}
export interface IBattleshipGameboardRepositorySet {
  playerOneBoardRepository: BattleshipBoardRepository;
  playerTwoBoardRepository: BattleshipBoardRepository;
}
interface IGridGameboardController {
  placePiece(...args: any): void;
  removePiece(...args: any): void;
  removeAllPieces(...args: any): void;
}
export interface IPlacementConfigurations {
  coordinatesArray: CoordinatesArray | null;
  orientation: Orientation | null;
};
export interface IRotationalPivotConfigurations extends IPlacementConfigurations {
  currentAngleOfRotation: AngleOfRotation;
};
export interface IPlacePieceParams {
  coordinates: Coordinates;
  orientation: Orientation;
};
export interface IPlacePieceWrapperParams extends IPlacePieceParams {
  ship: BattleshipBuilder;
};
export interface IPlacePieceCallbackParams extends IPlacePieceWrapperParams {
  battleshipBoardBuilder: BattleshipBoardBuilder
  battleshipBoardController: BattleshipBoardController;
  battleshipBoardRepository: BattleshipBoardRepository;
};
export interface IPosition {
  bow: Coordinates; // [rowIndex, colIndex]
  stern: Coordinates; // [rowIndex, colIndex]
};
export interface IShipOptions {
  hitCounter: number;
  length: ShipLength;
  type: ShipType;
  version: Version;
};
export interface IShipPlacementConfigurations {
  orientation: Orientation;
  shipLength: ShipLength;
};
export interface ITestCaseShipHit {
  expected: string; // Expected output
  hits: number; // Function returning the string to be tested
};
export interface ITestCaseValidPositions {
  shipPlacementConfigs: IShipPlacementConfigurations;
  validPositions: IValidPositionsResult;
};
export interface IValidPlacementCallbackParams extends IShipPlacementConfigurations {
  battleshipBoardBuilder: BattleshipBoardBuilder;
  battleshipBoardController: BattleshipBoardController;
};
export interface IValidPositionsResult {
  [key: AxisArrayKey]: IPosition[];
};