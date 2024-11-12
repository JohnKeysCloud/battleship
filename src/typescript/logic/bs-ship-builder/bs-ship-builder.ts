import {
  IPlacementConfigurations,
  IRotationalPivotConfigurations,
  IShipOptions,
  ShipLength,
  ShipSymbols,
  ShipSymbolValue,
  ShipType,
  SizeLookupKey,
  Version
} from '../../types/logic-types';

export const SHIP_SYMBOLS: ShipSymbols = {
  [ShipType.Carrier]: Symbol('CA'),
  [ShipType.Battleship]: Symbol('BS'),
  [ShipType.Cruiser]: Symbol('CR'),
  [ShipType.Submarine]: Symbol('SB'),
  [ShipType.Destroyer]: Symbol('DD'),
  [ShipType.PatrolBoat]: Symbol('PB')
} as const;

const sizeLookup: Record<SizeLookupKey, ShipLength | undefined> = {
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

export class BattleshipBuilder implements IShipOptions {
  public readonly length: ShipLength;
  public readonly seaworthy: boolean = true;
  public readonly symbol: ShipSymbolValue;
  public rotationalPivotConfigurations: IRotationalPivotConfigurations = {
    currentAngleOfRotation: null,
    coordinatesArray: null,
    orientation: null
  };
  public currentplacementConfigurations: IPlacementConfigurations = {
    coordinatesArray: null,
    orientation: null
  };
  public isPlaced = (): boolean => this.currentplacementConfigurations.coordinatesArray !== null;
  private _hitCounter: number = 0;

  constructor(public readonly type: ShipType, public readonly version: Version = 2002) {
    this.symbol = SHIP_SYMBOLS[type];

    const key: SizeLookupKey = `${type}-${version}`;
    const length: ShipLength | undefined = sizeLookup[key]; // Access using the typed key
    if (length === undefined) {
      throw new Error(`Invalid ship type/version combination: ${key}`);
    }

    this.length = length;
  }

  public hit = (): string => {
    if (!this.isSeaworthy()) return 'This ship has already perished.';
    
    this._hitCounter++;
    return `Hit registered. Hit count: ${this.hitCounter}.`; // Return the updated hit counter
  };

  isSeaworthy = (): boolean => this.hitCounter < this.length;

  public resetConfigurations = (shouldResetShipRotationalData: boolean) => {
    const placementConfigurations = { coordinatesArray: null, orientation: null };

    this.currentplacementConfigurations = placementConfigurations;

    if (shouldResetShipRotationalData === true) {
      this.rotationalPivotConfigurations = {
        ...placementConfigurations,
        currentAngleOfRotation: null
      };
    }
  };

  public get hitCounter(): number {
    return this._hitCounter;
  }
}