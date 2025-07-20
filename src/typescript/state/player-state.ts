import { BattleshipFleetBuilder } from "../logic/bs-fleet-builder/bs-fleet-builder";
import { BattleshipBoardBuilder } from "../logic/bs-gameboard-builder/bs-gameboard-builder";
import { BattleshipBoardController } from "../logic/bs-gameboard-controller/bs-gameboard-controller";
import { BattleshipBoardRepository } from "../logic/bs-gameboard-repository/bs-gameboard-repository";
import { FleetVersion } from "../types/logic-types";
import { PlayerContext, PlayerCore } from "../types/state-types";

export const createPlayerContext = (fleetVersion: FleetVersion) => { 
  const gameboardBuilder = new BattleshipBoardBuilder();
  const gameboardRepository = new BattleshipBoardRepository();

  let fleetBuilder: BattleshipFleetBuilder;
  switch (fleetVersion) {
    case 1990:
      fleetBuilder = BattleshipFleetBuilder.createMBFleet();
      break;
    case 2002:
      fleetBuilder = BattleshipFleetBuilder.createHasbroFleet();
      break;
    default:
      throw new Error(`There was no Battleship version created in ${fleetVersion}.`);
  }

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

export const initalizePlayerCore = (fleetVersion: FleetVersion): PlayerCore => {
  const playerContext = createPlayerContext(fleetVersion);
  const opponentContext = createPlayerContext(fleetVersion);

  return {
    player: playerContext,
    opponent: opponentContext,
  }
}