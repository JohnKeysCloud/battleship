import {
  AxisArrayKey,
  Coordinates,
  IPosition,
  IShipPlacementConfigurations,
  Orientation,
  ShipLength,
  Version
} from "../types/logic-types";
import { BattleshipBoardBuilder } from "../logic/bs-gameboard-builder/bs-gameboard-builder";
import { BattleshipFleetBuilder } from "../logic/bs-fleet-builder/bs-fleet-builder";

export function createAxisArrayKey(
  axisIndex: number,
  isHorizontal: boolean
): AxisArrayKey {
  return isHorizontal ? `row-${axisIndex}` : `column-${axisIndex}`;
}

export function createBattleshipFleets(version: Version = 2002) {
  const fleet =
    version === 2002
      ? BattleshipFleetBuilder.createHasbroFleet
      : BattleshipFleetBuilder.createMBFleet;

  return {
    playerOne: fleet(),
    playerTwo: fleet(),
  };
}

export function createBattleshipBoardSet() {
  return {
    playerOne: new BattleshipBoardBuilder(),
    playerTwo: new BattleshipBoardBuilder(),
  };
}

export function createTestPosition(
    [x, y]: Coordinates,
    orientation: Orientation,
    shipLength: ShipLength
  ): IPosition {
    const isHorizontal = orientation === 'horizontal';
    const bowCoordinates: Coordinates = [x, y];
    const sternCoordinates: Coordinates = isHorizontal
      ? [x + shipLength - 1, y]
      : [x, y + shipLength - 1];
    
    return {
      bow: bowCoordinates,
      stern: sternCoordinates
    }
}

export function createShipConfigurations(
  shipLength: ShipLength,
  orientation: Orientation
): IShipPlacementConfigurations {
  return {
    orientation,
    shipLength,
  };
}
