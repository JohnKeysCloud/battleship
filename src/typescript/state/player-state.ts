import { PlayerState } from "../types/state-types";
import { createBattleshipBoardSet } from "../logic/bs-gameboard-builder/bs-gameboard-builder";
import { createBattleshipFleets } from "../logic/bs-fleet-builder/bs-fleet-builder";

const battleShipGameboards = createBattleshipBoardSet();
const battleShipFleets = createBattleshipFleets();

const playerOne: PlayerState = {
  gameboardInstance: battleShipGameboards.playerOne,
  fleet: battleShipFleets.playerOne.fleet,
};

const playerTwo: PlayerState = {
  gameboardInstance: battleShipGameboards.playerTwo,
  fleet: battleShipFleets.playerTwo.fleet,
};

export const players = {
  playerOne,
  playerTwo
};