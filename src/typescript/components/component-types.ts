import { BattleshipBuilder } from "../logic/bs-ship-builder/bs-ship-builder";
import { IPlacementConfigurations } from "../types/logic-types";

export interface DragState {
  currentShipInstance: BattleshipBuilder | null;
  initialPlacementConfigurations: IPlacementConfigurations | null;
  isValidDropTarget: boolean;
  currentDragOverCell: HTMLDivElement | null;
}
