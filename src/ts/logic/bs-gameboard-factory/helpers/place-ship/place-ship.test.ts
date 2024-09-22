import { BattleshipBoardFactory, Coordinates, IPlacePieceWrapperParams, createPlacementParams } from "../../bs-gameboard-factory";

describe('`placeShip`', () => {
  // Initialized with instance to ensure definition in setup/helper functions
  let testBoard: BattleshipBoardFactory = new BattleshipBoardFactory();

  // Creates a new instance for each test run
  beforeEach(() => {
    testBoard = new BattleshipBoardFactory();
  });

  // Test function utility
  const placeShip = (input: IPlacePieceWrapperParams) =>
    testBoard.placePiece(input);

  const testObj = {
    endpoint: [3, 2] as Coordinates,
    configurations: createPlacementParams('horizontal', 5)
  };

  test('function call', () => {
    expect(placeShip(testObj)).toBe('test');
  });
});
