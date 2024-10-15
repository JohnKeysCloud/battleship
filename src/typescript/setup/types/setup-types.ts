import { Fleet } from "../../logic/types/logic-types";
import { BattleshipBoardBuilder } from "../../logic/bs-gameboard-builder/bs-gameboard-builder";

export interface PlayerState {
  gameboardInstance: BattleshipBoardBuilder;
  fleet: Fleet;
}
