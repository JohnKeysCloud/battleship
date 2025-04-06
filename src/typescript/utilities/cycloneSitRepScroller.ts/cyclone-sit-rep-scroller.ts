import {
  AttackResult,
  MessageSubject,
  MessageTarget,
  MessageType,
  PlayerType,
} from '../../types/state-types';
import { createElement, delay, waitForTransitionEnd } from '../random-utilities';
/* 
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ TODO: Make more reusable by enabling custom messages and adding         │
  │ default styles (i.e, a container width of 100% to match the container to| 
  | ensure that the scrolling aniamtion functions properly… considering it  │
  | runs on percengate-base x-axis translation).                            │
  └─────────────────────────────────────────────────────────────────────────┘
*/

/*
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ if (hit) <content> =                                                        │
  │ `${currentPlayer} hit your `${ship.type}!                                   │
  │ if (miss) <content> =                                                       │
  │ `${currentPlayer} missed! ${randomInsult} // switch statement with ai       │
  │  generated insults                                                          │
  └─────────────────────────────────────────────────────────────────────────────┘
*/

type SitRepType = 'current' | 'next';
interface ControlledSitRepElements {
  container: HTMLDivElement;
  current: HTMLDivElement;
  next: HTMLDivElement;
};

export class CycloneSitRepScroller {
  private static readonly MESSAGES = {
    TURN: {
      PLAYER: 'Waiting for your attack...',
      OPPONENT: 'Your opponent is attacking...',
    },
    ATTACK: {
      HIT: (subject: string, target: string, type: string) =>
        `${subject} hit ${target} ${type}!`,
      SUNK: (subject: string, target: string, type: string) =>
        `${subject} sunk ${target} ${type}!`,
      MISS: (subject: string) => `${subject} missed!`,
    },
  };

  private currentPlayer: PlayerType | null = null;
  private currentSitRep: string | null = null;
  private nextSitRep: string = '';

  private readonly sitRepContainer: HTMLDivElement;
  private readonly sitRepTextElements: {
    current: HTMLSpanElement;
    next: HTMLSpanElement;
  };

  #currentMessageType: MessageType = 'turn';

  constructor() {
    const { container, current, next }: ControlledSitRepElements =
      this.getControlledSitRepElements();

    console.log(container, current, next);

    this.sitRepContainer = container;
    this.sitRepTextElements = {
      current,
      next,
    };
  }

  get element() {
    return this.sitRepContainer;
  }

  public initialize = (firstPlayer: PlayerType): void => {
    this.currentPlayer = firstPlayer;
    this.setInitialTextContent(firstPlayer);
  };

  public readonly setAndScrollToNextSitRep = async (
    attackResult?: AttackResult
  ): Promise<void> => {
    const DELAY_AFTER_TRANSITION_SECONDS: number = 0.5;

    this.nextSitRep = attackResult
      ? this.getNextSitRep(attackResult)
      : this.getNextSitRep();

    this.sitRepTextElements.next.textContent = this.nextSitRep;
    this.sitRepContainer.classList.add('scrolling');

    // pauses execution until the transition ends
    await waitForTransitionEnd(this.sitRepContainer);

    this.resetSitRepContainer();

    await delay(DELAY_AFTER_TRANSITION_SECONDS * 1000); 
  };

  // 💭 --------------------------------------------------------------

  private readonly getAttackSitRep = (
    currentPlayer: PlayerType,
    attackResult: AttackResult
  ) => {
    const { hit, isSunk, type } = attackResult;

    const subject: MessageSubject =
      currentPlayer === 'player' ? 'You' : 'Your opponent';
    const target: MessageTarget = currentPlayer === 'player' ? 'their' : 'your';

    if (!hit || !type)
      return CycloneSitRepScroller.MESSAGES.ATTACK.MISS(subject);

    return isSunk
      ? CycloneSitRepScroller.MESSAGES.ATTACK.SUNK(subject, target, type)
      : CycloneSitRepScroller.MESSAGES.ATTACK.HIT(subject, target, type);
  };

  private readonly getNextSitRep = (attackResult?: AttackResult): string => {
    if (this.#currentMessageType === 'attack') this.toggleCurrentPlayer();
    this.toggleSitRepType();

    if (this.currentPlayer === null) {
      throw new Error(
        '`currentPlayer` cannot be null. Ensure it is assigned a valid `PlayerType` before retrieving the next sit rep.'
      );
    }

    return attackResult
      ? this.getAttackSitRep(this.currentPlayer, attackResult)
      : this.getTurnSitRep(this.currentPlayer);
  };

  private readonly getTurnSitRep = (currentPlayer: PlayerType): string =>
    currentPlayer === 'player'
      ? CycloneSitRepScroller.MESSAGES.TURN.PLAYER
      : CycloneSitRepScroller.MESSAGES.TURN.OPPONENT;

  private readonly resetSitRepContainer = () => {
    const { current, next } = this.sitRepTextElements;

    this.sitRepContainer.classList.remove('scrolling');

    this.currentSitRep = this.nextSitRep;
    current.textContent = this.currentSitRep;

    this.nextSitRep = '';
    next.textContent = this.nextSitRep;

    this.sitRepContainer.removeEventListener(
      'transitionend',
      this.resetSitRepContainer
    );
  };

  private readonly setInitialTextContent = (currentPlayer: PlayerType) => {
    const message: string =
      currentPlayer === 'player'
        ? CycloneSitRepScroller.MESSAGES.TURN.PLAYER
        : CycloneSitRepScroller.MESSAGES.TURN.OPPONENT;

    this.currentSitRep = message;
    this.sitRepTextElements.current.textContent = message;
  };

  private readonly toggleCurrentPlayer = (): void => {
    this.currentPlayer =
      this.currentPlayer === 'player' ? 'opponent' : 'player';
  };

  private readonly toggleSitRepType = (): void => {
    this.#currentMessageType =
      this.#currentMessageType === 'turn' ? 'attack' : 'turn';
  };

  // 💭 --------------------------------------------------------------

  private readonly getControlledSitRepElements = (): ControlledSitRepElements => {
      const sitRepContainerTypes: SitRepType[] = ['current', 'next'];
      const sitRepContainer = createElement('div', [], {
        id: 'sit-rep-container',
      });

      /* 
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │  We're using `null as unknown as HTMLDivElement` instead of a               │
    │  non-null assertion (`!`) to initialize the variables as `null`             │
    │  while ensuring TypeScript knows they'll be assigned an                     │
    │  `HTMLDivElement` later.                                                    │
    │                                                                             │
    │  The reason for using `unknown` is that `null` is not directly              | 
    │  assignable to a specific type (e.g., `HTMLDivElement`), but                 │
    │  `unknown` allows us to temporarily assign `null` and later                 │
    │  assert that the value will be of type `HTMLDivElement` once                │
    │  properly initialized.                                                      │
    |                                                                             |
    │  This approach is preferred over the non-null assertion                     │
    │  operator(`!`) because it is more explicit and type - safe.                 │
    |                                                                             |
    │  The non-null assertion simply tells TypeScript "I know this                │
    │  won't be `null` or `undefined`," but using `null as unknown as              │
    │  HTMLDivElement` provides a clearer path of the value being                 │
    │  safely initialized to an `HTMLDivElement` at a later point                 │
    │  in time. This reduces the risk of potential runtime errors.                │
    └─────────────────────────────────────────────────────────────────────────────┘
  */
      let currentTextContentElement: HTMLDivElement =
        null as unknown as HTMLDivElement;
      let nextTextContentElement: HTMLDivElement =
        null as unknown as HTMLDivElement;
      let currentSitRepContainer: HTMLDivElement =
        null as unknown as HTMLDivElement;
      let nextSitRepContainer: HTMLDivElement =
        null as unknown as HTMLDivElement;

      sitRepContainerTypes.forEach((type) => {
        const textContentElement: HTMLDivElement = createElement(
          'div',
          ['sit-rep-text-content'],
          {
            id: `${type}-sit-rep-text-content`,
          }
        );
        type === 'current'
          ? (currentTextContentElement = textContentElement)
          : (nextTextContentElement = textContentElement);

        const sitRepContentContainer: HTMLDivElement = createElement(
          'div',
          ['sit-rep-slot'],
          {
            id: `${type}-update-container`,
          }
        );
        type === 'current'
          ? (currentSitRepContainer = sitRepContentContainer)
          : (nextSitRepContainer = sitRepContentContainer);

        sitRepContentContainer.appendChild(textContentElement);
      });

      sitRepContainer.append(nextSitRepContainer, currentSitRepContainer);

      return {
        container: sitRepContainer,
        current: currentTextContentElement,
        next: nextTextContentElement,
      };
    };
}
