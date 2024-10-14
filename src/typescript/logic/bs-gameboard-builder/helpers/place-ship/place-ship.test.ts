import {
  Coordinates,
  IPlacePieceWrapperParams,
  IPosition,
  IShipPlacementConfigurations,
  Orientation,
  ShipType
} from '../../../types/logic-types';
import {
  BattleshipBoardBuilder,
} from '../../bs-gameboard-builder';
import { BattleshipFleetBuilder } from '../../../bs-fleet-builder/bs-fleet-builder';
import { BattleshipBuilder } from '../../../bs-ship-builder/bs-ship-builder';

describe('`placeShip`', () => {
  // 💭 --------------------------------------------------------------
  // 💭 Setup
  let testBoard: BattleshipBoardBuilder = new BattleshipBoardBuilder();
  let testShip: BattleshipBuilder = BattleshipFleetBuilder.createHasbroFleet().getShip(ShipType.Carrier);

  beforeEach(() => {
    testBoard = new BattleshipBoardBuilder();
    testShip = BattleshipFleetBuilder.createHasbroFleet().getShip(ShipType.Carrier);
  });

  const placeShip = (input: IPlacePieceWrapperParams) =>
    testBoard.placePiece(input);

  // 💭 --------------------------------------------------------------
  // 💭 Helpers

  const generateExpectedBoard = (input: IPlacePieceWrapperParams) => {
    const expectedBoard = Array.from({ length: 10 }, () =>
      Array(10).fill(testBoard.fillValue)
    );

    const shipSymbol = input.ship.symbol;
    const coordinates = input.coordinates;
    const shipLength = input.ship.length;
    const orientation = input.orientation;

    if (orientation === 'horizontal') {
      for (let i = coordinates[1]; i < coordinates[1] + shipLength; i++) {
        expectedBoard[coordinates[0]][i] = shipSymbol;
      }
    } else {
      for (let i = coordinates[0]; i < coordinates[0] + shipLength; i++) {
        expectedBoard[i][coordinates[1]] = shipSymbol;
      }
    }

    return expectedBoard;
  };

  const generateCoordinates = (xBow: number, yBow: number): Coordinates => [xBow, yBow];

  const generateOrientation = (orientation: Orientation): Orientation => {
    return orientation;
  }
  
  const generatePosition = (input: IPlacePieceWrapperParams): IPosition => {

    const coordinates: Coordinates = generateCoordinates(input.coordinates[0], input.coordinates[1]);
    const configurations: IShipPlacementConfigurations = {
      shipLength: input.ship.length,
      orientation: input.orientation
    };
    const isHorizontal = configurations.orientation === 'horizontal';
    const shipLength = input.ship.length;

    return {
      bow: coordinates,
      stern:
        isHorizontal
          ? [coordinates[0], coordinates[1] + shipLength - 1]
          : [coordinates[0] + shipLength - 1, coordinates[1]],
    };
  }

  const generateOverlapErrorMessage = ({ ship, coordinates, orientation }: IPlacePieceWrapperParams) =>
    `"${JSON.stringify(generatePosition({ ship, coordinates, orientation }))}" is unavailable for ship with Size: ${ship.length} and Orientation: ${orientation}.`;

  const generateOutOfBoundsErrorMessage = ({ ship, coordinates, orientation }: IPlacePieceWrapperParams) => {
    return `The ship placement attempt with the following configurations is out of bounds: Coordinates: ${coordinates}, Length: ${ship.length}, Orientation ${orientation}.`;
  };

  // 💭 --------------------------------------------------------------
  // 💭 Tests

  const validPlacementTestCases = [
    {
      input: {
        ship: testShip,
        coordinates: generateCoordinates(0, 3),
        orientation: generateOrientation('horizontal'),
      },
      expected: generateExpectedBoard({
        ship: testShip,
        coordinates: [0, 3],
        orientation: 'horizontal'
      }),
    },
    {
      input: {
        ship: testShip,
        coordinates: generateCoordinates(4, 5),
        orientation: generateOrientation('vertical'),
      },
      expected: generateExpectedBoard({
        ship: testShip,
        coordinates: [4, 5],
        orientation: 'vertical'
      }),
    },
  ];
  test.each(validPlacementTestCases)(
    'ship is placed correctly on the gameboard',
    ({ input, expected }) => {
      placeShip(input);
      expect(testBoard.board).toEqual(expected);
    }
  );  

  const overlapTestCases = [
    {
      input: {
        ship: testShip,
        coordinates: generateCoordinates(0, 3),
        orientation: generateOrientation('horizontal')
      },
      expectedError: generateOverlapErrorMessage({
        ship: testShip,
        coordinates: [0, 3],
        orientation: 'horizontal',
      }),
    },
    {
      input: {
        ship: testShip,
        coordinates: generateCoordinates(0, 3),
        orientation: generateOrientation('vertical'),
      },
      expectedError: generateOverlapErrorMessage({
        ship: testShip,
        coordinates: [0, 3],
        orientation: 'vertical',
      }),
    },
  ];
  test.each(overlapTestCases)(
    'ship placement overlap throws error',
    ({ input, expectedError }) => {
      
    placeShip({
      ship: testShip,
      coordinates: [0, 0],
      orientation: 'horizontal',
    });
      
    expect(() => placeShip(input)).toThrow(expectedError);
  });

  const outOfBoundTestCases = [
    {
      input: {
        ship: testShip,
        coordinates: generateCoordinates(0, 7),
        orientation: generateOrientation('horizontal'),
      },
      expectedError: generateOutOfBoundsErrorMessage({
        ship: testShip,
        coordinates: [0, 7],
        orientation: 'horizontal'
      }),
    },
    {
      input: {
        ship: testShip,
        coordinates: generateCoordinates(8, 0),
        orientation: generateOrientation('vertical'),
      },
      expectedError: generateOutOfBoundsErrorMessage({
        ship: testShip,
        coordinates: [8, 0],
        orientation: 'vertical'
      }),
    },
  ]; 
  test.each(outOfBoundTestCases)(
    'ship placement out of bounds throws error',
    ({ input, expectedError }) => {
      expect(() => placeShip(input)).toThrow(expectedError)
    }
  );
});