import {
  Coordinates,
  Fleet,
  IPlacePieceWrapperParams,
  IShipPlacementConfigurations,
  Orientation,
  IPosition,
  PositionArray,
  AxisArrayKey,
} from '../types/logic-types';
import {
  areArraysEqual,
  getRandomInt,
} from '../utilities/random-utilities';
import { BattleshipBuilder } from '../logic/bs-ship-builder/bs-ship-builder';
import { BattleshipBoardController } from '../logic/bs-gameboard-controller/bs-gameboard-controller';
import { isShipType } from '../types/type-guards';

export function randomizeBSGameboard(
  gameboardController: BattleshipBoardController, fleet: Fleet
) {
  if (!gameboardController)
    throw new Error('Invalid Command: `gameboardController` is required to randomize the gameboard.');
  if (!fleet)
    throw new Error('Invalid Command: `fleet` is required to randomize the gameboard.');

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
      gameboardController.getValidPositions(validPositionsParams);
    const [bowX, bowY]: Coordinates = coordinates;
    const isHorizontal: boolean = orientation === 'horizontal';
    const axisIndex: number = isHorizontal ? bowY : bowX;

    const axisArrayKey: AxisArrayKey = isHorizontal
      ? `row-${axisIndex}`
      : `column-${axisIndex}`;
    const axisArray: PositionArray = validPositions[axisArrayKey];

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

  const boardSize: number = 10;

  for (const shipType in fleet) {
    if (!isShipType(shipType)) throw new Error(`Invalid Type: "${shipType}" doesn't conform to "ShipType".`);

    const ship: BattleshipBuilder = fleet[shipType]!;
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
    
    gameboardController.placePiece(placePieceParams);
  }
}
