export interface ShipOptions {
  type: string;
  size: number;
  seaworthy: boolean;
  hitCounter?: number;
}

export class BattleshipFactory implements ShipOptions {
  public size: number;

  constructor(
    public type:
      'carrier' |
      'battleship' |
      'destroyer' |
      'submarine' |
      'patrolBoat',
    public seaworthy: boolean = true,
    public hitCounter: number = 0,
  ) {
    switch (type) {
      case 'carrier':
        this.size = 5;
        break;
      case 'battleship':
        this.size = 4;
        break;
      case 'destroyer':
      case 'submarine':
        this.size = 3;
        break;
      case 'patrolBoat':
        this.size = 2;
        break;
      default:
        throw new Error('Invalid Battleship type')
    }

    this.hitCounter = Math.max(0, hitCounter);
  }

  hit = () => this.hitCounter++;
  isSeaworthy = () => this.seaworthy = this.hitCounter <= this.size;
}