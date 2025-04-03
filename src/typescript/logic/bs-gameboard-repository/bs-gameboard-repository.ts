import { BattleshipBuilder } from "../bs-ship-builder/bs-ship-builder";
import {
  Coordinates,
  CoordinatesArray,
  CoordinatesToString,
  FleetCoordinates,
  InBoundRotationalPlacePieceParamsForFleet,
  ShipType,
  RotationalPositionMap
} from "../../types/logic-types";

export class BattleshipBoardRepository {
  readonly #fleetCoordinates: FleetCoordinates = {};
  readonly #inBoundRotationalPlacePieceParamsForFleet: InBoundRotationalPlacePieceParamsForFleet =
    {};
  readonly #attackedCoordinates: Set<CoordinatesToString> = new Set();
  readonly #sunkShips: Set<ShipType> = new Set();

  // 💭 --------------------------------------------------------------

  public get fleetCoordinates(): FleetCoordinates {
    return this.#fleetCoordinates;
  }

  public get inBoundRotationalPlacePieceForFleet(): InBoundRotationalPlacePieceParamsForFleet {
    console.log(this.#inBoundRotationalPlacePieceParamsForFleet);
    return this.#inBoundRotationalPlacePieceParamsForFleet;
  }

  public addAttackedCoordinates(coordinates: Coordinates): void {
    this.#attackedCoordinates.add(`[${coordinates[0]}, ${coordinates[1]}]`);
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
      const setMemberTemplate: CoordinatesToString = `[${x}, ${y}]`;
      this.fleetCoordinates[shipType]!.add(setMemberTemplate);
    });
  }

  public addSunkenShip(shipType: ShipType) {
    this.#sunkShips.add(shipType);
  }

  public areAllShipsSunk(): boolean {
    return this.#sunkShips.size === Object.keys(this.fleetCoordinates).length;
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
    if (!this.#inBoundRotationalPlacePieceParamsForFleet[ship.type])
      this.#inBoundRotationalPlacePieceParamsForFleet[ship.type] =
        validRotatedPlacePieceParams;
  }

  public hasTargetBeenAttacked(coordinates: Coordinates): boolean {
    return this.#attackedCoordinates.has(
      `[${coordinates[0]}, ${coordinates[1]}]`
    );
  }
}