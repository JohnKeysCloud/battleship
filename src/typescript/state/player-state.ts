import { PlayerState } from "../types/state-types";
import {
  createBattleshipBoardBuilderSet,
  createBattleshipControllerSet,
  createBattleshipFleets
} from "../utilities/logic-utilities";

const {
  playerOne: playerOneGameboardBuilder,
  playerTwo: playerTwoGameboardBuilder
} = createBattleshipBoardBuilderSet();


const { 
  playerOne: playerOneFleetBuilder,
  playerTwo: playerTwoFleetBuilder
} = createBattleshipFleets();

const {
  playerOneBoardController,
  playerTwoBoardController
} =
  createBattleshipControllerSet(
    playerOneGameboardBuilder,
    playerTwoGameboardBuilder
  );

const playerOne: PlayerState = {
  gameboardBuilder: playerOneGameboardBuilder,
  gameboardController: playerOneBoardController,
  fleetBuilder: playerOneFleetBuilder,
};

const playerTwo: PlayerState = {
  gameboardBuilder: playerTwoGameboardBuilder,
  gameboardController: playerTwoBoardController,
  fleetBuilder: playerTwoFleetBuilder,
};

export const players = {
  playerOne,
  playerTwo
};