import { BattleshipFactory, ShipType } from '../bs-ship-factory/bs-ship-factory';
import type { Version } from '../bs-ship-factory/bs-ship-factory';

type Fleet = {
  [key in ShipType]?: BattleshipFactory;
};

type ShipConfig = {
  type: ShipType;
  version?: Version;
};

type ShipConfigs = {
  [key in ShipType]?: ShipConfig;
};

class BattleshipFleetFactory {
  private fleet: Fleet;

  private constructor(fleet: Fleet) {
    this.fleet = fleet;
  }

  // Helper method to create fleet
  private static createFleet(shipConfiigs: ShipConfigs): Fleet {
    const fleet: Fleet = {};

    for (const [shipType, config] of Object.entries(shipConfiigs)) {
      fleet[shipType as ShipType] = new BattleshipFactory(
        config.type,
        config.version
      );
    }

    return fleet;
  }

  static createHasbroFleet(): BattleshipFleetFactory {
    return new BattleshipFleetFactory(
      this.createFleet({
        carrier: { type: ShipType.Carrier },
        battleship: { type: ShipType.Battleship },
        destroyer: { type: ShipType.Destroyer },
        submarine: { type: ShipType.Submarine },
        patrolBoat: { type: ShipType.PatrolBoat },
      })
    );
  }

  static createMBFleet(): BattleshipFleetFactory {
    return new BattleshipFleetFactory(
      this.createFleet({
        carrier: { type: ShipType.Carrier, version: 1990 },
        battleship: { type: ShipType.Battleship, version: 1990 },
        cruiser: { type: ShipType.Cruiser, version: 1990 },
        submarine: {type: ShipType.Submarine, version: 1990 },
        destroyer: { type: ShipType.Destroyer, version: 1990 },
      })
    );
  }

  // Method to get a specific ship
  getShip(shipType: ShipType): BattleshipFactory | undefined {
    return this.fleet[shipType];
  }
}

export { BattleshipFleetFactory };
