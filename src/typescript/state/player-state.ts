import { BattleshipFleetBuilder } from "../logic/bs-fleet-builder/bs-fleet-builder";
import { BattleshipBoardBuilder } from "../logic/bs-gameboard-builder/bs-gameboard-builder";
import { BattleshipBoardController } from "../logic/bs-gameboard-controller/bs-gameboard-controller";
import { BattleshipBoardRepository } from "../logic/bs-gameboard-repository/bs-gameboard-repository";
import { FleetVersion } from "../types/logic-types";
import { PlayerContext, PlayerCore } from "../types/state-types";

export const createPlayerContext = (fleetVersion: FleetVersion = 1990) => { 
  const gameboardBuilder = new BattleshipBoardBuilder();
  const gameboardRepository = new BattleshipBoardRepository();
  const fleetBuilder = fleetVersion === 1990
    ? BattleshipFleetBuilder.createMBFleet()
    : BattleshipFleetBuilder.createHasbroFleet();
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

export const initalizePlayerCore = (): PlayerCore => {
  const playerContext = createPlayerContext();
  const opponentContext = createPlayerContext();

  return {
    player: playerContext,
    opponent: opponentContext,
  }
}

const player: PlayerContext = createPlayerContext();
const opponent: PlayerContext = createPlayerContext();

export const players: { player: PlayerContext; opponent: PlayerContext } = {
  player,
  opponent,
};