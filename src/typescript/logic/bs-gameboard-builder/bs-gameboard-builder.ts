import {
  AngleOfRotation,
  AnglesOfRotation,
  AxisArrayKey,
  Coordinates,
  CoordinatesArray,
  CoordinatesSet,
  CoordinatesSetMember,
  FleetValidRotationalParams,
  Gameboard,
  IBattleshipGameboard,
  IFleetCoordinates,
  IPlacePieceCallbackParams,
  IPlacePieceParams,
  IPlacePieceWrapperParams,
  IPosition,
  IShipPlacementConfigurations,
  IValidPlacementCallbackParams,
  IValidPositionsResult,
  Orientation,
  RotatedCoordinatesValue,
  RotatedPlacePieceConfigurations,
  RotatedPlacePieceParams,
  ShipLength,
  ShipType,
  ValidRotationalPositionMap,
} from '../../types/logic-types';
import { BattleshipBuilder } from '../bs-ship-builder/bs-ship-builder';
import {
  areCoordinatesInBounds,
  arePositionsEqual,
  createAxisArrayKey,
  createPositionObject,
  isPositionInBounds,
} from '../../utilities/logic-utilities';
import { getValidShipPositions } from './helpers/get-valid-ship-positions/get-valid-ship-positions';
import { placeShip } from './helpers/place-ship/place-ship';

export class BattleshipBoardBuilder implements IBattleshipGameboard<symbol> {
  private static readonly vacant: symbol = Symbol('VC');

  private readonly _board: Gameboard;
  private readonly _boardSize: number = 10;
  private readonly _fillValue: symbol = BattleshipBoardBuilder.vacant;
  private readonly _fleetCoordinates: IFleetCoordinates = {};
  private readonly _fleetValidRotationalParams: FleetValidRotationalParams = {};

  constructor() {
    this._board = Array.from({ length: this._boardSize }, () =>
      Array(this._boardSize).fill(this._fillValue)
    );
  }

  public get board(): Gameboard {
    return this._board;
  }

  public get boardSize(): number {
    return this._boardSize;
  }

  public get fillValue(): symbol {
    return this._fillValue;
  }

  public get fleetCoordinates(): IFleetCoordinates {
    return this._fleetCoordinates;
  }

  public getValidPositions({
    orientation,
    shipLength,
  }: IShipPlacementConfigurations): IValidPositionsResult {
    const validPlacementArg: IValidPlacementCallbackParams = {
      orientation,
      shipLength,
      gameboardInstance: this,
    };

    return getValidShipPositions(validPlacementArg);
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

    if (!isPositionInBounds(newPosition, this.boardSize)) {
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

    const axisArray: IPosition[] = validPositions[axisArrayKey];

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
      gameboardInstance: this,
    };

    placeShip(placeShipArg);
  }

  public prettyPrint(): void {
    console.table(
      this._board.map((row) =>
        row.map((symbol) =>
          symbol.description === 'VC' ? null : symbol.description
        )
      )
    );
  }

  public removePiece(
    ship: BattleshipBuilder,
    shouldResetShipRotationalData: boolean = true
  ): void {
    if (!this.isShipValidForRemoval(ship)) return;

    const removeShipFromBoard = (shipCoordinates: CoordinatesArray): void => {
      shipCoordinates.forEach(([x, y]) => {
        this.board[y][x] = this.fillValue;
      });
    };
    const nullifyShipCoordinateSetValue = (shipType: ShipType): void => {
      this.fleetCoordinates[shipType] = null;
    };
    const resetShipConfigurations = (
      ship: BattleshipBuilder,
      shouldResetShipRotationalData: boolean
    ): void => {
      if (shouldResetShipRotationalData) {
        this._fleetValidRotationalParams[ship.type] = null;
      }

      ship.resetConfigurations(shouldResetShipRotationalData);
    };

    const shipCoordinates: CoordinatesArray =
      ship.currentplacementConfigurations.coordinatesArray!;
    const shipType: ShipType = ship.type;

    removeShipFromBoard(shipCoordinates);
    nullifyShipCoordinateSetValue(shipType);
    resetShipConfigurations(ship, shouldResetShipRotationalData);
  }

  public resetBoard(): void {
    for (let i = 0; i < this._board.length; i++) {
      this._board[i].fill(this._fillValue);
    }
  }

  public rotatePiece(ship: BattleshipBuilder): void {
    const setValidRotatedPlacePieceParams = (ship: BattleshipBuilder): void => {
      if (!this._fleetValidRotationalParams[ship.type])
        this._fleetValidRotationalParams[ship.type] =
          this.getValidRotatedPlacePieceParams(ship);
    };

    setValidRotatedPlacePieceParams(ship);

    const canShipBeRotated = (
      validRotationalPositionMap: ValidRotationalPositionMap
    ): boolean => validRotationalPositionMap.size > 1;

    const validRotationalPositionMap: ValidRotationalPositionMap =
      this._fleetValidRotationalParams[ship.type]!;

    if (!canShipBeRotated(validRotationalPositionMap)) {
      console.warn(
        `Invalid Command: The ${ship.type} cannot be rotated.`
      );
      return;
    }

    const getNextGreatestAngleOfRotation = (
      validRotationalPositionMap: ValidRotationalPositionMap
    ): AngleOfRotation => {
      const validAnglesOfRotation: AnglesOfRotation[] = Array.from(
        validRotationalPositionMap.keys()
      );

      const greatestValidAngleOfRotation: AngleOfRotation =
        validAnglesOfRotation.filter(
          (angleOfRotation) => angleOfRotation > shipCurrentAngleOfRotation!
        )[0];

      return greatestValidAngleOfRotation;
    };
    const getGreatestValidAngleOfRotation = (
      validRotationalPositionMap: ValidRotationalPositionMap
    ): AngleOfRotation => {
      let greatestValidAngleOfRotation: AngleOfRotation =
        AnglesOfRotation.Degrees0;

      for (const [angleOfRotation, _] of validRotationalPositionMap) {
        greatestValidAngleOfRotation = angleOfRotation;
      }

      return greatestValidAngleOfRotation;
    };
    const getNextValidPiecePlacementParams = (
      ship: BattleshipBuilder
    ): IPlacePieceWrapperParams => {
      const shipCurrentAngleOfRotation: AngleOfRotation =
        ship.rotationalPivotConfigurations.currentAngleOfRotation;
      const greatestValidAngleOfRotation: AngleOfRotation =
        getGreatestValidAngleOfRotation(validRotationalPositionMap);

      if (shipCurrentAngleOfRotation === greatestValidAngleOfRotation) {
        const originalBowCoordinates: Coordinates =
          ship.rotationalPivotConfigurations.coordinatesArray![0];
        const originalOrientation: Orientation =
          ship.rotationalPivotConfigurations.orientation!;

        ship.rotationalPivotConfigurations.currentAngleOfRotation =
          AnglesOfRotation.Degrees0;

        return {
          ship,
          coordinates: originalBowCoordinates,
          orientation: originalOrientation,
        };
      } else {
        const validRotationalPositionMap: ValidRotationalPositionMap =
          this._fleetValidRotationalParams[ship.type]!;

        const nextValidAngleOfRotation: AngleOfRotation =
          getNextGreatestAngleOfRotation(validRotationalPositionMap);

        const nextValidRotatedPlacePieceParams = validRotationalPositionMap.get(
          nextValidAngleOfRotation!
        );

        ship.rotationalPivotConfigurations.currentAngleOfRotation =
          nextValidAngleOfRotation;

        return {
          ship,
          coordinates: nextValidRotatedPlacePieceParams!.coordinates,
          orientation: nextValidRotatedPlacePieceParams!.orientation,
        };
      }
    };

    const shipCurrentAngleOfRotation: AngleOfRotation =
      ship.rotationalPivotConfigurations.currentAngleOfRotation;
    const nextValidPiecePlacementParams: IPlacePieceWrapperParams =
      getNextValidPiecePlacementParams(ship);

    const shouldResetShipRotationalData: boolean = false;

    this.relocateShip(
      ship,
      nextValidPiecePlacementParams,
      shouldResetShipRotationalData
    );
  }

  private areCoordinatesVacant(coordinates: Coordinates): boolean {
    const [x, y] = coordinates;
    return this.board[y][x] === this.fillValue;
  }

  // ? maybe use this with UI? (TODO: create return value type)
  private getShipCoordinatesAt(coordinates: Coordinates) {
    if (this.areCoordinatesVacant(coordinates)) return;

    const [x, y]: Coordinates = coordinates;
    const formattedInputCoordinates: CoordinatesSetMember = `[${x}, ${y}]`;

    for (const shipType in this.fleetCoordinates) {
      const shipCoordinateSet: CoordinatesSet = this.fleetCoordinates[shipType];

      if (shipCoordinateSet!.has(formattedInputCoordinates)) {
        return {
          type: shipType,
          shipCoordinateSet,
        };
      }
    }
  }

  private getValidRotatedPlacePieceParams(ship: BattleshipBuilder) {
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

      return areCoordinatesInBounds(rotatedBowCoordinates, this.boardSize)
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
    const validatePosition = (
      [x, y]: Coordinates,
      orientation: Orientation,
      angleOfRotation: AngleOfRotation,
      shipLength: ShipLength
    ): boolean => {
      if (angleOfRotation === AnglesOfRotation.Degrees0) return true;

      const isHorizontal = orientation === 'horizontal';
      let i: number;
      let axisIndexEnd: number;

      if (
        (!isHorizontal && angleOfRotation === AnglesOfRotation.Degrees90) ||
        (isHorizontal && angleOfRotation === AnglesOfRotation.Degrees270)
      ) {
        i = 1;
        axisIndexEnd = shipLength;
      } else {
        i = 0;
        axisIndexEnd = shipLength - 1;
      }

      for (i; i < axisIndexEnd; i++) {
        if (isHorizontal) {
          if (this.board[y][x + i] !== this.fillValue) return false;
        } else {
          if (this.board[y + i][x] !== this.fillValue) return false;
        }
      }
      return true;
    };
    const generateValidRotatedPlacePieceParams = (
      rotatedPiecePlacementParams: RotatedPlacePieceParams
    ): ValidRotationalPositionMap => {
      const validRotatedPlacePieceParams: ValidRotationalPositionMap =
        new Map();

      for (const angleOfRotation in rotatedPiecePlacementParams) {
        const rotatedPiecePlacementConfigurations: RotatedPlacePieceConfigurations =
          rotatedPiecePlacementParams[angleOfRotation];

        if (rotatedPiecePlacementConfigurations === 'outOfBounds') continue;

        const { coordinates: bowCoordinates, orientation }: IPlacePieceParams =
          rotatedPiecePlacementConfigurations;

        const isPositionValid: boolean = validatePosition(
          bowCoordinates,
          orientation,
          +angleOfRotation,
          ship.length
        );

        if (isPositionValid) {
          const placePieceParams: IPlacePieceParams = {
            coordinates: bowCoordinates,
            orientation,
          };

          validRotatedPlacePieceParams.set(+angleOfRotation, placePieceParams);
        }
      }

      return validRotatedPlacePieceParams;
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

    const validRotatedPlacePieceParams: ValidRotationalPositionMap = generateValidRotatedPlacePieceParams(
      rotatedPiecePlacementParams
    );

    return validRotatedPlacePieceParams;
  }

  private isShipValidForRemoval(ship: BattleshipBuilder): boolean {
    if (
      !ship.currentplacementConfigurations.coordinatesArray ||
      this.fleetCoordinates[ship.type] === null
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
    shouldResetShipRotationalData: boolean,
  ): void {
    this.removePiece(ship, shouldResetShipRotationalData);
    this.placePiece(placementParameters);
  }
}