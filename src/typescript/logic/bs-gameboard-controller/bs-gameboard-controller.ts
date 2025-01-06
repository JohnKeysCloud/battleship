import { BattleshipBuilder } from '../bs-ship-builder/bs-ship-builder';
import {
  AngleOfRotation,
  AnglesOfRotation,
  AxisArrayKey,
  Coordinates,
  CoordinatesArray,
  Fleet,
  IBattleshipGameboardController,
  IPlacePieceCallbackParams,
  IPlacePieceParams,
  IPlacePieceWrapperParams,
  IPosition,
  IShipPlacementConfigurations,
  IValidPlacementCallbackParams,
  IValidPositionsResult,
  Orientation,
  RotatedCoordinatesValue,
  RotatedPlacePieceParams,
  RotatedPlacePieceParamsValue,
  ShipLength,
  ShipType,
  RotationalPositionMap,
  PositionArray,
  ShipSymbolValue,
  ShipSymbolDescription,
} from '../../types/logic-types';
import { PlayerState } from '../../types/state-types';
import {
  areCoordinatesInBounds,
  arePositionsEqual,
  createAxisArrayKey,
  createPositionObject,
  isAngleOfRotation,
  isOutOfBounds,
  isPlacePieceParams,
  isPositionInBounds,
  isPositionsArray,
  isShipSymbolDescription,
  isShipType
} from '../../utilities/logic-utilities';
import { getValidShipPositions } from './abstracted-method-callbacks/get-valid-ship-positions/get-valid-ship-positions';
import { placeShip } from './abstracted-method-callbacks/place-ship/place-ship';

export class BattleshipBoardController implements IBattleshipGameboardController {
  constructor(
    public readonly playerState: Omit<PlayerState, 'gameboardController'>
  ) {}

  // 💭 --------------------------------------------------------------
  // 💭 Public

  public getValidPositions({
    orientation,
    shipLength,
  }: IShipPlacementConfigurations): IValidPositionsResult {
    const validPlacementArg: IValidPlacementCallbackParams = {
      orientation,
      shipLength,
      battleshipBoardBuilder: this.playerState.gameboardBuilder,
      battleshipBoardController: this,
    };

    return getValidShipPositions(validPlacementArg);
  }

  public getAllValidBowCoordinates(
    orientation: Orientation,
    shipLength: ShipLength
  ): Set<Coordinates> {
    let allValidBowCoordinates: Set<Coordinates> = new Set();
    const validPositions: IValidPositionsResult = this.getValidPositions({
      orientation,
      shipLength,
    });

    for (const positionsInAxis of Object.values(validPositions)) {
      if (!isPositionsArray(positionsInAxis))
        throw new Error(
          `Expected each value of validPositions to be an array of IPosition objects, but received: ${typeof positionsInAxis}.`
        );

      positionsInAxis.forEach((position) =>
        allValidBowCoordinates.add(position.bow)
      );
    }

    return allValidBowCoordinates;
  }

  public movePiece(
    ship: BattleshipBuilder,
    newBowCoordinates: Coordinates
  ): void {
    if (!ship.isPlaced()) {
      console.warn(`Invalid Command: The ${ship.type} has not been placed.`);
      return;
    }

    const currentOrientation: Orientation =
      ship.currentplacementConfigurations.orientation!;

    const newPosition: IPosition = createPositionObject(
      newBowCoordinates,
      currentOrientation,
      ship.length
    );

    if (
      !isPositionInBounds(
        newPosition,
        this.playerState.gameboardBuilder.boardSize
      )
    ) {
      console.warn(
        `Invalid Command: Position - Bow: [${newPosition.bow}] & Stern: [${newPosition.stern}] is out of bounds for the ${ship.type}.`
      );

      return;
    }

    const validPositions: IValidPositionsResult = this.getValidPositions({
      orientation: currentOrientation,
      shipLength: ship.length,
    });

    const isHorizontal: boolean = currentOrientation === 'horizontal';
    const [x, y]: Coordinates = newBowCoordinates;
    const axisArrayKey: AxisArrayKey = createAxisArrayKey(
      isHorizontal ? y : x,
      isHorizontal
    );

    const axisArray: PositionArray = validPositions[axisArrayKey];

    const isNewPositionValid: boolean = axisArray.some(
      (position: IPosition): boolean => arePositionsEqual(position, newPosition)
    );

    if (isNewPositionValid) {
      const placementParameters: IPlacePieceWrapperParams = {
        ship,
        coordinates: newBowCoordinates,
        orientation: currentOrientation,
      };
      const shouldResetShipRotationalData: boolean = true;

      this.relocateShip(
        ship,
        placementParameters,
        shouldResetShipRotationalData
      );
    } else {
      console.warn(
        `Invalid Command: Position - Bow: [${newPosition.bow}] & Stern: [${newPosition.stern}] is unavailable for the ${ship.type}.`
      );
    }
  }

  public placePiece({
    ship,
    coordinates,
    orientation,
  }: IPlacePieceWrapperParams): void {
    const placeShipArg: IPlacePieceCallbackParams = {
      ship,
      coordinates,
      orientation,
      battleshipBoardController: this,
      battleshipBoardBuilder: this.playerState.gameboardBuilder,
      battleshipBoardRepository: this.playerState.gameboardRepository,
    };

    placeShip(placeShipArg);

    this.setFleetRotatedPlacePieceParams(this.playerState.fleetBuilder.fleet);
  }

  public prettyPrint(): void {
    console.table(
      this.playerState.gameboardBuilder.board.map((row) =>
        row.map((symbol) =>
          symbol.description === 'VC' ? null : symbol.description
        )
      )
    );
  }

  // TODO: Finish ⤵️ 
  // ? add return signature
  public receiveAttack(coordinates: Coordinates) {
    // ? Insted of `ShipType`, it will be `BattleshipBuilder`
    const attackedShip: BattleshipBuilder | null = this.getShipAt(coordinates);
    
    if (!attackedShip) {
      // TODO: create switch to generate random miss messages? (use JSON?)
      console.warn('Missed me with that nigga!');
      return;
    }

    return attackedShip;

    // ? increment ship hit point
    // ? add coordinates to set of `attackedCells` (create this set in the repository)
    // ? If recieved attack is in repository set, return warning that that cell has already been attacked
    // ? ... etc.
  }

  public removePiece(
    ship: BattleshipBuilder,
    shouldResetShipRotationalData: boolean = true
  ): void {
    if (!this.isShipValidForRemoval(ship)) return;

    const removeShipFromBoard = (shipCoordinates: CoordinatesArray): void => {
      shipCoordinates.forEach(([x, y]) => {
        this.playerState.gameboardBuilder.board[y][x] =
          this.playerState.gameboardBuilder.fillValue;
      });
    };
    const nullifyShipCoordinateSetValue = (shipType: ShipType): void => {
      this.playerState.gameboardRepository.nullifyShipCoordinatesValue(
        shipType
      );
    };
    const resetShipConfigurations = (
      ship: BattleshipBuilder,
      shouldResetShipRotationalData: boolean
    ): void => {
      if (shouldResetShipRotationalData) {
        this.playerState.gameboardRepository.nullifyShipValidRotationalParams(
          ship.type
        );
      }

      ship.resetConfigurations(shouldResetShipRotationalData);
    };

    const shipCoordinates: CoordinatesArray =
      ship.currentplacementConfigurations.coordinatesArray!;

    removeShipFromBoard(shipCoordinates);
    nullifyShipCoordinateSetValue(ship.type);
    resetShipConfigurations(ship, shouldResetShipRotationalData);
  }

  public removeAllPieces(fleet: Fleet): void {
    if (!Object.keys(fleet).length) {
      console.error(
        'Invalid Command: No ships to remove - Fleet is empty or uninitialized.'
      );
      return;
    }

    for (const ship of Object.values(fleet)) {
      this.removePiece(ship);
    }
  }

  public rotatePiece(ship: BattleshipBuilder): void {
    const getNextAngle = (
      rotationalPositionMap: RotationalPositionMap,
      currentAngle: AngleOfRotation
    ): AngleOfRotation => {
      if (currentAngle === null || currentAngle === undefined)
        throw new Error("Current angle doesn't exist");

      const angles: AnglesOfRotation[] = Array.from(
        rotationalPositionMap.keys()
      );

      return (
        angles.find((angle) => angle > currentAngle) ??
        AnglesOfRotation.Degrees0
      );
    };
    const getMaxAngle = (
      rotationalPositionMap: RotationalPositionMap
    ): AngleOfRotation =>
      Array.from(rotationalPositionMap.keys()).pop() ??
      AnglesOfRotation.Degrees0;
    const getNextPiecePlacementParams = (
      ship: BattleshipBuilder,
      rotationalPositionMap: RotationalPositionMap
    ): IPlacePieceWrapperParams => {
      const currentAngle: AngleOfRotation =
        ship.rotationalPivotConfigurations.transientAngleOfRotation;

      const maxAngle: AngleOfRotation = getMaxAngle(rotationalPositionMap);

      if (currentAngle === maxAngle) {
        const originalBowCoordinates: Coordinates =
          ship.rotationalPivotConfigurations.coordinatesArray![0];
        const originalOrientation: Orientation =
          ship.rotationalPivotConfigurations.orientation!;

        // set current degree of rotation
        ship.rotationalPivotConfigurations.transientAngleOfRotation =
          AnglesOfRotation.Degrees0;

        return {
          ship,
          coordinates: originalBowCoordinates,
          orientation: originalOrientation,
        };
      }

      const nextAngle: AngleOfRotation = getNextAngle(
        rotationalPositionMap,
        currentAngle
      );
      const nextPlacePieceParams: IPlacePieceParams | undefined =
        rotationalPositionMap.get(nextAngle!);

      // set current degree of rotation
      ship.rotationalPivotConfigurations.transientAngleOfRotation = nextAngle;

      return {
        ship,
        coordinates: nextPlacePieceParams!.coordinates,
        orientation: nextPlacePieceParams!.orientation,
      };
    };
    const updateTransientPlacementParams = (
      rotationalPositionMap: RotationalPositionMap
    ): IPlacePieceWrapperParams => {
      let nextPlacePieceParams: IPlacePieceWrapperParams =
        getNextPiecePlacementParams(ship, rotationalPositionMap);

      while (
        ship.rotationalPivotConfigurations.transientAngleOfRotation !==
        initialAngle
      ) {
        if (
          this.isRotatedPositionValid(
            nextPlacePieceParams.coordinates,
            nextPlacePieceParams.orientation,
            ship.rotationalPivotConfigurations.transientAngleOfRotation,
            ship.length
          )
        ) {
          break;
        }
        nextPlacePieceParams = getNextPiecePlacementParams(
          ship,
          rotationalPositionMap
        );
      }

      return nextPlacePieceParams;
    };

    const rotationalPositionMap: RotationalPositionMap =
      this.playerState.gameboardRepository.inBoundRotationalPlacePieceForFleet[
        ship.type
      ]!;

    const initialAngle =
      ship.rotationalPivotConfigurations.transientAngleOfRotation;

    /* 
    ┌──────────────────────────────────────────────────────────────────────────────┐
    │ The coolest part of this whole transient concept is that it                  │
    │ allows me to name a variable `finalPlacePieceParams`… which implies a         │
    │ predetermined value, with a function named `updateTransientPlacementParams`… │
    │ which implies something transient… while the semantic naming of the          │ 
    | key-value pair maintain sound logicality. I am intuit. - 💭                  │
    └──────────────────────────────────────────────────────────────────────────────┘
    */

    const finalPlacePieceParams: IPlacePieceWrapperParams =
      updateTransientPlacementParams(rotationalPositionMap);

    if (
      ship.rotationalPivotConfigurations.transientAngleOfRotation ===
      initialAngle
    ) {
      console.warn('No valid rotational position found.');
      return;
    }

    const shouldResetShipRotationalData: boolean = false;

    this.relocateShip(
      ship,
      finalPlacePieceParams,
      shouldResetShipRotationalData
    );
  }

  // 💭 --------------------------------------------------------------
  // 💭 Private

  private areCoordinatesVacant(coordinates: Coordinates): boolean {
    const [x, y] = coordinates;
    return (
      this.playerState.gameboardBuilder.board[y][x] ===
      this.playerState.gameboardBuilder.fillValue
    );
  }

  private getShipAt(coordinates: Coordinates): BattleshipBuilder | null {
    if (this.areCoordinatesVacant(coordinates)) return null;

    const gameboard = this.playerState.gameboardBuilder.board;
    const [x, y]: Coordinates = coordinates;

    const shipSymbolValue: ShipSymbolValue = gameboard[y][x];
    const shipType: ShipType = this.getShipTypeFromSymbol(shipSymbolValue);

    const ship: BattleshipBuilder = this.playerState.fleetBuilder.getShip(shipType);

    return ship;
  }

  private getShipTypeFromSymbol = (shipSymbol: ShipSymbolValue) => {
    if (!isShipSymbolDescription(shipSymbol.description))
      throw new Error('Invalid ship symbol description');
    const shipSymbolDescription: ShipSymbolDescription = shipSymbol.description; // ? Create Type

    switch (shipSymbolDescription) {
      case 'CA':
        return ShipType.Carrier;
      case 'DD':
        return ShipType.Destroyer;
      case 'SB':
        return ShipType.Submarine;
      case 'BS':
        return ShipType.Battleship;
      case 'CR':
        return ShipType.Cruiser;
      case 'PB':
        return ShipType.PatrolBoat;
      default:
        throw new Error(
          'The symbol description does not return valid ship type.'
        );
    }
  };

  private isRotatedPositionValid = (
    [x, y]: Coordinates,
    orientation: Orientation,
    angleOfRotation: AngleOfRotation,
    shipLength: ShipLength
  ): boolean => {
    const isHorizontal = orientation === 'horizontal';
    const gameboardSize = this.playerState.gameboardBuilder.boardSize;
    const gameboard = this.playerState.gameboardBuilder.board;
    const fillValue = this.playerState.gameboardBuilder.fillValue;
    const newAxisIndexStart = isHorizontal ? x : y;

    let i: number;
    let axisIndexEnd: number;

    if (
      (!isHorizontal && angleOfRotation === AnglesOfRotation.Degrees90) ||
      (isHorizontal && angleOfRotation === AnglesOfRotation.Degrees270) ||
      angleOfRotation === AnglesOfRotation.Degrees0
    ) {
      i = 1;
      axisIndexEnd = shipLength;
    } else {
      i = 0;
      axisIndexEnd = shipLength - 1;
    }

    if (newAxisIndexStart + shipLength - 1 >= gameboardSize) return false;

    for (i; i < axisIndexEnd; i++) {
      const cellValue = isHorizontal
        ? gameboard[y][x + i]
        : gameboard[y + i][x];

      if (cellValue !== fillValue) return false;
    }

    return true;
  };

  private getRotatedPlacePieceParams(ship: BattleshipBuilder) {
    const applyOffsetToCoordinate = (
      coordinate: number,
      shipLength: ShipLength
    ): number => {
      const offset: number = shipLength - 1;
      return coordinate - offset;
    };
    const determineRotatedOrientation = (
      angleOfRotation: AngleOfRotation,
      isHorizontal: boolean
    ): Orientation => {
      return isHorizontal
        ? angleOfRotation === AnglesOfRotation.Degrees180
          ? 'horizontal'
          : 'vertical'
        : angleOfRotation === AnglesOfRotation.Degrees180
        ? 'vertical'
        : 'horizontal';
    };
    const getRotatedBowCoordinates = (
      angleOfRotation: AngleOfRotation,
      isHorizontal: boolean,
      [x, y]: Coordinates
    ): RotatedCoordinatesValue => {
      if (
        angleOfRotation === AnglesOfRotation.Degrees0 ||
        (angleOfRotation === AnglesOfRotation.Degrees90 && isHorizontal) ||
        (angleOfRotation === AnglesOfRotation.Degrees270 && !isHorizontal)
      ) {
        return rotationalPivotBowCoordinates;
      }

      const rotatedBowCoordinates: Coordinates = isHorizontal
        ? angleOfRotation === AnglesOfRotation.Degrees180
          ? [applyOffsetToCoordinate(x, ship.length), y]
          : [x, applyOffsetToCoordinate(y, ship.length)] // angleOfRotation === 270
        : angleOfRotation === AnglesOfRotation.Degrees180
        ? [x, applyOffsetToCoordinate(y, ship.length)]
        : [applyOffsetToCoordinate(x, ship.length), y]; // angleOfRotation === 90

      return areCoordinatesInBounds(
        rotatedBowCoordinates,
        this.playerState.gameboardBuilder.boardSize
      )
        ? rotatedBowCoordinates
        : 'outOfBounds';
    };
    const createRotatedPiecePlacementParams = (
      rotationalPivotBowCoordinates: Coordinates,
      rotationalPivotOrientation: Orientation
    ): RotatedPlacePieceParams => {
      const isHorizontal = rotationalPivotOrientation === 'horizontal';

      const rotatedPiecePlacementParams: RotatedPlacePieceParams = {};

      const anglesOfRotation: AnglesOfRotation[] = [
        AnglesOfRotation.Degrees0,
        AnglesOfRotation.Degrees90,
        AnglesOfRotation.Degrees180,
        AnglesOfRotation.Degrees270,
      ];

      anglesOfRotation.forEach((angleOfRotation) => {
        const coordinates: RotatedCoordinatesValue =
          angleOfRotation === AnglesOfRotation.Degrees0
            ? rotationalPivotBowCoordinates
            : getRotatedBowCoordinates(
                angleOfRotation,
                isHorizontal,
                rotationalPivotBowCoordinates
              );

        if (coordinates === 'outOfBounds') {
          rotatedPiecePlacementParams[angleOfRotation] = 'outOfBounds';
        } else {
          rotatedPiecePlacementParams[angleOfRotation] = {
            coordinates,
            orientation:
              angleOfRotation === AnglesOfRotation.Degrees0
                ? rotationalPivotOrientation
                : determineRotatedOrientation(angleOfRotation, isHorizontal),
          };
        }
      });

      return rotatedPiecePlacementParams;
    };
    const generateRotationalPositionMap = (
      rotatedPiecePlacementParams: RotatedPlacePieceParams
    ): RotationalPositionMap => {
      const rotatedPlacePieceParams: RotationalPositionMap = new Map();

      for (const angleOfRotationString of Object.keys(
        rotatedPiecePlacementParams
      )) {
        const angleOfRotationToNum = +angleOfRotationString as AngleOfRotation;

        if (!isAngleOfRotation(angleOfRotationToNum)) {
          throw new Error(
            `Invalid Type: "${angleOfRotationString}" doesn't conform to "AngleOfRotation".`
          );
        }

        const rotatedPlacePieceParamsValue: RotatedPlacePieceParamsValue =
          rotatedPiecePlacementParams[angleOfRotationToNum]!;

        if (
          !(
            isPlacePieceParams(rotatedPlacePieceParamsValue) ||
            isOutOfBounds(rotatedPlacePieceParamsValue)
          )
        ) {
          throw new Error(
            `Invalid Type: "${rotatedPlacePieceParamsValue}" doesn't conform to "RotatedPlacePieceParams".`
          );
        }

        if (!isPlacePieceParams(rotatedPlacePieceParamsValue)) continue;

        const { coordinates: bowCoordinates, orientation }: IPlacePieceParams =
          rotatedPlacePieceParamsValue;

        const placePieceParams: IPlacePieceParams = {
          coordinates: bowCoordinates,
          orientation,
        };

        rotatedPlacePieceParams.set(angleOfRotationToNum, placePieceParams);
      }

      return rotatedPlacePieceParams;
    };

    const rotationalPivotBowCoordinates: Coordinates =
      ship.rotationalPivotConfigurations.coordinatesArray![0];
    const rotationalPivotOrientation: Orientation =
      ship.rotationalPivotConfigurations.orientation!;
    const rotatedPiecePlacementParams: RotatedPlacePieceParams =
      createRotatedPiecePlacementParams(
        rotationalPivotBowCoordinates,
        rotationalPivotOrientation
      );

    const rotatedPlacePieceParamsMap: RotationalPositionMap =
      generateRotationalPositionMap(rotatedPiecePlacementParams);

    return rotatedPlacePieceParamsMap;
  }

  private isShipValidForRemoval(ship: BattleshipBuilder): boolean {
    if (
      !ship.currentplacementConfigurations.coordinatesArray ||
      !this.playerState.gameboardRepository.isShipPlaced(ship.type)
    ) {
      console.error(
        `Error removing ship: ${ship.type} is missing coordinates or not in the fleet.`
      );
      return false;
    }

    return true;
  }

  private relocateShip(
    ship: BattleshipBuilder,
    placementParameters: IPlacePieceWrapperParams,
    shouldResetShipRotationalData: boolean
  ): void {
    this.removePiece(ship, shouldResetShipRotationalData);
    this.placePiece(placementParameters);
  }

  private setFleetRotatedPlacePieceParams(fleet: Fleet): void {
    for (const ship of Object.values(fleet)) {
      if (ship.isPlaced()) this.setShipRotatedPlacePieceParams(ship);
    }
  }

  private setShipRotatedPlacePieceParams(ship: BattleshipBuilder): void {
    const rotatedPlacePieceParams: RotationalPositionMap =
      this.getRotatedPlacePieceParams(ship);

    this.playerState.gameboardRepository.setShipValidRotationalParams(
      ship,
      rotatedPlacePieceParams
    );
  }
}
