import { GamePhase, CurrentPlayer, gameboardStateValue } from "../types/state-types";
import EventBus from "../utilities/event-bus";
import { FleetVersion } from "../types/logic-types";

export class GameState {
  public currentGamePhase: GamePhase = 'parabellum';
  public currentPlayer: CurrentPlayer = null;
  public static getInitialPlayer(): CurrentPlayer {
    return Math.random() > 0.5 ? 'player' : 'opponent';
  }

  constructor(
    public readonly isMultiplayer: boolean,
    public readonly eventBus: EventBus,
    public readonly version: FleetVersion
  ) {}

  // ! connect
  // Reset the game state and notify subscribers
  public resetGameState = (): void => {
    this.currentGamePhase = 'parabellum';
    this.currentPlayer = null;
    // Emit a game reset event
    this.eventBus.emit('gameReset');
  };

  public setInitialPlayer = (): void => {
    this.currentPlayer = GameState.getInitialPlayer();
  };

  public toggleGameboardControls = (): void => {
    const isPlayer = this.currentPlayer === 'player';

    if (isPlayer) {
      // NOTE: We don’t need to explicitly disable the opponent's gameboard here.
      //
      // Reason:
      // • On a valid player click, the opponent’s gameboard listeners are immediately removed
      //   at the end of that turn.
      // • `togglePlayerTurn()` is called afterward in the same click listener. It awaits
      //   `updateUIActiveGameboard()` before toggling gameboard controls, so we purposely
      //   re-enabled the opponent's gameboard beforehand to avoid waiting for that UI transition.
      //
      // This design staggers the updates for pointer-events on the player’s gameboard
      // because they don’t need to be instantly disabled — their interactivity is purely cosmetic.
      // Opponent gameboard controls are already off at this point; we only re-enable them
      // when it becomes the opponent's turn.
      // (See `opponent-gameboard-component.ts` line 377)

      this.eventBus.emit(
        'toggleOpponentGameboardControls',
        gameboardStateValue.active
      );
    }

    this.eventBus.emit(
      'togglePlayerGameboardControls',
      isPlayer
        ? gameboardStateValue.inactive
        : gameboardStateValue.active
    );
  };

  public togglePlayerTurn = async (): Promise<void> => {
    this.currentPlayer =
      this.currentPlayer === 'player' ? 'opponent' : 'player';

    this.eventBus.emit('setAndScrollToNextSitRep');
    await this.updateUIActiveGameboard();
    this.toggleGameboardControls();

    if (!this.isMultiplayer && this.currentPlayer === 'opponent') {
      await this.eventBus.emit('billowAttack');
    }
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

  public updateUIActiveGameboard = async (): Promise<void> => {
    await this.eventBus.emit('updateUIActiveGameboard');
  };
}

