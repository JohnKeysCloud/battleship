import { BattleshipFleetBuilder } from '../logic/bs-fleet-builder/bs-fleet-builder';
import { BattleshipBoardBuilder } from '../logic/bs-gameboard-builder/bs-gameboard-builder';
import { BattleshipBoardController } from '../logic/bs-gameboard-controller/bs-gameboard-controller';
import { BattleshipBoardRepository } from '../logic/bs-gameboard-repository/bs-gameboard-repository';
import { ShipType } from './logic-types';

// 💭 --------------------------------------------------------------

export type AttackResult = {
  hit: boolean;
  isSunk?: boolean;
  type?: ShipType;
};
export type CurrentPlayer = PlayerType | null;
export type GamePhase = 'parabellum' | 'bellum' | 'postBellum';
export type MessageSubject = 'You' | 'Your opponent';
export type MessageTarget = 'your' | 'their'; 
export type MessageType = 'turn' | 'attack';
export type PlayerType = 'player' | 'opponent';

export enum gameboardStateValue {
  inactive = 0,
  active = 1,
}
// 💭 --------------------------------------------------------------

export interface PlayerContext {
  gameboardBuilder: BattleshipBoardBuilder;
  gameboardController: BattleshipBoardController;
  gameboardRepository: BattleshipBoardRepository;
  fleetBuilder: BattleshipFleetBuilder;
};

export interface PlayerCore {
  player: PlayerContext;
  opponent: PlayerContext;
}