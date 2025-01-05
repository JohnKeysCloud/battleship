import {
  ShipType
} from '../../../types/logic-types';
import { PlayerState } from '../../../types/state-types';
import { createPlayerStateObject } from '../../../state/player-state';

let playerState: PlayerState = createPlayerStateObject();

beforeEach(() => {
  playerState = createPlayerStateObject()
});

describe('receive attack method', () => {
  test('get ship type', () => {
    // Place carrier on gameboard
    playerState.gameboardController.placePiece({
      ship: playerState.fleetBuilder.getShip(ShipType.Carrier),
      coordinates: [0, 0],
      orientation: 'vertical',
    });

    // receiveAttack on Gameboard at coordinates [0,1]
    const shipType = playerState.gameboardController.receiveAttack(
      [0, 1]
    );

    expect(shipType).toBe(ShipType.Carrier);
  });
});