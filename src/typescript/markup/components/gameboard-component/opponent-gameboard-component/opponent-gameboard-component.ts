import {
  Coordinates,
  CoordinatesArray,
  Fleet,
  Gameboard,
  IPlacementConfigurations,
  Orientation,
  ShipLength,
  ShipSymbolValue,
  ShipSymbolValueArray,
  ShipType,
} from '../../../../types/logic-types';
import {
  createElement,
  waitForTransitionEnd,
  delay,
  waitForEvent,
} from '../../../../utilities/random-utilities';
import { AttackResult, PlayerState, gameboardStateValue } from '../../../../types/state-types';
import '../gameboard-component.scss';
import '../gameboard-animations.scss';

import { isShipType } from '../../../../types/type-guards';
import { BattleshipBuilder } from '../../../../logic/bs-ship-builder/bs-ship-builder';
import { GridPlacementValue } from '../../../../types/css-types';
import { BattleshipFleetBuilder } from '../../../../logic/bs-fleet-builder/bs-fleet-builder';
import { GameState } from '../../../../state/game-state';

export class OpponentGameboardComponent {
  private readonly id: string = 'opponent';

  private gameboardContainer: HTMLDivElement;
  private fleetElements: Map<ShipType, HTMLDivElement> = new Map();

  constructor(
    public readonly playerState: PlayerState,
    private readonly gameState: GameState
  ) {
    this.gameboardContainer = this.generateBoardContainer(
      this.playerState.gameboardBuilder.boardSize
    );

    this.updateFleetElements(this.playerState.fleetBuilder);

    this.gameState.eventBus.on(
      'toggleOpponentGameboardControls',
      this.toggleGameboardControls
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
    this.gameboardContainer.appendChild(gameboard);

    this.placeFleetOnGameboard(this.fleetElements);

    targetElement.appendChild(this.gameboardContainer);
  }

  public toggleBellumListeners = (newGameboardState: gameboardStateValue): void => {
    if (!this.gameboardContainer) return;

    const method = newGameboardState === gameboardStateValue.inactive
      ? 'removeEventListener'
      : 'addEventListener';

    this.gameboardContainer[method](
      'click',
      this.handleCellClick as EventListener
    );
  };

  // 💭 --------------------------------------------------------------
  // 💭 Helpers

  private checkForWin(): boolean {
    if (!this.playerState.gameboardRepository.areAllShipsSunk()) return false;

    // TODO: Do something fun with this value.. set winner in repository ?
    alert(
      `${
        this.gameState.currentPlayer === 'player' ? 'You win' : 'You lose'
      } mother fucker! #TYPESHIT`
    );

    this.gameState.transitionToNextPhase();

    return true;
  }

  private createBackgroundCellsFragment(
    gameboard: Gameboard
  ): DocumentFragment {
    const cellFragment: DocumentFragment = new DocumentFragment();

    gameboard.forEach((row: ShipSymbolValueArray, rowIndex: number) => {
      // ? The ship symbol value isn't used to classify opponent board grid cells,
      // ? otherwise players could inspect dev tools and see where the opponent's ships are.
      row.forEach((_: ShipSymbolValue, colIndex: number) => {
        const hitMarker: HTMLDivElement = createElement('div', [
          `${this.id}-hit-marker`,
          'hit-marker',
        ]);

        const gridCell: HTMLDivElement = createElement(
          'div',
          [`${this.id}-grid-cell`, 'grid-cell'],
          {
            'data-x': colIndex.toString(),
            'data-y': rowIndex.toString(),
            'aria-label': `Row ${rowIndex + 1}, Column ${colIndex + 1}`,
            role: 'gridCell',
          }
        );
        gridCell.appendChild(hitMarker);

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

  private createShipElement(
    shipType: ShipType,
    shipLength: ShipLength,
    orientation: Orientation
  ): HTMLDivElement {
    const shipUnitFragment: DocumentFragment = this.generateShipUnitFragment(
      shipLength,
      shipType,
      orientation,
      this.id
    );

    const shipContainerElement: HTMLDivElement = createElement(
      'div',
      ['opponent-ship-container'],
      {
        id: `${this.id}-${shipType}-container`,
      }
    );
    shipContainerElement.appendChild(shipUnitFragment);

    return shipContainerElement;
  }

  private generateBoardContainer(boardSize: number): HTMLDivElement {
    const gameboardContainer: HTMLDivElement = createElement(
      'div',
      ['gameboard-container', 'locked'],
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

    this.fleetElements.forEach((shipContainerElement) => {
      gameboard.appendChild(shipContainerElement);
    });

    const boardFragment: DocumentFragment = new DocumentFragment();
    boardFragment.append(gameboardBackground, gameboard);

    return boardFragment;
  }

  private generateShipUnitFragment(
    shipLength: ShipLength,
    shipType: ShipType,
    orientation: Orientation,
    id: string
  ): DocumentFragment {
    const shipUnitFragment: DocumentFragment = new DocumentFragment();

    for (let i = 0; i < shipLength; i++) {
      const isBow: boolean = i === 0;
      const isStern: boolean = i === shipLength - 1;
      const shipUnit: HTMLDivElement = createElement('div', [
        'ship-unit',
        `${shipType}-unit`,
        `${id}-${shipType}-unit`,
      ]);

      const isHorizontal: boolean = orientation === 'horizontal';

      isHorizontal
        ? shipUnit.classList.add('ship-unit-horizontal')
        : shipUnit.classList.add('ship-unit-vertical');

      if (isBow) {
        shipUnit.classList.add('ship-bow');
        shipUnit.setAttribute('id', `${id}-${shipType}-bow`);
      }

      if (isStern) {
        shipUnit.classList.add('ship-stern');
        shipUnit.setAttribute('id', `${id}-${shipType}-stern`);
      }

      shipUnitFragment.appendChild(shipUnit);
    }

    return shipUnitFragment;
  }

  private getAndSetGridPlacementValue(
    shipContainerElement: HTMLDivElement,
    bowCoordinates: Coordinates,
    orientation: Orientation,
    shipLength: ShipLength
  ): void {
    const [gridPlacementValue, gridCrossAxis]: [GridPlacementValue, number] =
      this.getGridPlacementValue(bowCoordinates, orientation, shipLength);

    this.setGridPlacementValue(
      gridPlacementValue,
      gridCrossAxis,
      shipContainerElement,
      orientation,
      shipLength
    );
  }

  private getAttackCoordinates(gridCell: HTMLDivElement): Coordinates {
    const dataX = gridCell.getAttribute('data-x');
    const dataY = gridCell.getAttribute('data-y');

    if (dataX == null || dataY == null) {
      throw new Error('Could not retrieve coordinates from grid cell.');
    }

    return [+dataX, +dataY];
  }

  private getGridPlacementValue(
    coordinates: Coordinates,
    orientation: Orientation,
    shipLength: ShipLength
  ): [GridPlacementValue, number] {
    const isHorizontal = orientation === 'horizontal';

    const [x, y] = coordinates;
    const gridStartMain = isHorizontal ? x + 1 : y + 1;
    const gridCrossAxis = isHorizontal ? y + 1 : x + 1;

    return [`${gridStartMain} / span ${shipLength}`, gridCrossAxis];
  }

  private getShipGridPlacementData(ship: BattleshipBuilder): {
    bowCoordinates: Coordinates;
    orientation: Orientation;
    shipLength: ShipLength;
  } {
    const placementConfigurations: IPlacementConfigurations =
      ship.currentplacementConfigurations;

    if (
      !placementConfigurations.coordinatesArray ||
      !placementConfigurations.orientation
    )
      throw new Error(`The ${ship.type} has no placement configurations.`);

    const bowCoordinates: Coordinates =
      placementConfigurations.coordinatesArray[0];
    const orientation: Orientation = placementConfigurations.orientation;

    const shipLength: ShipLength = ship.length;

    return {
      bowCoordinates,
      orientation,
      shipLength,
    };
  }

  private handleCellClick = (e: MouseEvent): void => {
    this.receiveAttack(e);
  };

  private async handleShipUnitCooked(
    shipContainerElement: HTMLDivElement
  ): Promise<void> {
    const shipUnits = Array.from(
      shipContainerElement.children
    ) as HTMLElement[];

    // Stagger animations
    shipUnits.forEach((unit, i) => {
      setTimeout(() => {
        unit.classList.add('cooked');
      }, 333 * (i + 1));
    });

    const lastUnit = shipUnits[shipUnits.length - 1];

    // Wait for the animation of the last unit to end
    await waitForTransitionEnd(lastUnit);
  }

  private hasTargetBeenAttacked(coordinates: Coordinates): boolean {
    const alreadyAttacked =
      this.playerState.gameboardRepository.hasTargetBeenAttacked(coordinates);

    if (!alreadyAttacked) {
      this.playerState.gameboardRepository.addAttackedCoordinates(coordinates);
    }

    return alreadyAttacked;
  }

  private placeFleetOnGameboard(
    fleetElements: Map<ShipType, HTMLDivElement>
  ): void {
    const gameboard =
      this.gameboardContainer.querySelector<HTMLDivElement>('.gameboard');

    if (!gameboard) {
      throw new Error('Gameboard container not found.');
    }

    fleetElements.forEach((shipElement) => gameboard.appendChild(shipElement));
  }

  private async receiveAttack(e: MouseEvent): Promise<void> {
    if (
      !(e.target instanceof HTMLDivElement) ||
      !e.target.matches('.grid-cell')
    )
      return;

    const gridCell: HTMLDivElement = e.target;

    const attackCoordinates: Coordinates = this.getAttackCoordinates(gridCell);

    if (this.hasTargetBeenAttacked(attackCoordinates)) {
      // TODO: Add a flash animation to indicate "Cell already attacked".
      return;
    }

    this.toggleBellumListeners(gameboardStateValue.inactive);
    this.toggleGameboardControls(gameboardStateValue.inactive);
    
    const attackResult: AttackResult =
    this.playerState.gameboardController.receiveAttack(attackCoordinates);
    
    try {
      await this.triggerPrePlayerToggleAnimations(attackResult, gridCell);
    } catch (error) {
      console.error('Animation failed', error);
    }
    
    this.togglePlayerTurn(attackResult); 
  }

  private setGridPlacementValue(
    gridPlacementValue: GridPlacementValue,
    gridCrossAxis: number,
    shipContainerElement: HTMLDivElement,
    orientation: Orientation,
    shipLength: ShipLength
  ): void {
    const isHorizontal: boolean = orientation === 'horizontal';
    if (isHorizontal) {
      shipContainerElement.style.gridColumn = gridPlacementValue;
      shipContainerElement.style.gridRow = gridCrossAxis.toString();
      shipContainerElement.style.gridTemplateColumns = `repeat(${shipLength}, 1fr)`;
    } else {
      shipContainerElement.style.gridRow = gridPlacementValue;
      shipContainerElement.style.gridColumn = gridCrossAxis.toString();
      shipContainerElement.style.gridTemplateRows = `repeat(${shipLength}, 1fr)`;
    }
  }

  private sinkShip = async (
    shipContainerElement: HTMLDivElement
  ): Promise<void> => {
    const DELAY_AFTER_TRANSITION_SECOND: number = 1;

    shipContainerElement.classList.add('sunk');

    await waitForEvent(shipContainerElement, 'animationend');

    await this.handleShipUnitCooked(shipContainerElement);

    await delay(DELAY_AFTER_TRANSITION_SECOND * 1000);
  };

  private toggleGameboardControls = (
    newGameboardState: gameboardStateValue
  ): void => {
    if (newGameboardState === gameboardStateValue.active) {
      this.toggleBellumListeners(newGameboardState);
    }

    this.gameboardContainer.classList.toggle(
      'locked',
      newGameboardState === gameboardStateValue.inactive
    );
  };

  private togglePlayerTurn(attackResult: AttackResult): void {
    const { hit, isSunk } = attackResult;

    if ((hit && !isSunk) || !hit) {
      this.gameState.togglePlayerTurn();
      return;
    }

    if (hit && isSunk) {
      const gameOver = this.checkForWin();
      if (!gameOver) {
        this.gameState.togglePlayerTurn();
        return;
      }

      // ? if it is game over, do some shit
    }
  }

  private triggerPrePlayerToggleAnimations = async (
    attackResult: AttackResult,
    gridCell: HTMLDivElement
  ): Promise<void> => {
    if (attackResult.isSunk) {
      this.gameState.eventBus.emit('setAndScrollToNextSitRep', attackResult);
      await this.updateGameboardPostAttack(attackResult, gridCell);
    } else {
      this.updateGameboardPostAttack(attackResult, gridCell);
      await this.gameState.eventBus.emit(
        'setAndScrollToNextSitRep',
        attackResult
      );
    }
  };

  private updateFleetElements(fleetBuilder: BattleshipFleetBuilder): void {
    const fleet: Fleet = fleetBuilder.fleet;

    for (const ship of Object.values(fleet)) {
      const shipType: ShipType = ship.type;
      const shipLength: ShipLength = ship.length;

      const orientation: Orientation | null =
        ship.currentplacementConfigurations.orientation;

      if (!orientation) throw new Error('Orientation not set.');

      const coordinatesArray: CoordinatesArray | null =
        ship.currentplacementConfigurations.coordinatesArray;

      if (!coordinatesArray || coordinatesArray.length === 0) {
        console.error(`The ${shipType} has not been placed. Continuing...`);
        continue;
      }

      const shipContainerElement: HTMLDivElement = this.createShipElement(
        shipType,
        shipLength,
        orientation
      );

      this.fleetElements.set(shipType, shipContainerElement);
    }
  }

  private updateGameboardPostAttack = async (
    attackResult: AttackResult,
    gridCell: HTMLDivElement
  ): Promise<void> => {
    const { hit, isSunk, type } = attackResult;

    if (!hit) {
      gridCell.classList.add('miss');
    }

    if (hit && !isSunk) {
      gridCell.classList.add('hit');
    }

    if (hit && isSunk) {
      if (!isShipType(type))
        throw new Error(`The ${type} is not a valid ship type.`);

      gridCell.classList.add('hit');
      const ship: BattleshipBuilder =
        this.playerState.fleetBuilder.getShip(type);

      const { bowCoordinates, orientation, shipLength } =
        this.getShipGridPlacementData(ship);

      if (!this.fleetElements.has(ship.type)) {
        throw new Error(`The ${ship.type} has no fleet element.`);
      }

      const shipContainerElement = this.fleetElements.get(ship.type);

      if (!shipContainerElement) {
        throw new Error(`The ${ship.type} has no fleet element.`);
      }

      this.getAndSetGridPlacementValue(
        shipContainerElement,
        bowCoordinates,
        orientation,
        shipLength
      );

      await this.sinkShip(shipContainerElement);
    }
  };

  // 💭 --------------------------------------------------------------
  // 💭 Utilities

  // TODO: Do I need this
  public getId(): string {
    return this.id;
  }
}

// TODO: add click listener that receieves an attack, toggles the state (updating main container one), etc.
