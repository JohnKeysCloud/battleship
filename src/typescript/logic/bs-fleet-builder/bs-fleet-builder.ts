import {
  BattleshipBuilder,
} from '../bs-ship-builder/bs-ship-builder';
import { ShipType, Version, Fleet, FleetConfigs } from '../types/logic-types';

export class BattleshipFleetBuilder {
  private constructor(private readonly fleet: Fleet) {
    this.fleet = fleet;
  }

  private static createFleet(fleetConfigs: FleetConfigs): Fleet {
    const fleet: Fleet = {};
    const isShipType = (key: string): key is ShipType => {
      return Object.values(ShipType).includes(key as ShipType);
    };

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
      this.createFleet({
        carrier: { type: ShipType.Carrier },
        battleship: { type: ShipType.Battleship },
        destroyer: { type: ShipType.Destroyer },
        submarine: { type: ShipType.Submarine },
        patrolBoat: { type: ShipType.PatrolBoat },
      })
    );
  }

  public static createMBFleet(): BattleshipFleetBuilder {
    // 1990
    return new BattleshipFleetBuilder(
      this.createFleet({
        carrier: { type: ShipType.Carrier, version: 1990 },
        battleship: { type: ShipType.Battleship, version: 1990 },
        cruiser: { type: ShipType.Cruiser, version: 1990 },
        submarine: { type: ShipType.Submarine, version: 1990 },
        destroyer: { type: ShipType.Destroyer, version: 1990 },
      })
    );
  }

  getShip(shipType: ShipType): BattleshipBuilder {
    const ship = this.fleet[shipType];

    if (!ship) {
      throw new Error(`Ship of type ${shipType} not found in fleet.`);
    }

    return ship;
  }
}

export function createBattleshipFleets(version: Version = 2002) {
  const fleet =
    version === 2002
      ? BattleshipFleetBuilder.createHasbroFleet
      : BattleshipFleetBuilder.createMBFleet;

  return {
    playerOne: fleet(),
    playerTwo: fleet(),
  };
}