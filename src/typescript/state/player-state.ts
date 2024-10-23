import { PlayerState } from "../types/state-types";
import { createBattleshipBoardSet } from "../utilities/logic-utilities";
import { createBattleshipFleets } from "../utilities/logic-utilities";

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