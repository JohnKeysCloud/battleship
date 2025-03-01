import { BattleshipFleetBuilder } from '../logic/bs-fleet-builder/bs-fleet-builder';
import { BattleshipBoardBuilder } from '../logic/bs-gameboard-builder/bs-gameboard-builder';
import { BattleshipBoardController } from '../logic/bs-gameboard-controller/bs-gameboard-controller';
import { BattleshipBoardRepository } from '../logic/bs-gameboard-repository/bs-gameboard-repository';

export interface PlayerState {
  gameboardBuilder: BattleshipBoardBuilder;
  gameboardController: BattleshipBoardController;
  gameboardRepository: BattleshipBoardRepository;
  fleetBuilder: BattleshipFleetBuilder;
};

export type PlayerType = 'player' | 'opponent';
export type CurrentPlayer = PlayerType | null;
export type GamePhase = 'parabellum' | 'bellum' | 'postBellum';