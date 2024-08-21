interface ShipOptions {
  length: number;
  hitCounter: number;
  seaworthy: boolean;
}

export class ShipFactory implements ShipOptions {
  constructor (
    public length: number,
    public hitCounter: number = 0,
    public seaworthy: boolean = true,
  ) {
    if (length <= 0) {
      throw new Error('Ship length must be greater than zero');
    }
    this.hitCounter = Math.max(0, hitCounter);
  }

  hit = () => this.hitCounter++;

  isSeaworthy = () => this.seaworthy = this.hitCounter <= this.length;
} 