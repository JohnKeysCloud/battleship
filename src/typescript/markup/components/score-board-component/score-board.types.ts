import { PlayerType } from "../../../types/state-types";
import { ShipType } from "../../../types/logic-types";

type HitPointCollection = Partial<Record<ShipType, HTMLDivElement[]>>;
export type HitPointMap = {
  [key in PlayerType]: HitPointCollection;
};

export type HitMarkPayload = {
  playerType: PlayerType;
  shipType: ShipType;
};