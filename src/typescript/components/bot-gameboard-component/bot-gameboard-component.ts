import {
  Gameboard,
  ShipSymbolValue,
  ShipSymbolValueArray
} from '../../types/logic-types';
import {
  createElement,
  createIdentifier,
} from '../../utilities/random-utilities';
import { PlayerState } from '../../types/state-types';

export class BotGameboardComponent {
  private boardContainer: HTMLDivElement;

  constructor(
    private readonly id: string,
    public readonly playerState: PlayerState
  ) {
    this.boardContainer = this.generateBoardContainer(
      this.playerState.gameboardBuilder.boardSize
    );
  }

  public render(targetSelector: string): void {
    const target: HTMLElement | null = document.querySelector(targetSelector);

    if (!target) {
      throw new Error(
        `Target element not found with ID - ${this.id} and selector - "${targetSelector}".`
      );
    }

    const gameboard: DocumentFragment = this.generateBoardFragment(
      this.playerState.gameboardBuilder.boardSize
    );

    this.boardContainer.appendChild(gameboard);

    target.appendChild(this.boardContainer);
  }

  // 💭 --------------------------------------------------------------
  // 💭 Helpers

  private createBackgroundCellsFragment(
    gameboard: Gameboard
  ): DocumentFragment {
    const cellFragment: DocumentFragment = new DocumentFragment();

    gameboard.forEach((row: ShipSymbolValueArray, rowIndex: number) => {
      row.forEach((_: ShipSymbolValue, colIndex: number) => {
        const gridCell: HTMLDivElement = createElement(
          'div',
          [
            `${createIdentifier(this.id, 'bot')}-cell`,
            'grid-cell',
          ],
          {
            'data-x': colIndex.toString(),
            'data-y': rowIndex.toString(),
            'aria-label': `Row ${rowIndex + 1}, Column ${colIndex + 1}`,
            role: 'gridCell',
          }
        );

        const gridCellContainer: HTMLDivElement = createElement('div', [
          createIdentifier(
            this.id,
            'bot',
            `grid-cell-container`
          ),
          'grid-cell-container',
        ]);

        gridCellContainer.appendChild(gridCell);
        cellFragment.appendChild(gridCellContainer);
      });
    });

    return cellFragment;
  }

  private generateBoardContainer(boardSize: number): HTMLDivElement {
    const gameboardContainer: HTMLDivElement = createElement(
      'div',
      ['gameboard-container'],
      {
        id: createIdentifier(this.id, 'bot', 'gameboard-container'),
      }
    );

    gameboardContainer.style.setProperty('--grid-size', boardSize.toString());

    return gameboardContainer;
  }

  private generateBoardFragment(boardSize: number): DocumentFragment {
    const gameboardBackground: HTMLDivElement = createElement(
      'div',
      ['gameboard-background'],
      {
        id: createIdentifier(this.id, 'bot', 'gameboard-background'),
      }
    );
    gameboardBackground.appendChild(
      this.createBackgroundCellsFragment(
        this.playerState.gameboardBuilder.board
      )
    );

    const gameboard = createElement('div', ['gameboard'], {
      id: createIdentifier(this.id, 'bot', 'gameboard'),
    });
    gameboard.style.setProperty('--grid-size', boardSize.toString());

    const boardFragment: DocumentFragment = new DocumentFragment();
    boardFragment.append(gameboardBackground, gameboard);

    return boardFragment;
  }

  // 💭 --------------------------------------------------------------
  // 💭 Utilities

  // TODO: Do I need this
  public getId(): string {
    return this.id;
  }
}
