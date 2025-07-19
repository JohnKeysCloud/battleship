import { BattleshipFleetBuilder } from '../logic/bs-fleet-builder/bs-fleet-builder';
import { BattleshipBoardBuilder } from '../logic/bs-gameboard-builder/bs-gameboard-builder';
import { BattleshipBoardController } from '../logic/bs-gameboard-controller/bs-gameboard-controller';
import { BattleshipBoardRepository } from '../logic/bs-gameboard-repository/bs-gameboard-repository';
import {
  BattleshipBuilder,
  SHIP_SYMBOLS
} from '../logic/bs-ship-builder/bs-ship-builder';
import { PlayerContext } from './state-types';

// 💭 --------------------------------------------------------------
// 💭 Enumerations/Helpers

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

export const getShipTypes = (version: FleetVersion): ShipType[] =>
  version === 1990
    ? [
        ShipType.Carrier,
        ShipType.Battleship,
        ShipType.Submarine,
        ShipType.Destroyer,
        ShipType.PatrolBoat,
      ]
    : [
        ShipType.Carrier,
        ShipType.Battleship,
        ShipType.Submarine,
        ShipType.Cruiser,
        ShipType.Destroyer,
        ShipType.PatrolBoat,
      ];

// 💭 --------------------------------------------------------------
// 💭 Types

export type AngleOfRotation = null | AnglesOfRotation;
export type AxisArrayKey = `row-${number}` | `column-${number}`;
export type Coordinates = [number, number];
export type CoordinatesArray = Coordinates[];
export type CoordinatesToString = `[${number}, ${number}]`;
export type OccupiedCoordinatesSet = Set<CoordinatesToString> | null;
export type Fleet = {
  [key in ShipType]?: BattleshipBuilder;
};
export type FleetConfigs = {
  [key in ShipType]?: ShipConfig;
};
export type FleetCoordinates = {
  [key in ShipType]?: OccupiedCoordinatesSet | null;
};

export type InBoundRotationalPlacePieceParamsForFleet = {
  [key in ShipType]?: RotationalPositionMap | null;
};
export type Gameboard = symbol[][];
export type OutOfBounds = 'outOfBounds';
export type Orientation = 'horizontal' | 'vertical';
export type PositionArray = IPosition[];
export type RotatedCoordinatesValue = Coordinates | OutOfBounds;
export type RotatedPlacePieceParams = {
  [Key in AnglesOfRotation]?: RotatedPlacePieceParamsValue;
};
export type RotatedPlacePieceParamsValue = IPlacePieceParams | OutOfBounds;
export type RotatedPlacePieceConfigurations = IPlacePieceParams | OutOfBounds;
export type ShipConfig = {
  type: ShipType;
  version?: FleetVersion;
};
export type ShipLength = 2 | 3 | 4 | 5;
export type ShipSymbols = {
  [key in ShipType]: symbol; // Each key in ShipType maps to a symbol
};
export type ShipSymbolDescription = 'CA' | 'BS' | 'CR' | 'SB' | 'DD' | 'PB';
export type ShipSymbolValueArray = ShipSymbolValue[];
export type ShipSymbolValue = typeof SHIP_SYMBOLS[ShipType];
export type SizeLookupKey = `${ShipType}-${FleetVersion}`;
export type RotationalPositionMap = Map<AnglesOfRotation, IPlacePieceParams>;
export type FleetVersion = 1990 | 2002;

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
  playerState: Omit<PlayerContext, 'gameboardController' | 'fleetBuilder'>;
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
  transientAngleOfRotation: AngleOfRotation;
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
  version: FleetVersion;
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
  [key: AxisArrayKey]: PositionArray;
};