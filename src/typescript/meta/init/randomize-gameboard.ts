import { randomizeBSGameboard } from "../../setup/randomize-bs-gameboard";
import { Orientation } from "../../types/logic-types";
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

  /**
   * 🧪 TESTING ONLY: Force-place opponent ships in visible vertical line
   * to speed up gameplay and observe endgame scenarios faster.
   * (Could’ve just toggled visibility via CSS… but here we are.)
   */
  // Object.values(opponent.fleetBuilder.fleet).forEach((ship, index) => {
  //   opponent.gameboardController.placePiece({
  //     ship,
  //     coordinates: [index, 0],
  //     orientation: 'vertical',
  //   });
  // });
};
