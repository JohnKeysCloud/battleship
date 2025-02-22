import { BattleshipBuilder } from "../../logic/bs-ship-builder/bs-ship-builder";
import { IPlacementConfigurations } from "../../types/logic-types";

export interface DragState {
  currentShipInstance: BattleshipBuilder | null;
  initialPlacementConfigurations: IPlacementConfigurations | null;
  isValidDropTarget: boolean;
  currentDragOverCell: HTMLDivElement | null;
  cloneSnapOffset: CloneSnapOffset | null;
  shipBorderValueSplit: ShipBorderValueSplit | null;
}

export type CloneSnapOffset = {
  offsetX: number;
  offsetY: number;
};

export type ShipBorderValueSplit = {
  numberValue: string;
  unitType: string;
}