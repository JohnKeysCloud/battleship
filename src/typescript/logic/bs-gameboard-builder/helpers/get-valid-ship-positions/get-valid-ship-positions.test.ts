import {
  AxisArrayKey,
  Coordinates,
  IPosition,
  IShipPlacementConfigurations,
  ITestCaseValidPositions,
  IValidPositionsResult,
  Orientation,
} from '../../../types/logic-types';
import { createShipConfigurations, BattleshipBoardBuilder } from '../../bs-gameboard-builder';

describe('`getValidShipPositions`', () => {
  // Initialized with instance to ensure definition in setup/helper functions
  let testBoard: BattleshipBoardBuilder = new BattleshipBoardBuilder();

  // Creates a new instance for each test run
  beforeEach(() => {
    testBoard = new BattleshipBoardBuilder();
  });

  // Test function utility
  const getValidShipPositions = (
    input: IShipPlacementConfigurations
  ): IValidPositionsResult =>
    testBoard.getValidPositions(input);

  // Dynamically create expected test result
  function createTestCaseResult(
    gamePieceSize: number,
    orientation: Orientation,
  ): IValidPositionsResult {
    const createPosition = (
      bow: Coordinates,
      stern: Coordinates
    ): IPosition => {
      return { bow, stern };
    };

    // Initalizes return object to contain all valid positions
    const validPositions: IValidPositionsResult = {};

    // Creates row/column objects
    for (let i = 0; i < testBoard.boardSize; i++) {
      const axisTemplate: AxisArrayKey =
        orientation === 'horizontal' ? `row-${i}` : `column-${i}`;

      // Initializes array for row/column
      validPositions[axisTemplate] = [];

      // Populates each array
      for (let j = 0; j + (gamePieceSize - 1) < testBoard.boardSize; j++) {
        let position: IPosition =
          orientation === 'horizontal'
            ? createPosition([i, j], [i, j + gamePieceSize - 1])
            : createPosition([j, i], [j + gamePieceSize - 1, i]);

        validPositions[axisTemplate].push(position);
      }
    }

    return validPositions;
  }

  // Actual Test Object
  const testCases: ITestCaseValidPositions[] = [
    {
      shipPlacementConfigs: createShipConfigurations(5, 'horizontal'),
      validPositions: createTestCaseResult(5, 'horizontal'),
    },
    {
      shipPlacementConfigs: createShipConfigurations(2, 'vertical'),
      validPositions: createTestCaseResult(2, 'vertical'),
    },
    {
      shipPlacementConfigs: createShipConfigurations(4, 'horizontal'),
      validPositions: createTestCaseResult(4,'horizontal'),
    },
    {
      shipPlacementConfigs: createShipConfigurations(3, 'vertical'),
      validPositions: createTestCaseResult(3, 'vertical'),
    },
  ];

  test.each(testCases)(
    'valid position retrieval (empty board): %o',
    ({ shipPlacementConfigs, validPositions }) => {
      expect(getValidShipPositions(shipPlacementConfigs)).toEqual(validPositions);
    }
  );
});
