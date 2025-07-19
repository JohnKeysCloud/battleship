import { ShipType } from "./logic-types";

export type FragmentKey = 'parabellum' | 'bellum' | 'postBellum';
export type GridCellDataKey = `[data-x="${number}"][data-y="${number}"]`;
export type HitPointCollection = Partial<Record<ShipType, HTMLElement[]>>;