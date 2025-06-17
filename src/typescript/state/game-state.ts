import { AttackResult, CurrentPlayer, GamePhase, PlayerType } from "../types/state-types";
import EventBus from "../utilities/event-bus";
export class GameState {
  public currentGamePhase: GamePhase = 'parabellum';
  public currentPlayer: CurrentPlayer = null;
  public static getInitialPlayer(): CurrentPlayer {
    return Math.random() > 0.5 ? 'player' : 'opponent';
  }

  constructor(
    public readonly isMultiplayer: boolean,
    public readonly eventBus: EventBus
  ) {}

  public setAndScrollToNextSitRep = (attackResult?: AttackResult): void => {
    this.eventBus.emit('setAndScrollToNextSitRep', attackResult);
  };

  public transitionToNextPhase = (): void => {
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
    // Emit the event with the new game phase
    this.eventBus.emit('transitionToNextPhase');
  };

  public switchGameboardControls = (): void => {
    this.eventBus.emit('switchGameboardControls', this.currentPlayer);
  };

  public togglePlayerTurn = (): void => {
    this.currentPlayer =
      this.currentPlayer === 'player' ? 'opponent' : 'player';

    this.eventBus.emit('setAndScrollToNextSitRep');
    this.eventBus.emit('updateUIActiveGameboard');

    if (!this.isMultiplayer && this.currentPlayer === 'opponent') {
      this.eventBus.emit('billowAttack');
    }
  };

  // ! connect
  // Reset the game state and notify subscribers
  public resetGameState = (): void => {
    this.currentGamePhase = 'parabellum';
    this.currentPlayer = null;
    // Emit a game reset event
    this.eventBus.emit('gameReset');
  };

  // ! connect
  // Set the initial player and notify subscribers
  public setInitialPlayer = (): void => {
    this.currentPlayer = GameState.getInitialPlayer();
    // Emit the event with the initial player
    this.eventBus.emit('playerTurnChange', this.currentPlayer);
  };
}

