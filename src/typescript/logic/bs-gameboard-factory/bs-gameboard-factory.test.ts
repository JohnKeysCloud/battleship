import { BattleshipBoardFactory } from './bs-gameboard-factory';

describe('`BattleshipBoardFactory` Instance Board Creation', () => {
  test('board creation/retrieval: should match emptyBoard: %o', () => {
    let testBoard: BattleshipBoardFactory = new BattleshipBoardFactory();

    // Hardcoded empty board representation
    const emptyBoard = Array.from({ length: 10 }, () =>
      Array(10).fill(Symbol('VC'))
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

// 💭 --------------------------------------------------------------

// {1} JSON.stringify recursively processes each element starting from the
// outermost array, moving inward to each sub - array, and finally to each
// individual element.In the replacer function, key and value are scoped
// to each specific element being processed in the current context of the
// traversal.In this case, each row of the 2D array. Therefore, in the
// traversal, the key resets back to 0 for each row.In the test above, we
// have no use for the key, we only need to replace each symbol with a
// string representation of it, so it handles the values accordingly.

