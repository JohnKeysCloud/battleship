import { BattleshipBuilder } from "../bs-ship-builder/bs-ship-builder";
import {
  Coordinates,
  CoordinatesArray,
  CoordinatesSet,
  CoordinatesSetMemberKey,
  FleetCoordinates,
  FleetValidRotationalParams,
  ShipType,
  ValidRotationalPositionMap
} from "../../types/logic-types";
import { isCoordinatesSet, isFleetCoordinates, isShipType } from "../../utilities/logic-utilities";

export class BattleshipBoardRepository {
  private readonly _fleetCoordinates: FleetCoordinates = {};
  private readonly _fleetValidRotationalParams: FleetValidRotationalParams = {};

  // 💭 --------------------------------------------------------------

  public get fleetCoordinates(): FleetCoordinates {
    return this._fleetCoordinates;
  }
  public get fleetValidRotationalParams(): FleetValidRotationalParams {
    return this._fleetValidRotationalParams;
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
      const setMemberTemplate: CoordinatesSetMemberKey = `[${x}, ${y}]`;
      this.fleetCoordinates[shipType]!.add(setMemberTemplate);
    });
  }
  public getShipDataAt(coordinates: Coordinates) {
    if (!isFleetCoordinates(this.fleetCoordinates)) {
      throw new Error(
        `Invalid Type: "${this.fleetCoordinates}" doesn't conform to "FleetCoordinates".`
      );
    }

    const validateTypes = (shipType: unknown, coordinatesSet: unknown) => {
      if (!isShipType(shipType))
        throw new Error(
          `Invalid Type: "${shipType}" doesn't conform to "ShipType".`
        );
      if (!isCoordinatesSet(coordinatesSet))
        throw new Error(
          `Invalid Type: "${coordinatesSet}" doesn't conform to "CoordinatesSet".`
        );
    };

    const [x, y]: Coordinates = coordinates;
    const coordinateSetMemberKey: CoordinatesSetMemberKey = `[${x}, ${y}]`;

    for (const shipType in this.fleetCoordinates) {
      validateTypes(shipType, this.fleetCoordinates[shipType]);

      const shipCoordinateSet: CoordinatesSet = this.fleetCoordinates[shipType];

      if (shipCoordinateSet!.has(coordinateSetMemberKey)) {
        return {
          shipType,
          shipCoordinateSet,
        };
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
    this.fleetValidRotationalParams[shipType] = null;
  }
  public setShipValidRotationalParams(
    ship: BattleshipBuilder,
    validRotatedPlacePieceParams: ValidRotationalPositionMap
  ): void {
    if (!this._fleetValidRotationalParams[ship.type])
      this._fleetValidRotationalParams[ship.type] =
        validRotatedPlacePieceParams;
  }
}