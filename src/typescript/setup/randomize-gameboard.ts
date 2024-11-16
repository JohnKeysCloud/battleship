import { PlayerState } from '../types/state-types';
import {
  Coordinates,
  Fleet,
  IPlacePieceWrapperParams,
  IShipPlacementConfigurations,
  Orientation,
  IPosition,
  AxisArrayKey,
} from '../types/logic-types';
import {
  areArraysEqual,
  getRandomInt,
} from '../utilities/random-utilities';
import { BattleshipBoardBuilder } from '../logic/bs-gameboard-builder/bs-gameboard-builder';
import { BattleshipBuilder } from '../logic/bs-ship-builder/bs-ship-builder';
import { BattleshipBoardController } from '../logic/bs-gameboard-controller/bs-gameboard-controller';
import { isShipType } from '../utilities/logic-utilities';

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
  const areCoordinatesValid = (
    coordinates: Coordinates,
    ship: BattleshipBuilder,
    orientation: Orientation
  ): boolean => {
    const validPositionsParams: IShipPlacementConfigurations = {
      shipLength: ship.length,
      orientation,
    };

    const validPositions =
      playerBoardController.getValidPositions(validPositionsParams);
    const [bowX, bowY]: Coordinates = coordinates;
    const isHorizontal: boolean = orientation === 'horizontal';
    const axisIndex: number = isHorizontal ? bowY : bowX;

    const axisArrayKey: AxisArrayKey = isHorizontal
      ? `row-${axisIndex}`
      : `column-${axisIndex}`;
    const axisArray: IPosition[] = validPositions[axisArrayKey];

    return axisArray.some((position: IPosition) =>
      areArraysEqual(position.bow, coordinates)
    );
  }; 
  const getValidCoordinatesRecursively = (
    ship: BattleshipBuilder,
    orientation: Orientation,
    boardSize: number,
    attempts: number = 0
  ): Coordinates => {
    if (attempts > 100)
      throw new Error(`Max recursion depth exceeded when placing the ${ship.type}.`);

    const coordinates: Coordinates = generateRandomCoordinates(
      ship.length,
      boardSize
    );

    return areCoordinatesValid(coordinates, ship, orientation)
      ? coordinates
      : getValidCoordinatesRecursively(
          ship,
          orientation,
          boardSize,
          attempts + 1
        )
  };

  const playerBoardBuilder: BattleshipBoardBuilder = player.gameboardBuilder;
  const playerBoardController: BattleshipBoardController = player.gameboardController;
  const boardSize: number = playerBoardBuilder.boardSize;
  const playerFleet: Fleet = player.fleetBuilder.fleet;

  for (const shipType in playerFleet) {
    if (!isShipType(shipType)) throw new Error(`Invalid Type: "${shipType}" doesn't conform to "ShipType".`);

    const ship: BattleshipBuilder = playerFleet[shipType]!;
    const randomOrientation: Orientation = generateRandomOrientation();

    const coordinates: Coordinates = getValidCoordinatesRecursively(
      ship,
      randomOrientation,
      boardSize
    );

    const placePieceParams: IPlacePieceWrapperParams = {
      ship,
      coordinates,
      orientation: randomOrientation,
    };
    
    playerBoardController.placePiece(placePieceParams);
  }
}
