import {
  BattleshipBoardFactory,
  createShipConfigurations,
  POSITION_STATES
} from '../../bs-gameboard-factory';
import {
  Coordinates,
  IPlacePieceWrapperParams,
  IPosition,
  IShipConfigurations,
} from '../../../../types/logic-types/logic-types';

describe('`placeShip`', () => {
  // 💭 --------------------------------------------------------------
  // 💭 Setup
  let testBoard: BattleshipBoardFactory;

  beforeEach(() => {
    testBoard = new BattleshipBoardFactory();
  });

  const placeShip = (input: IPlacePieceWrapperParams) =>
    testBoard.placePiece(input);

  // 💭 --------------------------------------------------------------
  // 💭 Helpers

  const generateExpectedBoard = (input: IPlacePieceWrapperParams) => {
    if (!input.configurations) {
      throw new Error('Configurations must be provided');
    }

    const expectedBoard = Array(10)
      .fill(null)
      .map(() => Array(10).fill(POSITION_STATES.vacant));

    const coordinates = input.coordinates;
    const direction = input.configurations.direction;
    const shipLength = input.configurations.gamePieceSize;

    if (direction === 'horizontal') {
      for (let i = coordinates[1]; i < coordinates[1] + shipLength; i++) {
        expectedBoard[coordinates[0]][i] = POSITION_STATES.occupied;
      }
    } else {
      for (let i = coordinates[0]; i < coordinates[0] + shipLength; i++) {
        expectedBoard[i][coordinates[1]] = POSITION_STATES.occupied;
      }
    }

    return expectedBoard;
  };

  const generateCoordinates = (xBow: number, yBow: number): Coordinates => [xBow, yBow];
  
  const generatePosition = (input: IPlacePieceWrapperParams): IPosition => {
    if (!input.configurations) {
      throw new Error('Configurations must be provided');
    }

    const coordinates: Coordinates = generateCoordinates(input.coordinates[0], input.coordinates[1]);
    const configurations: IShipConfigurations = input.configurations;
    const isHorizontal = configurations.direction === 'horizontal';
    const shipLength = configurations.gamePieceSize;

    return {
      bow: coordinates,
      stern:
        isHorizontal
          ? [coordinates[0], coordinates[1] + shipLength - 1]
          : [coordinates[0] + shipLength - 1, coordinates[1]],
    };
  }

  const generateOverlapErrorMessage = ({ coordinates, configurations }: IPlacePieceWrapperParams) =>
    `"${JSON.stringify(generatePosition({ coordinates, configurations }))}" is unavailable for ship with configurations: ${JSON.stringify(configurations)}`;

  const generateOutOfBoundsErrorMessage = ({ coordinates, configurations }: IPlacePieceWrapperParams) => {
    if (!configurations) throw new Error('Configurations must be provided');
    return `The ship placement starting at ${coordinates} with length ${configurations.gamePieceSize} exceeds the board size of 10.`;
  };

  // 💭 --------------------------------------------------------------
  // 💭 Tests

  const validPlacementTestCases = [
    {
      input: {
        coordinates: generateCoordinates(0, 3),
        configurations: createShipConfigurations('horizontal', 3),
      },
      expected: generateExpectedBoard({
        coordinates: [0, 3],
        configurations: createShipConfigurations('horizontal', 3),
      }),
    },
    {
      input: {
        coordinates: generateCoordinates(4, 5),
        configurations: createShipConfigurations('vertical', 5),
      },
      expected: generateExpectedBoard({
        coordinates: [4, 5],
        configurations: createShipConfigurations('vertical', 5),
      }),
    },
  ];
  test.each(validPlacementTestCases)(
    'ship is placed correctly on the gameboard',
    ({ input, expected }) => {
      placeShip(input)
    expect(testBoard.board).toEqual(expected);
    }
  );  

  const overlapTestCases = [
    {
      input: {
        coordinates: generateCoordinates(0, 3),
        configurations: createShipConfigurations('horizontal', 3)
      },
      expectedError: generateOverlapErrorMessage({
        coordinates: generateCoordinates(0, 3),
        configurations: createShipConfigurations('horizontal', 3)
      })
    },
    {
      input: {
        coordinates: generateCoordinates(0, 3),
        configurations: createShipConfigurations('vertical', 5)
      },
      expectedError: generateOverlapErrorMessage({
        coordinates: generateCoordinates(0, 3),
        configurations: createShipConfigurations('vertical', 5)
      })
    },
  ];
  test.each(overlapTestCases)(
    'ship placement overlap throws error',
    ({ input, expectedError }) => {
      
    placeShip({
      coordinates: [0, 0],
      configurations: {
        direction: 'horizontal',
        gamePieceSize: 5,
      }
    });
      
    expect(() => placeShip(input)).toThrow(expectedError);
  });

  const outOfBoundTestCases = [
    {
      input: {
        coordinates: generateCoordinates(0, 7),
        configurations: createShipConfigurations('horizontal', 3),
      },
      expectedError: generateOutOfBoundsErrorMessage({
        coordinates: generateCoordinates(0, 7),
        configurations: createShipConfigurations('horizontal', 3)
      }),
    },
    {
      input: {
        coordinates: generateCoordinates(8, 0),
        configurations: createShipConfigurations('vertical', 3),
      },
      expectedError: generateOutOfBoundsErrorMessage({
        coordinates: generateCoordinates(8, 0),
        configurations: createShipConfigurations('vertical', 3)
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