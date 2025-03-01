import {
  Fleet,
  FleetConfigs,
  ShipType,
  FleetVersion,
} from '../../types/logic-types';
import {
  BattleshipBuilder,
} from '../bs-ship-builder/bs-ship-builder';
import { isShipType } from '../../types/type-guards';

export class BattleshipFleetBuilder {
  private constructor(public readonly fleet: Fleet, public readonly version: FleetVersion) {}

  private static createFleet(fleetConfigs: FleetConfigs): Fleet {
    const fleet: Fleet = {};

    for (const [shipType, config] of Object.entries(fleetConfigs)) {
      if (config && isShipType(shipType)) {
        fleet[shipType] = new BattleshipBuilder(config.type, config.version);
      }
    }

    return fleet;
  }

  public static createHasbroFleet(): BattleshipFleetBuilder {
    // 2002
    return new BattleshipFleetBuilder(
      BattleshipFleetBuilder.createFleet({
        carrier: { type: ShipType.Carrier, version: 2002 },
        battleship: { type: ShipType.Battleship, version: 2002 },
        destroyer: { type: ShipType.Destroyer, version: 2002 },
        submarine: { type: ShipType.Submarine, version: 2002 },
        patrolBoat: { type: ShipType.PatrolBoat, version: 2002 },
      }),
      2002
    );
  }

  public static createMBFleet(): BattleshipFleetBuilder {
    // 1990
    return new BattleshipFleetBuilder(
      BattleshipFleetBuilder.createFleet({
        carrier: { type: ShipType.Carrier, version: 1990 },
        battleship: { type: ShipType.Battleship, version: 1990 },
        cruiser: { type: ShipType.Cruiser, version: 1990 },
        submarine: { type: ShipType.Submarine, version: 1990 },
        destroyer: { type: ShipType.Destroyer, version: 1990 },
      }),
      1990
    );
  }

  getShip(shipType: ShipType): BattleshipBuilder {
    const ship = this.fleet[shipType];

    if (!ship) {
      throw new Error(
        `Invalid Command: Ship of type ${shipType} not found in fleet.`
      );
    }

    return ship;
  }
}