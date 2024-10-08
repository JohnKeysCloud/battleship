import { BattleshipFleetBuilder } from './bs-fleet-builder';
import { ShipType } from '../types/logic-types';

describe('BattleshipFleetBuilder', () => {
  let fleetBuilder: BattleshipFleetBuilder;

  beforeEach(() => {
    fleetBuilder = BattleshipFleetBuilder.createMBFleet();
  });

  test('should create a fleet with correct ships', () => {
    expect(fleetBuilder.getShip(ShipType.Carrier)).toBeDefined();
    expect(fleetBuilder.getShip(ShipType.Battleship)).toBeDefined();
    expect(fleetBuilder.getShip(ShipType.Cruiser)).toBeDefined();
    expect(fleetBuilder.getShip(ShipType.Destroyer)).toBeDefined();
    expect(fleetBuilder.getShip(ShipType.Submarine)).toBeDefined();
  });

  test('should create a fleet with specified versions for MBFleet', () => {
    const fleet = BattleshipFleetBuilder.createMBFleet();
    const carrier = fleet.getShip(ShipType.Carrier);
    expect(carrier).toBeDefined();
    expect(carrier?.version).toBe(1990);
  });

  test('should throw an error for a ship type not in the fleet', () => {
    const fleet = BattleshipFleetBuilder.createHasbroFleet();
    expect(() => fleet.getShip(ShipType.Cruiser)).toThrow(
      'Ship of type cruiser not found in fleet.'
    ); 
  });
});
