import { BattleshipFleetFactory } from './bs-fleet-factory';
import { ShipType } from '../../types/logic-types/logic-types';

describe('BattleshipFleetFactory', () => {
  let fleetFactory: BattleshipFleetFactory;

  beforeEach(() => {
    fleetFactory = BattleshipFleetFactory.createMBFleet();
  });

  test('should create a fleet with correct ships', () => {
    expect(fleetFactory.getShip(ShipType.Carrier)).toBeDefined();
    expect(fleetFactory.getShip(ShipType.Battleship)).toBeDefined();
    expect(fleetFactory.getShip(ShipType.Cruiser)).toBeDefined();
    expect(fleetFactory.getShip(ShipType.Destroyer)).toBeDefined();
    expect(fleetFactory.getShip(ShipType.Submarine)).toBeDefined();
    expect(fleetFactory.getShip(ShipType.PatrolBoat)).toBeUndefined(); // Not in this fleet
  });

  test('should create a fleet with specified versions for MBFleet', () => {
    const fleet = BattleshipFleetFactory.createMBFleet();
    const carrier = fleet.getShip(ShipType.Carrier);
    expect(carrier).toBeDefined();
    expect(carrier?.versionYear).toBe(1990);
  });

  test('should return undefined for a ship type not in the fleet', () => {
    const fleet = BattleshipFleetFactory.createHasbroFleet();
    expect(fleet.getShip(ShipType.Cruiser)).toBeUndefined(); // Not in this fleet
  });
});
