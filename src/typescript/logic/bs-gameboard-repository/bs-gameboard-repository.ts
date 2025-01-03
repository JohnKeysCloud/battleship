import { BattleshipBuilder } from "../bs-ship-builder/bs-ship-builder";
import {
  Coordinates,
  CoordinatesArray,
  OccupiedCoordinatesSetMemberKey,
  FleetCoordinates,
  InBoundRotationalPlacePieceParamsForFleet,
  ShipType,
  RotationalPositionMap
} from "../../types/logic-types";
import { isOccupiedCoordinatesSet, isFleetCoordinates, isShipType } from "../../utilities/logic-utilities";

export class BattleshipBoardRepository {
  private readonly _fleetCoordinates: FleetCoordinates = {};
  private readonly _inBoundRotationalPlacePieceParamsForFleet: InBoundRotationalPlacePieceParamsForFleet = {};

  // 💭 --------------------------------------------------------------

  public get fleetCoordinates(): FleetCoordinates {
    return this._fleetCoordinates;
  }

  public get inBoundRotationalPlacePieceForFleet(): InBoundRotationalPlacePieceParamsForFleet {
    return this._inBoundRotationalPlacePieceParamsForFleet;
  }

  public addShipToFleetCoordinates(
    shipType: ShipType,
    placementCoordinates: CoordinatesArray
  ): void {
    if (!this.fleetCoordinates[shipType]) {
      this.fleetCoordinates[shipType] = new Set();
    }

    placementCoordinates.forEach((coordinates: Coordinates) => {
      const [x, y]: Coordinates = coordinates;
      const setMemberTemplate: OccupiedCoordinatesSetMemberKey = `[${x}, ${y}]`;
      this.fleetCoordinates[shipType]!.add(setMemberTemplate);
    });
  }

  public getShipDataAt(coordinates: Coordinates) {
    if (!isFleetCoordinates(this.fleetCoordinates)) {
      throw new Error(
        `Invalid Type: "${this.fleetCoordinates}" doesn't conform to "FleetCoordinates".`
      );
    }

    const validateTypes = (shipType: unknown, OccupiedCoordinatesSet: unknown): void => {
      if (!isShipType(shipType))
        throw new Error(
          `Invalid Type: "${shipType}" doesn't conform to "ShipType".`
        );
      if (!isOccupiedCoordinatesSet(OccupiedCoordinatesSet))
        throw new Error(
          `Invalid Type: "${OccupiedCoordinatesSet}" doesn't conform to "OccupiedCoordinatesSet".`
        );
    };

    const [x, y]: Coordinates = coordinates;
    const coordinateSetMemberKey: OccupiedCoordinatesSetMemberKey = `[${x}, ${y}]`;

    for (const [shipType, occupiedCoordinatesSet] of Object.entries(this.fleetCoordinates)) {
      if (!isShipType(shipType)) throw new Error('');
      if (!isOccupiedCoordinatesSet(occupiedCoordinatesSet)) throw new Error();

      validateTypes(shipType, occupiedCoordinatesSet);

      if (occupiedCoordinatesSet?.has(coordinateSetMemberKey)) {
        return {
          shipType,
          occupiedCoordinatesSet
        }
      }
    }
  }

  public isShipPlaced(shipType: ShipType): boolean {
    return this.fleetCoordinates[shipType] !== null;
  }

  public nullifyShipCoordinatesValue(shipType: ShipType): void {
    this.fleetCoordinates[shipType] = null;
  }

  public nullifyShipValidRotationalParams(shipType: ShipType): void {
    this.inBoundRotationalPlacePieceForFleet[shipType] = null;
  }
  
  public setShipValidRotationalParams(
    ship: BattleshipBuilder,
    validRotatedPlacePieceParams: RotationalPositionMap
  ): void {
    if (!this._inBoundRotationalPlacePieceParamsForFleet[ship.type])
      this._inBoundRotationalPlacePieceParamsForFleet[ship.type] =
        validRotatedPlacePieceParams;
  }
}