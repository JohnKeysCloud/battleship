import {
  Gameboard,
  ShipSymbolValue,
  ShipSymbolValueArray
} from '../../types/logic-types';
import {
  createElement
} from '../../utilities/random-utilities';
import { PlayerState } from '../../types/state-types';

export class OpponentGameboardComponent {
  private readonly id: string = 'opponent';
  private boardContainer: HTMLDivElement;

  constructor(
    public readonly playerState: PlayerState
  ) {
    this.boardContainer = this.generateBoardContainer(
      this.playerState.gameboardBuilder.boardSize
    );
  }

  public render(targetElement: HTMLElement): void {
    if (!targetElement) {
      throw new Error(
        `Target element not found with ID - ${this.id} and selector - "${targetElement}".`
      );
    }

    const gameboard: DocumentFragment = this.generateBoardFragment(
      this.playerState.gameboardBuilder.boardSize
    );

    this.boardContainer.appendChild(gameboard);
    
    targetElement.appendChild(this.boardContainer);
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
          [`${this.id}-cell`, 'grid-cell'],
          {
            'data-x': colIndex.toString(),
            'data-y': rowIndex.toString(),
            'aria-label': `Row ${rowIndex + 1}, Column ${colIndex + 1}`,
            role: 'gridCell',
          }
        );

        const gridCellContainer: HTMLDivElement = createElement('div', [
          `${this.id}-grid-cell-container`,
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
        id: `${this.id}-gameboard-container`,
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
        id: `${this.id}-gameboard-background`,
      }
    );
    gameboardBackground.appendChild(
      this.createBackgroundCellsFragment(
        this.playerState.gameboardBuilder.board
      )
    );

    const gameboard = createElement('div', ['gameboard'], {
      id: `${this.id}-gameboard`,
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
