import {
  ITestCaseShipHit,
  ShipType,
  Version,
} from '../../types/logic-types';
import { BattleshipBuilder } from './bs-ship-builder';

// Helper function to create a new instance of a ship
const createShip = (
  type: ShipType,
  version: Version = 2002
): BattleshipBuilder => {
  return new BattleshipBuilder(type, version);
};

describe('`BattleshipBuilder`', () => {
  // Create ship instances in the test setup
  let cruiser: BattleshipBuilder;

  // Setup a new cruiser before each test
  beforeEach(() => {
    cruiser = createShip(ShipType.Cruiser, 1990);
  });

  // Define the lifecycle test cases
  const cruiserLifeCycle: ITestCaseShipHit[] = [
    { hits: 1, expected: 'Hit registered. Hit count: 1.' },
    { hits: 2, expected: 'Hit registered. Hit count: 2.' },
    { hits: 3, expected: 'Hit registered. Hit count: 3.' },
    { hits: 4, expected: 'This ship has already perished.' },
    { hits: 5, expected: 'This ship has already perished.' },
  ];


  // Test lifecycle by performing the specified number of hits
  test.each(cruiserLifeCycle)(
    'after several hit(s), `hit` method returns correct message: %o',
    ({ hits, expected }) => {
      let result: string = '';

      for (let i = 0; i < hits; i++) {
        result = cruiser.hit();
      }

      expect(result).toBe(expected);
    }
  );

  // Test isSeaworthy method
  test('isSeaworthy method returns correct status', () => {
    expect(cruiser.isSeaworthy()).toBe(true); // before any hits
    cruiser.hit();

    expect(cruiser.isSeaworthy()).toBe(true); // after one hit

    cruiser.hit();
    cruiser.hit();

    expect(cruiser.isSeaworthy()).toBe(false); // after enough hits
  });
});
