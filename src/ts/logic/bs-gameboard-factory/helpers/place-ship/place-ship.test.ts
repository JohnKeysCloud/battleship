import {
  Coordinates,
  IPlacePieceWrapperParams,
  BattleshipBoardFactory,
  createShipConfigurations
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
    coordinates: [0, 0] as Coordinates,
    configurations: createShipConfigurations('horizontal', 5)
  };

  test('ship can be placed', () => {
    expect(placeShip(testObj)).toEqual(testBoard.board);
  });
});
