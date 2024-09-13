import { BattleshipBoardFactory } from './bs-gameboard-factory';
import { ValidPlacementWrapperParams } from './bs-gameboard-factory';

describe('`BattleshipBoardFactory` Instantiation', () => {
  let testBoard: BattleshipBoardFactory;

  beforeEach(() => {
    testBoard = new BattleshipBoardFactory();
  });

  test('board creation/retrieval: should match emptyBoard: %o', () => {
    // Set up test data
    const emptyBoard = Array.from({ length: 10 }, () =>
      Array(10).fill(Symbol('V'))
    );

    // Inline serialization logic
    const serializeBoard = (board: symbol[][]) =>
      JSON.stringify( board, (key, value) => // {1}
        (typeof value === 'symbol' ? value.toString() : value));

    // Perform the test
    expect(serializeBoard(testBoard.board)).toBe(serializeBoard(emptyBoard));
  });

  describe('`validateShipPlacement`', () => {
    // Simplify method call
    const getValidPositionsArray = (input: ValidPlacementWrapperParams) =>
      testBoard.getValidShipPositions(input);

    // Creates test ship configurations
    const createPlacementParams = (
      direction: 'horizontal' | 'vertical',
      axisIndex: number,
      gamePieceSize: number
    ): ValidPlacementWrapperParams => ({
      direction,
      axisIndex,
      gamePieceSize,
    });

    // Create test case object
    const testCases = [
      {
        shipConfigs: createPlacementParams('horizontal', 9, 5),
        validPositions: [
          { bow: [9, 0], stern: [9, 4] },
          { bow: [9, 1], stern: [9, 5] },
          { bow: [9, 2], stern: [9, 6] },
          { bow: [9, 3], stern: [9, 7] },
          { bow: [9, 4], stern: [9, 8] },
          { bow: [9, 5], stern: [9, 9] },
        ],
      },
      {
        shipConfigs: createPlacementParams('vertical', 6, 2),
        validPositions: [
          { bow: [0, 6], stern: [1, 6] },
          { bow: [1, 6], stern: [2, 6] },
          { bow: [2, 6], stern: [3, 6] },
          { bow: [3, 6], stern: [4, 6] },
          { bow: [4, 6], stern: [5, 6] },
          { bow: [5, 6], stern: [6, 6] },
          { bow: [6, 6], stern: [7, 6] },
          { bow: [7, 6], stern: [8, 6] },
          { bow: [8, 6], stern: [9, 6] },
        ],
      },
    ];

    test.each(testCases)(
      'valid position array retrieval: %o',
      ({ shipConfigs, validPositions }) => {
        expect(getValidPositionsArray(shipConfigs)).toEqual(validPositions);
      }
    );
  });

  
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
