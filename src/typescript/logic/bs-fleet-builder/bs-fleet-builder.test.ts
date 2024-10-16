import { ShipType } from '../../types/logic-types';
import { BattleshipFleetBuilder } from './bs-fleet-builder';
import { BattleshipBuilder } from '../bs-ship-builder/bs-ship-builder';

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
    const fleet: BattleshipFleetBuilder = BattleshipFleetBuilder.createMBFleet();
    const carrier: BattleshipBuilder = fleet.getShip(ShipType.Carrier);
    expect(carrier).toBeDefined();
    expect(carrier.version).toBe(1990);
  });

  test('should throw an error for a ship type not in the fleet', () => {
    const fleet: BattleshipFleetBuilder = BattleshipFleetBuilder.createHasbroFleet();
    expect(() => fleet.getShip(ShipType.Cruiser)).toThrow(
      'Ship of type cruiser not found in fleet.'
    ); 
  });
});
