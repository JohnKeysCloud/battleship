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

const { playerOneBoardController, playerTwoBoardController } =
  createBattleshipControllerSet(
    { playerOneBoardBuilder, playerTwoBoardBuilder },
    { playerOneBoardRepository, playerTwoBoardRepository }
  );

const { playerOneFleetBuilder, playerTwoFleetBuilder } = createBattleshipFleetBuilderSet();

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