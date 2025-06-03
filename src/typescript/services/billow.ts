import { GameState } from "../state/game-state";
import { Coordinates } from "../types/logic-types";
import { AttackResult } from "../types/state-types";
import { isCoordinates } from "../types/type-guards";

export class BillowBot {
  #possibleAttacks: Set<string>;
  #lastAttackCoordinates: Coordinates | null = null;
  #wasLastTargetHit: boolean | null = null;

  constructor(
    private readonly gameState: GameState
  ) {
    this.#possibleAttacks = new Set();
    this.populatepossibleAttacksSet();
  }

  public attack = async (): Promise<AttackResult> => {
    try {
      const attackCoordinates: Coordinates = await this.determineNextTarget();

      console.log('attackCoordinates', attackCoordinates);

      const [attackResult]: AttackResult[] = await this.gameState.eventBus.emit('billowAttack', attackCoordinates);
    
      if (attackResult.hit) {
        this.rememberLastTargetHit(attackCoordinates);
      }

      return attackResult;
    } catch (error) {
      console.error('Error in BillowBot.attack:', error);
      throw error;
    }
  }

  public getNextAttackCoordinates(
    lastAttackCoordinates: Coordinates | null,
    wasLastTargetHit: boolean | null
  ): Coordinates {
    const coordinates: Coordinates = true // !wasLastTargetHit
      ? this.getRandomCoordinates()
      : this.getSmartCoordinates(lastAttackCoordinates);
    
    // ? use to make next attack more strategic
    this.#lastAttackCoordinates = coordinates;

    return coordinates;
  } 

  private async determineNextTarget(): Promise<Coordinates> {
    await this.ponder();
    return this.getNextAttackCoordinates(this.#lastAttackCoordinates, this.#wasLastTargetHit);
  }

  private ponder(): Promise<void> {
    // ? animate board
    return new Promise((resolve) => setTimeout(resolve, 3000));
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

  private getSmartCoordinates(lastAttackCoordinates: Coordinates | null): Coordinates {
    if (!lastAttackCoordinates)
      throw new Error('Last attack coordinates are required');

    const [lastAttackX, lastAttackY]: Coordinates = lastAttackCoordinates;

    // find first unattacked adjacent cell
    const adjacentCells: Coordinates[] = [
      [lastAttackX + 1, lastAttackY],
      [lastAttackX - 1, lastAttackY],
      [lastAttackX, lastAttackY + 1],
      [lastAttackX, lastAttackY - 1],
    ];

    // ...

    return [0, 0] as Coordinates; // ! temporary return
  }

  private rememberLastTargetHit(coordinates: Coordinates) {
    this.#lastAttackCoordinates = coordinates;
    this.#wasLastTargetHit = true;
  }
}