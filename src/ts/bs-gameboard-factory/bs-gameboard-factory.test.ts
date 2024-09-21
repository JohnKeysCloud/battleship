import { BattleshipBoardFactory } from './bs-gameboard-factory';
import { IValidPlacementWrapperParams } from './bs-gameboard-factory';
import { IValidPositionsResult } from './bs-gameboard-factory';
import { IPosition } from './helpers/get-valid-positions/get-valid-positions';
import type { Coordinates } from './bs-gameboard-factory';
describe('`BattleshipBoardFactory` Instance Board Creation', () => {
  test('board creation/retrieval: should match emptyBoard: %o', () => {
    let testBoard: BattleshipBoardFactory = new BattleshipBoardFactory();

    // Hardcoded empty board representation
    const emptyBoard = Array.from({ length: 10 }, () =>
      Array(10).fill(Symbol('V'))
    );

    // Inline serialization logic
    const serializeBoard = (board: symbol[][]) =>
      JSON.stringify(board, (key, value) => // {1}
        (typeof value === 'symbol' ? value.toString() : value)
    );

    // Perform the test
    expect(serializeBoard(testBoard.board)).toBe(serializeBoard(emptyBoard));
  });
});

describe('`validateShipPlacement`', () => {
  // Initialized with instance to ensure definition in setup/helper functions
  let testBoard: BattleshipBoardFactory = new BattleshipBoardFactory();

  // Creates a new instance for each test run
  beforeEach(() => {
    testBoard = new BattleshipBoardFactory();
  });

  interface validPositionsTestCase {
    shipConfigs: IValidPlacementWrapperParams;
    validPositions: IValidPositionsResult;
  }

  // Test function utility
  const getValidPositionsArray = (input: IValidPlacementWrapperParams) =>
    testBoard.getValidShipPositions(input);

  // Ensure interface compliance
  const createPlacementParams = (
    direction: 'horizontal' | 'vertical',
    gamePieceSize: number
  ): IValidPlacementWrapperParams => ({
    direction,
    gamePieceSize,
  });

  // Dynamically create expected test result
  function createTestCaseResult(
    direction: 'horizontal' | 'vertical',
    gamePieceSize: number
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
      const axisTemplate =
        direction === 'horizontal' ? `row-${i}` : `column-${i}`;

      // Initializes array for row/column
      validPositions[axisTemplate] = [];

      // Populates each array
      for (let j = 0; j + (gamePieceSize - 1) < testBoard.boardSize; j++) {
        let position: IPosition =
          direction === 'horizontal'
            ? createPosition([i, j], [i, j + gamePieceSize - 1])
            : createPosition([j, i], [j + gamePieceSize - 1, i]);

        validPositions[axisTemplate].push(position);
      }
    }

    return validPositions;
  }

  // Actual Test Object
  const testCases: validPositionsTestCase[] = [
    {
      shipConfigs: createPlacementParams('horizontal', 5),
      validPositions: createTestCaseResult('horizontal', 5),
    },
    {
      shipConfigs: createPlacementParams('vertical', 2),
      validPositions: createTestCaseResult('vertical', 2),
    },
    {
      shipConfigs: createPlacementParams('horizontal', 4),
      validPositions: createTestCaseResult('horizontal', 4),
    },
    {
      shipConfigs: createPlacementParams('vertical', 3),
      validPositions: createTestCaseResult('vertical', 3),
    },
  ];

  test.each(testCases)(
    'valid position retrieval (empty board): %o',
    ({ shipConfigs, validPositions }) => {
      expect(getValidPositionsArray(shipConfigs)).toEqual(validPositions);
    }
  );
});

// 💭 --------------------------------------------------------------

// {1} JSON.stringify recursively processes each element starting from the
// outermost array, moving inward to each sub - array, and finally to each
// individual element.In the replacer function, key and value are scoped
// to each specific element being processed in the current context of the
// traversal.In this case, each row of the 2D array. Therefore, in the
// traversal, the key resets back to 0 for each row.In the test above, we
// have no use for the key, we only need to replace each symbol with a
// string representation of it, so it handles the values accordingly.

