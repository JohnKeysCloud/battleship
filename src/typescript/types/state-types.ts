import { BattleshipBoardBuilder } from '../logic/bs-gameboard-builder/bs-gameboard-builder';
import { BattleshipBoardController } from '../logic/bs-gameboard-controller/bs-gameboard-controller';
import { Fleet } from './logic-types';

export interface PlayerState {
  gameboardBuilder: BattleshipBoardBuilder;
  gameboardController: BattleshipBoardController;
  fleet: Fleet;
};
