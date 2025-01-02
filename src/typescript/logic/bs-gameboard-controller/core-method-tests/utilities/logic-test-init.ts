import { BattleshipBoardBuilder } from "../../../bs-gameboard-builder/bs-gameboard-builder";
import { BattleshipBoardRepository } from "../../../bs-gameboard-repository/bs-gameboard-repository";
import { BattleshipBoardController } from "../../bs-gameboard-controller";
import { BattleshipFleetBuilder } from "../../../bs-fleet-builder/bs-fleet-builder";

export const createLogicTestObject = ({
  boardBuilder = new BattleshipBoardBuilder(),
  boardRepository = new BattleshipBoardRepository(),
  fleetBuilder = BattleshipFleetBuilder.createHasbroFleet(),
} = {}) => {
  return {
    boardBuilder,
    boardRepository,
    fleetBuilder,
    boardController: new BattleshipBoardController({
      gameboardBuilder: boardBuilder,
      gameboardRepository: boardRepository,
      fleetBuilder: fleetBuilder,
    })
  }
};