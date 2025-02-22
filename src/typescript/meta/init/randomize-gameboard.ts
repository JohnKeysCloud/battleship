import { randomizeBSGameboard } from "../../setup/randomize-bs-gameboard";
import { players } from "../../state/player-state";

export const randomizeBSGameboards = () => {
  randomizeBSGameboard(
    players.player.gameboardController,
    players.player.fleetBuilder.fleet
  );
  randomizeBSGameboard(
    players.opponent.gameboardController,
    players.opponent.fleetBuilder.fleet
  );
};
