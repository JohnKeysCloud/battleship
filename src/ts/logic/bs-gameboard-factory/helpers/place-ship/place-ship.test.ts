import {
  IPlacePieceWrapperParams,
  IPosition,
  BattleshipBoardFactory,
  createPlacementParams
} from "../../bs-gameboard-factory";

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

  const testObj: IPlacePieceWrapperParams = {
    endpoint: { bow: [0, 0], stern: [0, 4] } as IPosition,
    configurations: createPlacementParams('horizontal', 5)
  };

  test('ship can be placed', () => {
    expect(placeShip(testObj)).toBe(true);
  });
});
