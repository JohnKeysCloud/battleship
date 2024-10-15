
import { PlayerState } from './types/setup-types';
import {
  AxisArrayKey,
  Coordinates,
  CoordinatesSetMember,
  CoordinatesSet,
  Fleet,
  IFleetCoordinates,
  IPlacePieceWrapperParams,
  IShipPlacementConfigurations,
  IValidPositionsResult,
  Orientation
} from '../logic/types/logic-types';
import {
  areArraysEqual,
  getRandomInt,
} from '../utilities/random-utilities';
import { BattleshipBoardBuilder } from '../logic/bs-gameboard-builder/bs-gameboard-builder';
import { BattleshipBuilder } from '../logic/bs-ship-builder/bs-ship-builder';

export function randomizeGameboard(player: PlayerState) {
  const generateRandomCoordinates = (
    shipLength: number,
    boardSize: number
  ): Coordinates => {
    const max: number = boardSize - shipLength;
    const xRandom: number = getRandomInt(0, max);
    const yRandom: number = getRandomInt(0, max);

    return [xRandom, yRandom];
  };
  const generateRandomOrientation = (): Orientation => {
    return Math.random() < 0.5 ? 'horizontal' : 'vertical';
  };
  const getAllOccupiedPositions = (
    fleetCoordinates: IFleetCoordinates
  ): CoordinatesSet => {
    const allOccupiedCoordinates: CoordinatesSet = new Set();

    for (const shipType in fleetCoordinates) {
      const shipCoordinateSet: CoordinatesSet = fleetCoordinates[shipType];

      shipCoordinateSet.forEach((coordinate: CoordinatesSetMember) =>
        allOccupiedCoordinates.add(coordinate)
      );
    }

    return allOccupiedCoordinates;
  };
  const getValidCoordinatesRecursively = (
    ship: BattleshipBuilder,
    isHorizontal: boolean,
    validPositions: IValidPositionsResult,
    boardSize: number,
    attempts: number = 0
  ): Coordinates => {
    if (attempts > 100)
      throw new Error(`Too many attempts to place ship: ${ship.type}`);

    // Randomly generated coordinates
    const coordinates: Coordinates = generateRandomCoordinates(
      ship.length,
      boardSize
    );

    // Destructured random coordinates
    const [bowX, bowY]: Coordinates = coordinates;

    // Random coordinates converted to set member template format
    const CoordinatesSetMember: CoordinatesSetMember = `[${bowX}, ${bowY}]`;

    // Set of sll occupied coordinates
    const allOccupiedCoordinates = getAllOccupiedPositions(
      playerBoardInstance.fleetCoordinates
    );

    // Check randomly generated coordiate set member checked against occupied positiions
    if (allOccupiedCoordinates.has(CoordinatesSetMember)) {
      return getValidCoordinatesRecursively(
        ship,
        isHorizontal,
        validPositions,
        boardSize,
        attempts + 1
      );
    }

    // Key for direct row/column access in `validPositions` object
    const axisArrayKey: AxisArrayKey = isHorizontal
      ? `row-${bowX}`
      : `column-${bowY}`;

    // Actual row/column of the `validPositions` object where our coordinate potentially resides
    const axisArray = validPositions[axisArrayKey];

    // Check our randomly generated coordinate against the bow position coordinates of the `axisArray`
    const isPositionValid = axisArray.some((position) =>
      // Utility that checks array values rather than comparing different array references
      areArraysEqual(position.bow, coordinates)
    );

    // If the position is valid, these coordinates are valid for ship bow placement, else the function runs again
    return isPositionValid === true
      ? coordinates
      : getValidCoordinatesRecursively(
          ship,
          isHorizontal,
          validPositions,
          boardSize,
          attempts + 1
        );
  };

  const playerBoardInstance: BattleshipBoardBuilder = player.gameboardInstance;
  const boardSize: number = playerBoardInstance.boardSize;
  const playerFleet: Fleet = player.fleet;

  for (const shipName in playerFleet) {
    const ship: BattleshipBuilder = playerFleet[shipName];
    const orientation: Orientation = generateRandomOrientation();
    const validPositionsParams: IShipPlacementConfigurations = {
      shipLength: ship.length,
      orientation,
    };
    const isHorizontal: boolean = orientation === 'horizontal';
    const validPositions: IValidPositionsResult =
      playerBoardInstance.getValidPositions(validPositionsParams);

    const coordinates: Coordinates = getValidCoordinatesRecursively(
      ship,
      isHorizontal,
      validPositions,
      boardSize
    );

    const placePieceParams: IPlacePieceWrapperParams = {
      ship,
      coordinates,
      orientation,
    };
    playerBoardInstance.placePiece(placePieceParams);
  }

  console.table(playerBoardInstance.prettyPrint());
}
