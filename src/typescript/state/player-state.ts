import { BattleshipFleetBuilder } from "../logic/bs-fleet-builder/bs-fleet-builder";
import { BattleshipBoardBuilder } from "../logic/bs-gameboard-builder/bs-gameboard-builder";
import { BattleshipBoardController } from "../logic/bs-gameboard-controller/bs-gameboard-controller";
import { BattleshipBoardRepository } from "../logic/bs-gameboard-repository/bs-gameboard-repository";
import { FleetVersion } from "../types/logic-types";
import { PlayerState } from "../types/state-types";

// TODO: add params here that determine if player or bot, adjust return object accordingly
// Player State Factory 😉
export const createPlayerStateObject = (fleetVersion: FleetVersion = 2002) => { 
  const gameboardBuilder = new BattleshipBoardBuilder();
  const gameboardRepository = new BattleshipBoardRepository();
  const fleetBuilder = fleetVersion === 2002
    ? BattleshipFleetBuilder.createHasbroFleet()
    : BattleshipFleetBuilder.createMBFleet();
  const gameboardController = new BattleshipBoardController({
    gameboardBuilder,
    gameboardRepository,
    fleetBuilder
  });

  return {
    gameboardBuilder,
    gameboardRepository,
    fleetBuilder,
    gameboardController,
  }
}

const playerOne: PlayerState = createPlayerStateObject();
const playerTwo: PlayerState = createPlayerStateObject();

export const players = {
  playerOne,
  playerTwo
};