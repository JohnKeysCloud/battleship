const versionYears = [
  1990,
  2002
] as const;

// Union type of 1990 | 2002
export type Version = (typeof versionYears)[number];

export interface ShipOptions {
  type: string;
  size: number;
  seaworthy: boolean;
  hitCounter?: number;
  version?: Version;
}

export class BattleshipFactory implements ShipOptions {
  public size: number;
  public seaworthy: boolean = true;
  public hitCounter: number = 0;

  private static sizeLookup: { [key: string]: number } = {
    'battleship-1990': 4,
    'battleship-2002': 4,
    'carrier-1990': 5,
    'carrier-2002': 5,
    'cruiser-1990': 3,
    'destroyer-1990': 2,
    'destroyer-2002': 3,
    'patrolBoat-2002': 2,
    'submarine-1990': 3,
    'submarine-2002': 3,
  };

  constructor(
    public type:
      | 'carrier'
      | 'battleship'
      | 'destroyer'
      | 'submarine'
      | 'patrolBoat'
      | 'cruiser',
    public version: Version = 2002
  ) {
    const key = `${type}-${version}`;
    this.size = BattleshipFactory.sizeLookup[key];

    if (!this.size) {
      throw new Error('Invalid Battleship type');
    }
  }

  hit = () => this.hitCounter++;
  isSeaworthy = () => (this.seaworthy = this.hitCounter <= this.size);
}