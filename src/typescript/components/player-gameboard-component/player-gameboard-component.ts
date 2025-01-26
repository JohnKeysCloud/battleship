import './player-gameboard-component.scss';
import { BattleshipFleetBuilder } from '../../logic/bs-fleet-builder/bs-fleet-builder';
import { BattleshipBoardController } from '../../logic/bs-gameboard-controller/bs-gameboard-controller';
import { GridPlacementValue } from '../../types/css-types';
import {
  Coordinates,
  CoordinatesArray,
  Fleet,
  Gameboard,
  Orientation,
  ShipLength,
  ShipSymbolValue,
  ShipSymbolValueArray,
  ShipType,
} from '../../types/logic-types';
import { PlayerState } from '../../types/state-types';
import GlobalEventBus from '../../utilities/event-bus';
import {
  isOrientation,
  isShipLength,
  isShipType,
} from '../../utilities/logic-utilities';
import {
  areArraysEqual,
  createElement,
  getConvertedTypeFromAttr,
} from '../../utilities/random-utilities';
import {
  CloneSnapOffset,
  DragState,
  ShipBorderValueSplit,
} from '../component-types';

export class PlayerGameboardComponent {
  public id: string = 'player';
  public boardContainer: HTMLElement;
  private gameboard: DocumentFragment;
  private fleetElements: Set<HTMLDivElement> = new Set();
  private dragImage: HTMLImageElement;
  private shipDragClone: HTMLDivElement;

  constructor(public readonly playerState: PlayerState) {
    this.boardContainer = this.generateBoardContainer(
      this.playerState.gameboardBuilder.boardSize
    );

    this.gameboard = this.generateBoardFragment(
      this.playerState.gameboardBuilder.boardSize
    );
    this.dragImage = this.createDragImage();
    this.shipDragClone = this.createShipDragClone();

    // ! add ID to this ? or create event bus for each player gameboard instance?
    GlobalEventBus.on('updateGameboard', (boardContainer: HTMLDivElement) => {
      this.updateGameboard(boardContainer);
    });
  }

  public render(targetElement: HTMLElement): void {
    if (!targetElement) {
      throw new Error(
        `Target element not found with ID - ${this.id} and selector - "${targetElement}".`
      );
    }

    this.boardContainer.append(
      this.dragImage,
      this.shipDragClone,
      this.gameboard
    );
    this.handleFleetPlacement(
      this.playerState.fleetBuilder,
      this.fleetElements
    );

    targetElement.appendChild(this.boardContainer);
  }

  // 💭 --------------------------------------------------------------
  // 💭 Helpers

  // private appendFleetClonesToGameboard(fleetElements: Set<HTMLDivElement>) {
  //   const gameboard: HTMLDivElement | null =
  //     this.boardContainer.querySelector('.gameboard');

  //   if (!gameboard) throw new Error('Gameboard not found');

  //   fleetElements.forEach((shipElement) => {
  //     const shipCloneElement: HTMLDivElement = createElement(
  //       'div',
  //       ['ship-container-clone'],
  //       {
  //         id: `${shipElement.getAttribute('id')}-clone`,
  //       }
  //     );

  //     gameboard.appendChild(shipCloneElement);
  //   });
  // }

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

        const gridCellContainer: HTMLDivElement = createElement('div', [
          `${this.id}-${symbolDescription}-grid-cell-container`,
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
    gridPlacementValue: string,
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
      ['ship-container'],
      {
        id: `${this.id}-${shipType}-container`,
        'data-shipType': shipType,
        'data-length': shipLength.toString(),
        'data-orientation': orientation,
        draggable: 'true',
      }
    );

    shipContainerElement.appendChild(shipUnitFragment);

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

    this.handleDragListeners(gameboardContainer);
    this.handleClickListeners(gameboardContainer);

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

  private handleFleetPlacement(
    fleetBuilder: BattleshipFleetBuilder,
    fleetElements: Set<HTMLDivElement>
  ) {
    this.updateFleetElements(fleetBuilder);
    this.placeFleetOnGameboard(fleetElements);
  }

  private placeFleetOnGameboard(fleetElements: Set<HTMLDivElement>): void {
    const gameboard =
      this.boardContainer.querySelector<HTMLDivElement>('.gameboard');

    if (!gameboard) {
      throw new Error('Gameboard container not found.');
    }

    fleetElements.forEach((shipElement) => gameboard.appendChild(shipElement));
  }

  private updateFleetElements = (fleetBuilder: BattleshipFleetBuilder) => {
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

      const [x, y]: Coordinates = coordinatesArray[0];
      const [gridPlacementValue, gridCrossAxis]: [GridPlacementValue, number] =
        this.getGridPlacementValue([x, y], orientation, shipLength);

      const shipElement: HTMLDivElement = this.createShipElement(
        shipType,
        shipLength,
        gridPlacementValue,
        gridCrossAxis,
        orientation
      );

      this.fleetElements.add(shipElement);
    }
  };

  private updateGameboard(boardContainer: HTMLElement) {
    const gameboard = boardContainer.querySelector(`#${this.id}-gameboard`);
    const gameboardBackground = boardContainer.querySelector(
      `#${this.id}-gameboard-background`
    );

    if (!gameboard || !gameboardBackground)
      throw new Error('Missing gameboard and/or gameboard background elements');

    this.boardContainer.removeChild(gameboard);
    this.boardContainer.removeChild(gameboardBackground);
    this.shipDragClone.classList.remove('visible');

    this.gameboard = this.generateBoardFragment(
      this.playerState.gameboardBuilder.boardSize
    );

    this.boardContainer.appendChild(this.gameboard);

    this.handleFleetPlacement(
      this.playerState.fleetBuilder,
      this.fleetElements
    );
  }

  // 💭 --------------------------------------------------------------
  // 💭 HTML Drag and Drop API (Repositioning)

  private handleDragListeners(gameboardContainer: HTMLElement) {
    const dragState: DragState = {
      currentShipInstance: null,
      initialPlacementConfigurations: null,
      isValidDropTarget: false,
      currentDragOverCell: null,
      cloneSnapOffset: null,
      shipBorderValueSplit: null,
    };

    // Save each as function
    gameboardContainer.addEventListener('dragstart', (e: DragEvent) => {
      this.handleShipDragStart(e, dragState);
    });
    gameboardContainer.addEventListener('drag', (e: DragEvent) => {
      this.handleShipDrag(e, dragState);
    });
    gameboardContainer.addEventListener('dragenter', (e: DragEvent) => {
      this.handleShipDragEnter(e);
    });
    gameboardContainer.addEventListener('dragleave', (e: DragEvent) => {
      this.handleShipDragLeave(e);
    });
    gameboardContainer.addEventListener('dragover', (e: DragEvent) => {
      this.handleShipDragOver(e, dragState);
    });
    gameboardContainer.addEventListener('drop', (e: DragEvent) => {
      this.handleShipDrop(e, dragState);
    });
    gameboardContainer.addEventListener('dragend', (e: DragEvent) => {
      this.handleShipDragEnd(e, dragState);
    });
  }

  private handleShipDragStart(e: DragEvent, dragState: DragState) {
    if (
      !(e.target instanceof HTMLDivElement) ||
      !e.target.matches('.ship-container')
    )
      return;

    const setInitialDragStyles = (
      shipContainerElement: HTMLDivElement
    ): void => {
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

      const shipBorderValueSplit = match.groups as ShipBorderValueSplit;

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
            if (!areArraysEqual(validBowCoordinates, gridCellCoordinates))
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
    const orientation: Orientation = getConvertedTypeFromAttr(
      shipContainerElement,
      'data-orientation',
      isOrientation
    );

    const fleet: Fleet = this.playerState.fleetBuilder.fleet;
    const shipType: ShipType = getConvertedTypeFromAttr(
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
      this.boardContainer,
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

    const cloneSnapOffset: CloneSnapOffset | null = dragState.cloneSnapOffset;

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
    const newCoordinates: Coordinates = [Number(xAttr), Number(yAttr)];

    this.playerState.gameboardController.placePiece({
      ship: dragState.currentShipInstance!,
      coordinates: newCoordinates,
      orientation: initialOrientation,
    });

    // Re-renders board with new ship placement
    this.updateGameboard(this.boardContainer);

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
      const initialBowCoordinates: Coordinates = coordinatesArray[0];

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

  private snapCloneToCursor(
    e: DragEvent,
    cloneSnapOffset: CloneSnapOffset
  ): void {
    const gameboardClientRect: DOMRect =
      this.boardContainer.getBoundingClientRect();
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

  // 💭 --------------------------------------------------------------
  // 💭 Handle Ship Click (Rotation)

  private handleClickListeners(gameboardContainer: HTMLElement) {
    gameboardContainer.addEventListener('click', (e: MouseEvent) => {
      this.handleShipRotation(e);
    });
  }

  private handleShipRotation(e: MouseEvent) {
    if (
      !(e.target instanceof HTMLDivElement) ||
      !e.target.matches('.ship-container')
    )
      return;

    const shipContainerElement: HTMLDivElement = e.target;

    const shipType: ShipType = getConvertedTypeFromAttr(
      shipContainerElement,
      'data-shiptype',
      isShipType
    );

    const ship = this.playerState.fleetBuilder.getShip(shipType);

    this.playerState.gameboardController.rotatePiece(ship);
    this.updateGameboard(this.boardContainer);
  }

  // 💭 --------------------------------------------------------------
  // 💭 Utilities

  // TODO: Do I need this
  public getId(): string {
    return this.id;
  }
}
