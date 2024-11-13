import { PlayerState } from "../types/state-types";
import { createBattleshipBoardSet } from "../utilities/logic-utilities";
import { createBattleshipFleets } from "../utilities/logic-utilities";
import { createBattleshipControllerSet } from "../utilities/logic-utilities";

const battleShipGameboards = createBattleshipBoardSet();
const battleShipFleets = createBattleshipFleets();
const { playerOneBoardController, playerTwoBoardController } = createBattleshipControllerSet(battleShipGameboards.playerOne, battleShipGameboards.playerTwo);

const playerOne: PlayerState = {
  gameboardBuilder: battleShipGameboards.playerOne,
  gameboardController: playerOneBoardController, 
  fleet: battleShipFleets.playerOne.fleet,
};

const playerTwo: PlayerState = {
  gameboardBuilder: battleShipGameboards.playerTwo,
  gameboardController: playerTwoBoardController,
  fleet: battleShipFleets.playerTwo.fleet,
};

export const players = {
  playerOne,
  playerTwo
};