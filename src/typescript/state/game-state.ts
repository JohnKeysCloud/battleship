import { CurrentPlayer, GamePhase } from "../types/state-types";

export class GameState {
  public currentGamePhase: GamePhase = 'parabellum';
  public currentPlayer: CurrentPlayer = null;

  public static getInitialPlayer(): CurrentPlayer {
    return Math.random() > 0.5 ? 'player' : 'opponent';
  }

  constructor() {}

  public setNextPhase = (): void => {
    switch (this.currentGamePhase) {
      case 'parabellum':
        this.currentGamePhase = 'bellum';
        break;
      case 'bellum':
        this.currentGamePhase = 'postBellum';
        break;
      case 'postBellum':
        this.currentGamePhase = 'parabellum';
        break;
    }
  }

  public toggleCurrentPlayer = (): void => {
    this.currentPlayer =
      this.currentPlayer === 'player' ? 'opponent' : 'player';
  }

  public resetGameState = (): void => {
    this.currentGamePhase = 'parabellum';
    this.currentPlayer = null;
  }

  public setInitialPlayer = (): void => {
    this.currentPlayer = GameState.getInitialPlayer();
  }
}
