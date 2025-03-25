import {
  Coordinates,
  Gameboard,
  ShipSymbolValue,
  ShipSymbolValueArray
} from '../../../../types/logic-types';
import {
  createElement
} from '../../../../utilities/random-utilities';
import { PlayerState } from '../../../../types/state-types';
import '../gameboard-component.scss';
import '../gameboard-animations.scss';

export class OpponentGameboardComponent {
  private readonly id: string = 'opponent';
  private gameboardContainer: HTMLDivElement;

  private listenersAdded: boolean = false;

  constructor(public readonly playerState: PlayerState) {
    this.gameboardContainer = this.generateBoardContainer(
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

    this.toggleGameboardContainerEventListeners();

    this.gameboardContainer.appendChild(gameboard);

    targetElement.appendChild(this.gameboardContainer);
  }

  public toggleGameboardContainerEventListeners(): void {
    if (!this.gameboardContainer) return;

    const method = this.listenersAdded
      ? 'removeEventListener'
      : 'addEventListener';
    
    this.gameboardContainer[method]('click', this.handleCellClick as EventListener);
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

  private handleCellClick = (e: MouseEvent): void => {
    if (
      !(e.target instanceof HTMLDivElement) ||
      !e.target.matches('.grid-cell')
    ) return;

    const gridCell: HTMLDivElement = e.target;

    const dataX = gridCell.getAttribute('data-x');
    const dataY = gridCell.getAttribute('data-y');

    if (dataX === null || dataY === null) {
      throw new Error('Man wtf');
    }

    const coordinates: Coordinates = [+dataX, +dataY];
    
    // !
    this.playerState.gameboardController.receiveAttack(coordinates);
    // ? does this return whether or not a ship is sunk?
    // ? if so, then I can use that to update the UI
    // ? if not, then I need to update the UI to show a miss
    // ? if a ship is sunk, then I need to update the UI to show a sunken ship
    // ? check if the player has won too bitch
  };

  // 💭 --------------------------------------------------------------
  // 💭 Utilities

  // TODO: Do I need this
  public getId(): string {
    return this.id;
  }
}


// TODO: add click listener that receieves an attack, toggles the state (updating main container one), etc.
