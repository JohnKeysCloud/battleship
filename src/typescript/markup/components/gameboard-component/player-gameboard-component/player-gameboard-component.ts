// 💭 State
import { GameState } from '../../../../state/game-state';

// 💭 Logic
import { BattleshipBuilder } from '../../../../logic/bs-ship-builder/bs-ship-builder';
import { BattleshipFleetBuilder } from '../../../../logic/bs-fleet-builder/bs-fleet-builder';
import { BattleshipBoardController } from '../../../../logic/bs-gameboard-controller/bs-gameboard-controller';

// 💭 Types
import {
  isOrientation,
  isShipLength,
  isShipType,
} from '../../../../types/type-guards'
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
  } from '../../../../types/logic-types'
import {
  AttackResult,
  CurrentPlayer,
  PlayerState,
} from '../../../../types/state-types';
import { GridCellDataKey } from '../../../../types/dom-types';
import {
  CloneSnapOffset,
  DragState,
  ShipBorderValueSplit,
} from '../../component-types';
import { GridPlacementValue } from '../../../../types/css-types';

// 💭 Utilities
import {
  areArraysEqual,
  createElement,
  delay,
  getConvertedTypeFromAttr,
  waitForEvent,
  waitForTransitionEnd,
} from '../../../../utilities/random-utilities';

// 💭 Stylesheets
import '../gameboard-component.scss';
import '../gameboard-animations.scss';

// 💭 --------------------------------------------------------------

export class PlayerGameboardComponent {
  public id: string = 'player';

  // 💭 Elements
  public gameboardContainer: HTMLElement;
  private gameboard: DocumentFragment;
  private fleetElements: Map<ShipType, HTMLDivElement> = new Map();
  private dragImage: HTMLImageElement;
  private shipDragClone: HTMLDivElement;

  // 💭 Event listeners
  private listenersAdded: boolean = false;
  private dragState: DragState = {
    currentShipInstance: null,
    initialPlacementConfigurations: null,
    isValidDropTarget: false,
    currentDragOverCell: null,
    cloneSnapOffset: null,
    shipBorderValueSplit: null,
  };
  private dragEventCallbacks: Record<string, (e: DragEvent) => void> = {
    dragstart: (e: DragEvent) => this.handleShipDragStart(e, this.dragState),
    drag: (e: DragEvent) => this.handleShipDrag(e, this.dragState),
    dragenter: (e: DragEvent) => this.handleShipDragEnter(e),
    dragleave: (e: DragEvent) => this.handleShipDragLeave(e),
    dragover: (e: DragEvent) => this.handleShipDragOver(e, this.dragState),
    drop: (e: DragEvent) => this.handleShipDrop(e, this.dragState),
    dragend: (e: DragEvent) => this.handleShipDragEnd(e, this.dragState),
  };

  constructor(
    public readonly playerState: PlayerState,
    private readonly gameState: GameState
  ) {
    this.gameboardContainer = this.generateBoardContainer(
      this.playerState.gameboardBuilder.boardSize
    );

    this.gameboard = this.generateBoardFragment(
      this.playerState.gameboardBuilder.boardSize
    );
    this.dragImage = this.createDragImage();
    this.shipDragClone = this.createShipDragClone();

    this.gameState.eventBus.on(
      'refreshGameboard',
      this.refreshGameboardWrapper
    );
    this.gameState.eventBus.on('switchGameboardControls', this.toggleGameboardControls);
    this.gameState.eventBus.on('receiveBillowAttack', this.receiveAttack);
  }

  public render(targetElement: HTMLElement): void {
    if (!targetElement) {
      throw new Error(
        `Target element not found with ID - ${this.id} and selector - "${targetElement}".`
      );
    }

    this.gameboardContainer.append(
      this.dragImage,
      this.shipDragClone,
      this.gameboard
    );
    this.handleFleetPlacement(
      this.playerState.fleetBuilder,
      this.fleetElements
    );
    this.toggleParabellumListeners();

    targetElement.appendChild(this.gameboardContainer);
  }

  public toggleParabellumListeners(): void {
    if (!this.gameboardContainer) return;

    const method = this.listenersAdded
      ? 'removeEventListener'
      : 'addEventListener';

    // * Toggle Drag Events
    Object.entries(this.dragEventCallbacks).forEach(([event, callback]) => {
      this.gameboardContainer[method](event, callback as EventListener);
    });

    // * Toggle Rotation Event
    this.gameboardContainer[method](
      'click',
      this.handleShipRotation as EventListener
    );

    this.listenersAdded = !this.listenersAdded;
  }

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

  public toggleShipsDraggable(): void {
    this.fleetElements.forEach((shipElement) => {
      shipElement.removeAttribute('draggable');
    });
  }

  public toggleShipAdriftClass(): void {
    this.fleetElements.forEach((shipElement) => {
      shipElement.classList.remove('adrift');
    });
  }

  // 💭 --------------------------------------------------------------
  // 💭 Helpers

  private applyGridPlacementValue(
    gridPlacementValue: GridPlacementValue,
    gridCrossAxis: number,
    shipElement: HTMLDivElement,
    orientation: Orientation,
    shipLength: ShipLength
  ): void {
    const isHorizontal: boolean = orientation === 'horizontal';
    if (isHorizontal) {
      shipElement.style.gridColumn = gridPlacementValue;
      shipElement.style.gridRow = gridCrossAxis.toString();
      shipElement.style.gridTemplateColumns = `repeat(${shipLength}, 1fr)`;
    } else {
      shipElement.style.gridRow = gridPlacementValue;
      shipElement.style.gridColumn = gridCrossAxis.toString();
      shipElement.style.gridTemplateRows = `repeat(${shipLength}, 1fr)`;
    }
  }

  // TODO: move this to game state
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

  private createDragImage(): HTMLImageElement {
    const invisibleImage = createElement(
      'img',
      ['drag-image', 'accessibility'],
      {
        id: `${this.id}-drag-image`,
        src: 'https://cyclone-studios.s3.us-east-2.amazonaws.com/s3_misc-images/1x1_transparent.png',
      }
    );

    return invisibleImage;
  }

  private createShipDragClone(): HTMLDivElement {
    const shipCloneElement: HTMLDivElement = createElement(
      'div',
      ['ship-container-clone'],
      {
        id: `${this.id}-ship-drag-clone`,
      }
    );

    return shipCloneElement;
  }

  private createBackgroundCellsFragment(
    gameboard: Gameboard
  ): DocumentFragment {
    const cellFragment: DocumentFragment = new DocumentFragment();

    gameboard.forEach((row: ShipSymbolValueArray, rowIndex) => {
      row.forEach((symbol: ShipSymbolValue, colIndex) => {
        const symbolDescription: string = symbol.description!.toLowerCase();

        const gridCell: HTMLDivElement = createElement(
          'div',
          [
            `${this.id}-${symbolDescription}-cell`,
            `player-${symbolDescription}-cell`,
            'grid-cell',
          ],
          {
            'data-x': colIndex.toString(),
            'data-y': rowIndex.toString(),
            'aria-label': `Row ${rowIndex + 1}, Column ${colIndex + 1}`,
            role: 'gridCell',
          }
        );

        const gridCellContainer: HTMLDivElement = createElement(
          'div',
          [
            `${this.id}-${symbolDescription}-grid-cell-container`,
            'grid-cell-container',
          ]
        );

        gridCellContainer.appendChild(gridCell);
        cellFragment.appendChild(gridCellContainer);
      });
    });

    return cellFragment;
  }

  private createShipElement(
    shipType: ShipType,
    shipLength: ShipLength,
    gridPlacementValue: GridPlacementValue,
    gridCrossAxis: number,
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
      ['ship-container', 'adrift'],
      {
        id: `${this.id}-${shipType}-container`,
        'data-dragging': 'false',
        'data-length': shipLength.toString(),
        'data-orientation': orientation,
        'data-shipType': shipType,
        draggable: 'true',
      }
    );

    shipContainerElement.appendChild(shipUnitFragment);

    this.applyGridPlacementValue(
      gridPlacementValue,
      gridCrossAxis,
      shipContainerElement,
      orientation,
      shipLength
    );

    return shipContainerElement;
  }

  private generateBoardContainer(boardSize: number): HTMLElement {
    const gameboardContainer: HTMLElement = createElement(
      'section',
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

  // TODO: match this against getGridPlacementValue to see if I can consolidate
  private getAndSetGridPlacementValue(
    shipContainerElement: HTMLDivElement,
    bowCoordinates: Coordinates,
    orientation: Orientation,
    shipLength: ShipLength
  ): void {
    const [gridPlacementValue, gridCrossAxis]: [
      GridPlacementValue,
      number
    ] = this.getGridPlacementValue(bowCoordinates, orientation, shipLength);

    this.setGridPlacementValue(
      gridPlacementValue,
      gridCrossAxis,
      shipContainerElement,
      orientation,
      shipLength
    );
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
    const orientation: Orientation =
      placementConfigurations.orientation;

    const shipLength: ShipLength = ship.length;

    return {
      bowCoordinates,
      orientation,
      shipLength,
    };
  }

  private handleFleetPlacement(
    fleetBuilder: BattleshipFleetBuilder,
    fleetElements: Map<ShipType, HTMLDivElement>
  ) {
    this.updateFleetElements(fleetBuilder);
    this.placeFleetOnGameboard(fleetElements);
  }

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

  private hasTargetBeenAttacked(
    coordinates: Coordinates
  ): boolean {
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

  private _receiveAttack = async (
    attackCoordinates: Coordinates
  ): Promise<AttackResult> => {
    const gridCellDataKey: GridCellDataKey = `[data-x="${attackCoordinates[0]}"][data-y="${attackCoordinates[1]}"]`;
    const gridCell: HTMLDivElement | null =
      this.gameboardContainer.querySelector<HTMLDivElement>(gridCellDataKey);
    
    if (!gridCell) {
      throw new Error('Grid cell not found.');
    }

    // ! test
    gridCell.style.backgroundColor = 'red';

    if (this.hasTargetBeenAttacked(attackCoordinates)) {
      /* </💭>
      ┌─────────────────────────────────────────────────────────────────────────────┐
      │ [INFO]                                                                      │
      │ This case is unreachable with Billow's coordinate logic,                    │
      │ but valid when playing against a human who may repeat attacks.              │
      │                                                                             │
      │ [BACKLOG]                                                                   │ 
      │ TODO: Add a flash animation to indicate "Cell already attacked".             │
      │                                                                             │
      └─────────────────────────────────────────────────────────────────────────────┘
      */

      console.warn('Cell has already been attacked:', attackCoordinates);

      return {
        hit: false,
      } as AttackResult;
    }
    
    const attackResult: AttackResult =
      this.playerState.gameboardController.receiveAttack(attackCoordinates);
    
    // ! youAreHere
    // ? this needs to come after togglePLayerTurn in this class but not in the opponent class; however, the method relies on the currentPlayer state.
    this.gameState.switchGameboardControls();

    await this.triggerPrePlayerToggleAnimations(attackResult, gridCell);

    this.togglePlayerTurn(attackResult);

    return attackResult;
  }

  private receiveAttack = async (
    attackCoordinates: Coordinates
  ): Promise<AttackResult> => {
    return await this._receiveAttack(attackCoordinates);
  }

  private refreshGameboard(boardContainer: HTMLElement): void {
    /* </💭>
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │ [BACKLOG]                                                                   │
    │ TODO: Refactor this method to remove only the ship being moved and          │
    │ re-place it at the new position instead of resetting the entire board. This │
    │ will improve performance, preserve other ship states, and reduce unnecessary│
    │ operations.                                                                 │
    └─────────────────────────────────────────────────────────────────────────────┘
   */
    
    const gameboard = boardContainer.querySelector(`#${this.id}-gameboard`);
    const gameboardBackground = boardContainer.querySelector(
      `#${this.id}-gameboard-background`
    );

    if (!gameboard || !gameboardBackground)
      throw new Error('Missing gameboard and/or gameboard background elements');

    this.gameboardContainer.removeChild(gameboard);
    this.gameboardContainer.removeChild(gameboardBackground);
    this.shipDragClone.classList.remove('visible');

    this.gameboard = this.generateBoardFragment(
      this.playerState.gameboardBuilder.boardSize
    );

    this.gameboardContainer.appendChild(this.gameboard);

    this.handleFleetPlacement(
      this.playerState.fleetBuilder,
      this.fleetElements
    );
  }

  private refreshGameboardWrapper = (): void => {
    this.refreshGameboard(this.gameboardContainer);
  };

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

  private setFleetElements = (
    shipType: ShipType,
    shipLength: ShipLength,
    gridPlacementValue: GridPlacementValue,
    gridCrossAxis: number,
    orientation: Orientation
  ) => {
    const shipElement: HTMLDivElement = this.createShipElement(
      shipType,
      shipLength,
      gridPlacementValue,
      gridCrossAxis,
      orientation
    );

    this.fleetElements.set(shipType, shipElement);
  };

  private sinkShip = async (
    shipContainerElement: HTMLDivElement
  ): Promise<void> => {
    const DELAY_AFTER_TRANSITION_SECOND: number = 1;

    shipContainerElement.classList.add('sunk');

    await waitForEvent(shipContainerElement, 'animationend');

    await this.handleShipUnitCooked(shipContainerElement);

    await delay(DELAY_AFTER_TRANSITION_SECOND * 1000);
  };

  private toggleGameboardControls = (currentPlayer: CurrentPlayer): void => {
    currentPlayer === 'opponent'
      ? (this.gameboardContainer.style.pointerEvents = 'none')
      : (this.gameboardContainer.style.pointerEvents = 'auto');
  };

  private triggerPrePlayerToggleAnimations = async (
    attackResult: AttackResult,
    gridCell: HTMLDivElement
  ): Promise<void> => {
    if (attackResult.isSunk) {
      this.gameState.eventBus.emit(
        'setAndScrollToNextSitRep',
        attackResult
      );
      await this.updateGameboardPostAttack(attackResult, gridCell);
    } else {
      this.updateGameboardPostAttack(attackResult, gridCell);
      await this.gameState.eventBus.emit(
        'setAndScrollToNextSitRep',
        attackResult
      );
    }
  };

  private updateFleetElements = (
    fleetBuilder: BattleshipFleetBuilder
  ) => {
    if (this.fleetElements.size) this.fleetElements.clear();

    for (const ship of Object.values(fleetBuilder.fleet)) {
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

      const bowCoordinates: Coordinates = coordinatesArray[0];
      const [gridPlacementValue, gridCrossAxis]: [
        GridPlacementValue,
        number
      ] = this.getGridPlacementValue(bowCoordinates, orientation, shipLength);

      this.setFleetElements(
        shipType,
        shipLength,
        gridPlacementValue,
        gridCrossAxis,
        orientation
      );
    }
  };

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
  // 💭 Ship Repositioning

  private handleShipDragStart(e: DragEvent, dragState: DragState) {
    if (
      !(e.target instanceof HTMLDivElement) ||
      !e.target.matches('.ship-container')
    )
      return;

    const setInitialDragStyles = (
      shipContainerElement: HTMLDivElement
    ): void => {
      // Set dragging attribute to true
      shipContainerElement.setAttribute('data-dragging', 'true');

      // Lower Ship Container Opacity
      shipContainerElement.classList.add('lower-opacity');

      // TODO: Make this less hacky 🫠 by adding class instead?
      // Enable drag events for grid cells under ship containers
      setTimeout(() => {
        shipContainerElement.style.pointerEvents = 'none';
      }, 0);

      // Make clone visible
      this.shipDragClone.classList.add('visible');
    };
    const setCloneDimensions = (
      shipContainer: HTMLDivElement,
      shipClone: HTMLDivElement
    ) => {
      const shipBoundingRect = shipContainer.getBoundingClientRect();
      shipClone.style.height = `${shipBoundingRect.height}px`;
      shipClone.style.width = `${shipBoundingRect.width}px`;
    };
    const getCloneSnapOffset = (
      shipContainerElement: HTMLDivElement,
      orientation: Orientation,
      dragState: DragState
    ): CloneSnapOffset => {
      const getShipBow = (
        shipContainerElement: HTMLDivElement
      ): HTMLDivElement => {
        const shipBow: HTMLDivElement | null =
          shipContainerElement.querySelector(`.ship-bow`);
        if (!shipBow) throw new Error('Ship bow not found.');
        return shipBow;
      };

      // Get ship bow element (cursor snap position)
      const shipBow: HTMLDivElement = getShipBow(shipContainerElement);

      // Get border of ship border to include in offset calculations
      const shipBorderSize = getComputedStyle(document.documentElement)
        .getPropertyValue('--ship-container-border-size')
        .trim();

      const match = shipBorderSize.match(
        /^(?<numberValue>\d+(\.\d+)?)(?<unitType>[a-z%]+)$/i
      );

      /* 
       ┌─────────────────────────────────────────────────────────────────────────────┐
       │ REGARDING ABOVE ⤴️ 💭…                                                       │
       │                                                                             │
       │ Use ES2018 named match groups syntax to extract CSS variable values.        │
       │                                                                             │
       │ (\d+(\.\d+)?) matches any number of digits as  (primary capturing group)    │
       │                                                                             │
       │ This is followed by an optional subgroup (\.\d+) for a decimal point        │
       │ and fractional                                                              │
       │ digits.                                                                     │
       │                                                                             │
       │ This allows the entire first capturing group (\d+(\.\d+)?) to match          │
       │ integers or floating-point                                                   │
       │ numbers.                                                                    │
       │                                                                             │  
       │ The ?<numberValue> syntax names the capturing group, storing it in          │
       │ `match.groups` for easy                                                     │
       │ access.                                                                     │
       │                                                                             │  
       │ This is destructured to extract potential floating-point numbers             │
       │ representing the ship's border                                              │
       │ size.                                                                       │
       │                                                                             │
       │ The script dynamically updates the border size by reading the value         │
       │ directly from the SCSS                                                      │
       │ file.                                                                        │
       │                                                                             │  
       │ Currently, it only supports border sizes specified in pixels, but            │
       │ the `unitType` match group could be used to support other unit types        │
       │ in the future.                                                              │
       │                                                                             │  
       │ I don't feel like doing all that right now. 💭                               |
       └─────────────────────────────────────────────────────────────────────────────┘
      */

      if (!match || !match.groups)
        throw new Error('No matches found when parsing');

      const shipBorderValueSplit =
        match.groups as ShipBorderValueSplit;

      dragState.shipBorderValueSplit = shipBorderValueSplit;

      const isHorizontal: boolean = orientation === 'horizontal';

      const [offsetX, offsetY] = isHorizontal
        ? [
            shipBow.getBoundingClientRect().width / 2,
            shipBow.getBoundingClientRect().height / 2 +
              Number(shipBorderValueSplit.numberValue),
          ]
        : [
            shipBow.getBoundingClientRect().width / 2 +
              Number(shipBorderValueSplit.numberValue),
            shipBow.getBoundingClientRect().height / 2,
          ];

      const cloneSnapOffset: CloneSnapOffset = {
        offsetX,
        offsetY,
      };

      return cloneSnapOffset;
    };
    const classifyValidCellCoordinates = (
      boardContainer: HTMLElement,
      shipContainerElement: HTMLDivElement,
      orientation: Orientation,
      gameboardController: BattleshipBoardController
    ): void => {
      const shipLengthAttr: number | null = Number(
        shipContainerElement.getAttribute('data-length')
      );
      if (!shipLengthAttr || !isShipLength(shipLengthAttr)) {
        throw new Error('Invalid or missing ship type attribute.');
      }

      const classifyValidBowCells = (
        gridCells: NodeListOf<HTMLDivElement>,
        shipLength: ShipLength,
        orientation: Orientation
      ) => {
        const allValidBowCoordinates: Set<Coordinates> =
          gameboardController.getAllValidBowCoordinates(
            orientation,
            shipLength
          );

        gridCells.forEach((gridCell: HTMLDivElement) => {
          const gridCellCoordinates: Coordinates = [
            Number(gridCell.getAttribute('data-x')),
            Number(gridCell.getAttribute('data-y')),
          ];

          for (const validBowCoordinates of allValidBowCoordinates) {
            if (
              !areArraysEqual(
                validBowCoordinates,
                gridCellCoordinates
              )
            )
              continue;
            gridCell.classList.add('valid-bow-coordinates');
          }
        });
      };

      const shipLength: ShipLength = shipLengthAttr;

      const gridCells: NodeListOf<HTMLDivElement> =
        boardContainer.querySelectorAll('.grid-cell');

      classifyValidBowCells(gridCells, shipLength, orientation);
    };
    const updateDragState = (
      dragState: DragState,
      fleet: Fleet,
      shipType: ShipType,
      cloneSnapOffset: CloneSnapOffset
    ) => {
      // Ensure the ship type exists in the fleet
      if (!fleet[shipType])
        throw new Error(`The ${shipType} is not present in the fleet.`);

      // Set the current ship instance and its initial configurations
      dragState.currentShipInstance = fleet[shipType];
      dragState.initialPlacementConfigurations =
        dragState.currentShipInstance.currentplacementConfigurations;
      dragState.cloneSnapOffset = cloneSnapOffset;
    };

    const shipContainerElement: HTMLDivElement = e.target;
    const orientation: Orientation =
      getConvertedTypeFromAttr(
        shipContainerElement,
        'data-orientation',
        isOrientation
      );

    const fleet: Fleet = this.playerState.fleetBuilder.fleet;
    const shipType: ShipType =
      getConvertedTypeFromAttr(
        shipContainerElement,
        'data-shiptype',
        isShipType
      );

    const cloneSnapOffset: CloneSnapOffset = getCloneSnapOffset(
      shipContainerElement,
      orientation,
      dragState
    );

    updateDragState(dragState, fleet, shipType, cloneSnapOffset);

    if (!dragState.currentShipInstance)
      throw new Error(
        `Drag state hasn't been updated with the current ship instance on drag start. Drag State: ${JSON.stringify(
          dragState
        )}`
      );

    // Remove the piece from the gameboard (non-null ensured by `setUpShipForDrag`)
    this.playerState.gameboardController.removePiece(
      dragState.currentShipInstance
    );

    // Set drag image to be transparent 1 x 1 png
    e.dataTransfer?.setDragImage(this.dragImage, 0, 0);

    setCloneDimensions(shipContainerElement, this.shipDragClone);
    setInitialDragStyles(shipContainerElement);
    classifyValidCellCoordinates(
      this.gameboardContainer,
      shipContainerElement,
      orientation,
      this.playerState.gameboardController
    );
    this.snapCloneToCursor(e, cloneSnapOffset);
  }

  private handleShipDrag(e: DragEvent, dragState: DragState) {
    if (
      !(e.target instanceof HTMLDivElement) ||
      !e.target.matches('.ship-container')
    )
      return;

    const cloneSnapOffset: CloneSnapOffset | null =
      dragState.cloneSnapOffset;

    if (!cloneSnapOffset)
      throw new Error(
        'An error has occured during the `cloneSnapOffset` reading.'
      );

    this.snapCloneToCursor(e, cloneSnapOffset);
  }

  private handleShipDragEnter(e: DragEvent) {
    if (
      !(e.target instanceof HTMLDivElement) ||
      !e.target.matches('.grid-cell')
    )
      return;

    const gridCell: HTMLDivElement = e.target;

    // Check if current grid cell is valid for placement
    const areValidBowCoordinates: boolean = gridCell.classList.contains(
      'valid-bow-coordinates'
    );

    // Add appropriate visual feedback class to grid cell
    areValidBowCoordinates
      ? gridCell.classList.add('placement-is-valid')
      : gridCell.classList.add('placement-is-invalid');

    // Add appropriate visual feedback class to ship drag clone
    if (areValidBowCoordinates)
      this.shipDragClone.classList.add('placement-is-valid');
  }

  private handleShipDragLeave(e: DragEvent) {
    if (
      !(e.target instanceof HTMLDivElement) ||
      !e.target.matches('.grid-cell')
    )
      return;

    const gridCell: HTMLDivElement = e.target;

    const areValidBowCoordinates: boolean =
      gridCell.classList.contains('placement-is-valid');

    // Remove assigned visual feedback class from grid cell
    areValidBowCoordinates
      ? gridCell.classList.remove('placement-is-valid')
      : gridCell.classList.remove('placement-is-invalid');

    // Remove assigned visual feedback class from ship drag clone
    if (this.shipDragClone.classList.contains('placement-is-valid'))
      this.shipDragClone.classList.remove('placement-is-valid');
  }

  private handleShipDragOver(e: DragEvent, dragState: DragState) {
    // Enables the drop event to fire
    e.preventDefault();

    if (
      !(e.target instanceof HTMLDivElement) ||
      !e.target.matches('.grid-cell')
    )
      return;

    const gridCell: HTMLDivElement = e.target;

    // Update drag state for cleanup
    dragState.currentDragOverCell = gridCell;

    // Prevent further operations for invalid cells
    if (!gridCell.classList.contains('valid-bow-coordinates')) return;
  }

  private handleShipDrop(e: DragEvent, dragState: DragState) {
    e.preventDefault();

    if (
      !(e.target instanceof HTMLDivElement) ||
      !e.target.matches('.valid-bow-coordinates')
    )
      return;

    // Validate and modify state
    const { coordinatesArray, orientation: initialOrientation } =
      dragState.initialPlacementConfigurations || {};

    if (!coordinatesArray || !initialOrientation) {
      throw new Error('Initial placement configurations are incomplete.');
    }

    dragState.isValidDropTarget = true;

    const validGridCell: HTMLDivElement = e.target;

    // Retrieve new coordinates from the valid grid cell
    const xAttr = validGridCell.getAttribute('data-x');
    const yAttr = validGridCell.getAttribute('data-y');
    if (!xAttr || !yAttr) {
      throw new Error('Missing or invalid grid cell coordinates.');
    }
    const newCoordinates: Coordinates = [
      Number(xAttr),
      Number(yAttr),
    ];

    this.playerState.gameboardController.placePiece({
      ship: dragState.currentShipInstance!,
      coordinates: newCoordinates,
      orientation: initialOrientation,
    });

    // Re-renders board with new ship placement
    this.refreshGameboard(this.gameboardContainer);

    // Reset valid drop target state
    dragState.isValidDropTarget = false;
  }

  private handleShipDragEnd(e: DragEvent, dragState: DragState) {
    if (
      !(e.target instanceof HTMLDivElement) ||
      !e.target.matches('.ship-container')
    )
      return;

    const resetShipPosition = (): void => {
      const { coordinatesArray, orientation: initialOrientation } =
        dragState.initialPlacementConfigurations || {};
      if (!coordinatesArray || !initialOrientation) {
        throw new Error('Initial placement configurations are incomplete.');
      }

      // Get bow coordinates
      const initialBowCoordinates: Coordinates =
        coordinatesArray[0];

      // Re-place ship on logic gameboard
      this.playerState.gameboardController.placePiece({
        ship: dragState.currentShipInstance!,
        coordinates: initialBowCoordinates,
        orientation: initialOrientation,
      });
    };

    const removeDragStyles = (
      shipContainerElement: HTMLDivElement,
      currentDragOverCell: HTMLDivElement,
      isValidDropTarget: boolean
    ): void => {
      const cellFeedbackClass: string = isValidDropTarget
        ? 'placement-is-valid'
        : 'placement-is-invalid';

      // Set dragging attribute to false
      shipContainerElement.setAttribute('data-dragging', 'false');

      // Lower grid cell validation pseudo-element opacity
      currentDragOverCell.classList.remove(cellFeedbackClass);

      // Lower ship container opacity
      shipContainerElement.classList.remove('lower-opacity');

      // Re-hide drag clone
      this.shipDragClone.classList.remove('visible');

      // Restore ship container draggability
      shipContainerElement.style.pointerEvents = 'auto';
    };

    const shipContainerElement: HTMLDivElement = e.target;

    try {
      const { currentDragOverCell, isValidDropTarget } = dragState;

      if (!currentDragOverCell)
        throw new Error(
          `Current drag over cell is missing. Drag state: ${JSON.stringify(
            dragState
          )}`
        );

      removeDragStyles(
        shipContainerElement,
        currentDragOverCell,
        isValidDropTarget
      );

      if (!isValidDropTarget) {
        resetShipPosition();
      }
    } catch (error) {
      console.error(error);
    }
  }

  private handleShipRotation = (e: MouseEvent) => {
    if (
      !(e.target instanceof HTMLDivElement) ||
      !e.target.matches('.ship-container')
    )
      return;

    const shipContainerElement: HTMLDivElement = e.target;

    const shipType: ShipType =
      getConvertedTypeFromAttr(
        shipContainerElement,
        'data-shiptype',
        isShipType
      );

    const ship = this.playerState.fleetBuilder.getShip(shipType);

    this.playerState.gameboardController.rotatePiece(ship);
    this.refreshGameboard(this.gameboardContainer);
  };

  private snapCloneToCursor(
    e: DragEvent,
    cloneSnapOffset: CloneSnapOffset
  ): void {
    const gameboardClientRect: DOMRect =
      this.gameboardContainer.getBoundingClientRect();
    const gameboardOffsetX: number = gameboardClientRect.left;
    const gameboardOffsetY: number = gameboardClientRect.top;

    const cursorX: number = e.clientX;
    const cursorY: number = e.clientY;

    const { offsetX, offsetY }: CloneSnapOffset = cloneSnapOffset;

    document.documentElement.style.setProperty(
      '--ship-clone-left',
      `${cursorX - gameboardOffsetX - offsetX}px`
    );

    document.documentElement.style.setProperty(
      '--ship-clone-top',
      `${cursorY - gameboardOffsetY - offsetY}px`
    );
  }

  // 💭 -------------------------------------------------------------
  // -

  // 💭 --------------------------------------------------------------
  // 💭 Utilities

  // TODO: Do I need this
  public getId(): string {
    return this.id;
  }
}
