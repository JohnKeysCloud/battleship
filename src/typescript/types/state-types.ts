import { BattleshipBoardBuilder } from '../logic/bs-gameboard-builder/bs-gameboard-builder';
import { Fleet } from './logic-types';

export interface PlayerState {
  gameboardInstance: BattleshipBoardBuilder;
  fleet: Fleet;
};
