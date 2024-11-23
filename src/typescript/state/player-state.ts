import { PlayerState } from "../types/state-types";
import {
  createBattleshipBoardBuilderSet,
  createBattleshipBoardRepositorySet,
  createBattleshipControllerSet,
  createBattleshipFleetBuilderSet,
} from "../utilities/logic-utilities";

const { playerOneBoardBuilder, playerTwoBoardBuilder } =
  createBattleshipBoardBuilderSet();

const { playerOneBoardRepository, playerTwoBoardRepository } =
  createBattleshipBoardRepositorySet();

const { playerOneFleetBuilder, playerTwoFleetBuilder } =
    createBattleshipFleetBuilderSet();

const { playerOneBoardController, playerTwoBoardController } =
  createBattleshipControllerSet(
    { playerOneBoardBuilder, playerTwoBoardBuilder },
    { playerOneBoardRepository, playerTwoBoardRepository },
    { playerOneFleetBuilder, playerTwoFleetBuilder }
  );

const playerOne: PlayerState = {
  gameboardBuilder: playerOneBoardBuilder,
  gameboardController: playerOneBoardController,
  gameboardRepository: playerOneBoardRepository,
  fleetBuilder: playerOneFleetBuilder,
};

const playerTwo: PlayerState = {
  gameboardBuilder: playerTwoBoardBuilder,
  gameboardController: playerTwoBoardController,
  gameboardRepository: playerTwoBoardRepository,
  fleetBuilder: playerTwoFleetBuilder,
};

export const players = {
  playerOne,
  playerTwo
};