import { randomizeBSGameboard } from "../../setup/randomize-bs-gameboard";
import { PlayerCore } from "../../types/state-types";

export const randomizeBSGameboards = (playerCore: PlayerCore) => {
  const { player, opponent } = playerCore;

  randomizeBSGameboard(
    player.gameboardController,
    player.fleetBuilder.fleet
  );
  randomizeBSGameboard(
    opponent.gameboardController,
    opponent.fleetBuilder.fleet
  );
};
