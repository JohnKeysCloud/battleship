import {
  ShipType
} from '../../../types/logic-types';
import { PlayerContext } from '../../../types/state-types';
import { createPlayerContext } from '../../../state/player-state';

let playerContext: PlayerContext = createPlayerContext();

beforeEach(() => {
  playerContext = createPlayerContext();
});

describe('receive attack method', () => {
  test('get ship', () => {
    // Place carrier on gameboard
    playerContext.gameboardController.placePiece({
      ship: playerContext.fleetBuilder.getShip(ShipType.Carrier),
      coordinates: [0, 0],
      orientation: 'vertical',
    });

    // receiveAttack on Gameboard at coordinates [0,1]
    const shipType = playerContext.gameboardController.receiveAttack(
      [0, 1]
    );

    const expectedAttackResult = {
      hit: true,
      isSunk: false,
      type: ShipType.Carrier,
    };

    expect(shipType).toEqual(expectedAttackResult);
  });
});