import {
  IShipOptions,
  ShipType,
  SizeLookupKey,
  Version
} from "../bs-types"

// Use Record for size lookup with known keys
const sizeLookup: Record<SizeLookupKey, number | undefined> = {
  'battleship-1990': 4,
  'battleship-2002': 4,
  'carrier-1990': 5,
  'carrier-2002': 5,
  'cruiser-1990': 3,
  'cruiser-2002': undefined, // Explicitly mark missing values
  'destroyer-1990': 2,
  'destroyer-2002': 3,
  'patrolBoat-1990': undefined,
  'patrolBoat-2002': 2,
  'submarine-1990': 3,
  'submarine-2002': 3,
};

export class BattleshipFactory implements IShipOptions {
  public size: number;
  public seaworthy: boolean = true;
  public hitCounter: number = 0;

  constructor(public type: ShipType, public version: Version = 2002) {
    const key: SizeLookupKey = `${type}-${version}`;

    const size = sizeLookup[key]; // Access using the typed key
    if (size === undefined) {
      throw new Error(`Invalid ship type/version combination: ${key}`);
    }

    this.size = size;
  }

  hit = (): string => {
    if (!this.isSeaworthy()) return 'This ship has perished.';
    this.hitCounter++;

    return `Hit registered. Hit count: ${this.hitCounter}.`; // Return the updated hit counter
  };

  isSeaworthy = (): boolean => this.hitCounter < this.size;

  public get shipType(): ShipType {
    return this.type;
  }

  public get versionYear(): Version {
    return this.version;
  }
}