import { BattleshipFactory } from '../bs-ship-factory/bs-ship-factory';
import type { Version } from '../bs-ship-factory/bs-ship-factory';

const shipTypes = [
  'carrier',
  'battleship',
  'destroyer',
  'submarine',
  'cruiser',
  'patrolBoat',
] as const;

type ShipType = (typeof shipTypes)[number];

type Fleet = {
  [key in ShipType]?: BattleshipFactory;
};

/* 
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ // > The above is achieves the same as:                                 │
  │ // type Fleet = {                                                       │
  │ //   [shipType in                                                       │
  │ //     | 'carrier'                                                      │
  │ //     | 'battleship'                                                   │
  │ //     | 'destroyer'                                                    │
  │ //     | 'submarine'                                                    │
  │ //     | 'cruiser'                                                      │
  │ //     | 'patrolBoat']?: BattleshipFactory;                             │
  │ // };                                                                   │
  └─────────────────────────────────────────────────────────────────────────┘
 */

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
        carrier: { type: 'carrier' },
        battleship: { type: 'battleship' },
        destroyer: { type: 'destroyer' },
        submarine: { type: 'submarine' },
        patrolBoat: { type: 'patrolBoat' },
      })
    );
  }

  static createMBFleet(): BattleshipFleetFactory {
    return new BattleshipFleetFactory(
      this.createFleet({
        carrier: { type: 'carrier', version: 1990 },
        battleship: { type: 'battleship', version: 1990 },
        cruiser: { type: 'cruiser', version: 1990 },
        submarine: { type: 'submarine', version: 1990 },
        destroyer: { type: 'destroyer', version: 1990 },
      })
    );
  }

  // Method to get a specific ship
  getShip(
    shipType:
      | 'carrier'
      | 'battleship'
      | 'destroyer'
      | 'submarine'
      | 'cruiser'
      | 'patrolBoat'
  ): BattleshipFactory | undefined {
    return this.fleet[shipType];
  }
}

export { BattleshipFleetFactory };
