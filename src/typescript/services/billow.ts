import { Coordinates } from "../types/logic-types";
import { isCoordinates } from "../types/type-guards";

export class BillowBot {
  // ? use to create a more polished AI
  public readonly firstAttackCoordinates: Coordinates;

  #lastAttackCoordinates: Coordinates | null = null;
  #possibleAttacks: Set<string>;

  constructor() {
    this.#possibleAttacks = new Set();
    this.populatepossibleAttacksSet();
    this.firstAttackCoordinates = this.getRandomCoordinates();
  }

  public attack(coordinates: Coordinates): void {
    const attackCoordinates: Coordinates = this.getNextAttackCoordinates();

    // ! emit receive attack event (from player gameboard component)
    // this.receiveAttack(attackCoordinates);

  }

  public getNextAttackCoordinates(): Coordinates {
    let coordinates: Coordinates = this.getRandomCoordinates();

    // ? use to make next attack more strategic
    this.#lastAttackCoordinates = coordinates;

    return coordinates;
  }

  private populatepossibleAttacksSet() {
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        this.#possibleAttacks.add(`${x},${y}`);
      }
    }
  }

  private getRandomCoordinates(): Coordinates {
    const coordinatesString: string = Array.from(this.#possibleAttacks)[Math.floor(Math.random() * this.#possibleAttacks.size)];
    this.#possibleAttacks.delete(coordinatesString);

    const coordinates: number[] = coordinatesString.split(',').map(Number);

    if (!isCoordinates(coordinates)) throw new Error('Invalid coordinates');

    return coordinates;
  }
}