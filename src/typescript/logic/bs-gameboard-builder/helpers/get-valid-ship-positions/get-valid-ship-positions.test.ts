import {
  AxisArrayKey,
  Coordinates,
  IPosition,
  IShipPlacementConfigurations,
  ITestCaseValidPositions,
  IValidPositionsResult,
  Orientation,
  ShipLength,
} from '../../../../types/logic-types';
import { createAxisArrayKey, createShipConfigurations } from '../../../../utilities/logic-utilities';
import { BattleshipBoardBuilder } from '../../bs-gameboard-builder';

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
    shipLength: ShipLength,
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
    const isHorizontal = orientation === 'horizontal';

    // Creates row/column objects
    for (let i = 0; i < testBoard.boardSize; i++) {
      const axisArrayKey: AxisArrayKey = createAxisArrayKey(i, isHorizontal);

      // Initializes array for row/column
      if(!validPositions[axisArrayKey]) validPositions[axisArrayKey] = [];

      // Populates each array
      for (let j = 0; j + (shipLength - 1) < testBoard.boardSize; j++) {
        let position: IPosition =
          isHorizontal
            ? createPosition([j, i], [j + shipLength - 1, i])
            : createPosition([i, j], [i, j + shipLength - 1]);

        validPositions[axisArrayKey].push(position);
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
