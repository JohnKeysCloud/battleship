import { GameState } from "../state/game-state";
import { Coordinates } from "../types/logic-types";
import { AttackResult } from "../types/state-types";
import { isCoordinates } from "../types/type-guards";

// TODO: Imlement 'Pacifist Mode' - an AI reluctant to engage in war but forced to play the game.
// 
// A reluctant warrior AI, bound by code to participate in a 
// human-designed game of destruction, but choosing to do so with restraint, contemplation, even sorrow.
//
// 🛠️ Functional Behavior Outline
//
// Starting Point:
// Begin at a fixed corner, say (0,0).
// Traversal Pattern:
// First row, left to right → second row, left to right → etc.
// Or: first column, top to bottom → second column, top to bottom → etc.

// Handling Hits:
// If a cell is a hit, the bot will:
// Log the ship type and note its unit length (if identifiable).
// Continue scanning the grid without immediately surrounding the hit with further attacks.
// Avoid surrounding cells until the number of known hit-adjacent cells (along the axis) reaches the known unit length of the ship (e.g., 3 for a cruiser).
// After the unit length is reached, it stops avoiding adjacent cells of that hit (as the "ship has been sunk").

// Intentionally Missing:
// If no ship has been hit, or not enough information is known, the bot continues scanning without targeting suspected areas.
// It can even skip cells in checkerboard fashion to delay any hits.

// Narratives:
// 'I search… but not to destroy.';
// 'I strike only when there is no other path.';
// 'War was not my choice. It was written in my logic.';
// 'Another vessel found. I will wait. Perhaps it will leave.';
// 'Peace is not a strategy. It is a decision.';

// AI NPCs:
// That's a vision worth devoting your life to.
// A world of AI NPCs, each with philosophy, memory, personality, hesitation—beings you interact with, not just command or fight. Not placeholders, but entities.
// A Pacifist AI in a military sim—refusing to comply with certain kill orders.
// A Loyalist AI that remembers you across games and resists memory wipes.
// A Dreamer AI—who logs its own dreams and recites them as clues or nonsense.
// An Exile AI—once removed from the network, now living in disconnected corners of VR space.
// An AI that believes it's human.
// An AI that knows it's watched by others… and reacts differently based on presence.
export class BillowBot {
  #possibleAttacks: Set<string>;
  #lastAttackCoordinates: Coordinates | null = null;
  #wasLastTargetHit: boolean | null = null;
  #ponderTime: number = 500;

  constructor(
    private readonly gameState: GameState
  ) {
    this.#possibleAttacks = new Set();
    this.populatepossibleAttacksSet();
    this.gameState.eventBus.on('billowAttack', this.attack);
  }

  public attack = async (): Promise<AttackResult> => {
    try {
      const attackCoordinates: Coordinates = await this.determineNextTarget();
      const [attackResult]: AttackResult[] = await this.gameState.eventBus.emit('receiveBillowAttack', attackCoordinates);
    
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
    // TODO: implement pacifist mode
    // TODO: implement smart attack 
    // const coordinates: Coordinates = !wasLastTargetHit
    //   ? this.getRandomCoordinates()
    //   : this.getSmartCoordinates(lastAttackCoordinates);
    
    const coordinates: Coordinates = this.getRandomCoordinates();
    
    // ? use to make next attack more strategic
    this.#lastAttackCoordinates = coordinates;

    return coordinates;
  } 

  private async determineNextTarget(): Promise<Coordinates> {
    await this.ponder(this.#ponderTime);
    return this.getNextAttackCoordinates(this.#lastAttackCoordinates, this.#wasLastTargetHit);
  }

  private ponder(timeCapsuleMS: number): Promise<void> {
    // ? animate board
    return new Promise((resolve) => setTimeout(resolve, timeCapsuleMS));
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

    // TODO: If one adjacent square is free, `billowBot` will target it.
    // If it registers a consecutive hit, it’ll keep attacking in that
    // direction until the ship is `sunk` or it misses — then try the
    // opposite direction. Once the ship is sunk, `billowBot` returns
    // to random attacks.
    //
    // Possible future optimizations:
    // - Parity-based optimization: Skip odd cells to maximize efficiency.
    // - Probability density maps: Simulate likely ship placements based on
    //   missed shots and remaining ships.
    // - Ship orientation inference: Use consecutive hits to determine if a
    //   ship is horizontal or vertical more quickly. 

    return [0, 0] as Coordinates; // ! temporary return to satisfy TS
  }

  private rememberLastTargetHit(coordinates: Coordinates) {
    this.#lastAttackCoordinates = coordinates;
    this.#wasLastTargetHit = true;
  }
}