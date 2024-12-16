import { BattleshipFleetBuilder } from '../../logic/bs-fleet-builder/bs-fleet-builder';
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
import {
  areArraysEqual,
  createElement,
  createPlayerIdentifier,
  getConvertedTypeFromAttr,
} from '../../utilities/random-utilities';
import { GridPlacementValue } from '../../types/css-types';
import { PlayerState } from '../../types/state-types';
import GlobalEventBus from '../../utilities/event-bus';
import { isOrientation, isShipLength, isShipType } from '../../utilities/logic-utilities';
import { DragState } from '../component-types';
import { BattleshipBoardController } from '../../logic/bs-gameboard-controller/bs-gameboard-controller';

export class GameboardComponent {
  private boardContainer: HTMLDivElement;
  private fleetElements: Set<HTMLDivElement> = new Set();

  constructor(
    private readonly id: string,
    public readonly playerState: PlayerState
  ) {
    this.boardContainer = this.generateBoardContainer(
      this.playerState.gameboardBuilder.boardSize
    );

    GlobalEventBus.on('updateGameboard', () => {
      this.updateGameboard();
    });
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

    this.handleFleetPlacement(
      this.playerState.fleetBuilder,
      this.fleetElements
    );

    target.appendChild(this.boardContainer);
  }

  // 💭 --------------------------------------------------------------
  // 💭 Helpers

  private appendFleetClonesToGameboard(fleetElements: Set<HTMLDivElement>) {
    const gameboard: HTMLDivElement | null =
      this.boardContainer.querySelector('.gameboard');

    if (!gameboard) throw new Error('Gameboard not found');

    fleetElements.forEach((shipElement) => {
      const shipCloneElement: HTMLDivElement = createElement(
        'div',
        ['ship-container-clone'],
        {
          id: `${shipElement.getAttribute('id')}-clone`,
        }
      );

      gameboard.appendChild(shipCloneElement);
    });
  }

  private clearBoardContainer(boardContainer: HTMLDivElement): void {
    while (boardContainer.firstChild) {
      boardContainer.removeChild(boardContainer.firstChild);
    }
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
            `${createPlayerIdentifier(this.id, symbolDescription)}-cell`,
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
          createPlayerIdentifier(
            this.id,
            `${symbolDescription}-cell-container`
          ),
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
      this.id
    );

    const shipContainerElement: HTMLDivElement = createElement(
      'div',
      ['ship-container'],
      {
        id: createPlayerIdentifier(this.id, `${shipType}-container`),
        'data-shipType': shipType,
        'data-length': shipLength.toString(),
        'data-orientation': orientation,
        draggable: 'true',
      }
    );
    shipContainerElement.style.display = 'grid';
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

  private generateBoardContainer(boardSize: number): HTMLDivElement {
    const gameboardContainer: HTMLDivElement = createElement(
      'div',
      ['gameboard-container'],
      {
        id: createPlayerIdentifier(this.id, 'gameboard-container'),
      }
    );

    gameboardContainer.style.setProperty('--grid-size', boardSize.toString());

    this.handleDragListeners(gameboardContainer);

    return gameboardContainer;
  }

  private generateBoardFragment(boardSize: number): DocumentFragment {
    const gameboardBackground: HTMLDivElement = createElement(
      'div',
      ['gameboard-background'],
      {
        id: createPlayerIdentifier(this.id, 'gameboard-background'),
      }
    );
    gameboardBackground.appendChild(
      this.createBackgroundCellsFragment(
        this.playerState.gameboardBuilder.board
      )
    );

    const gameboard = createElement('div', ['gameboard'], {
      id: createPlayerIdentifier(this.id, 'gameboard'),
    });
    gameboard.style.setProperty('--grid-size', boardSize.toString());

    const boardFragment: DocumentFragment = new DocumentFragment();
    boardFragment.append(gameboardBackground, gameboard);

    return boardFragment;
  }

  private generateShipUnitFragment(
    shipLength: ShipLength,
    shipType: ShipType,
    id: string
  ): DocumentFragment {
    const shipUnitFragment: DocumentFragment = new DocumentFragment();

    for (let i = 0; i < shipLength; i++) {
      const isBow: boolean = i === 0;
      const shipUnit: HTMLDivElement = createElement('div', [
        'ship-unit',
        createPlayerIdentifier(id, shipType),
      ]);

      if (isBow) {
        shipUnit.classList.add('ship-bow');
        shipUnit.setAttribute(
          'id',
          createPlayerIdentifier(id, `${shipType}-bow`)
        );
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
    this.appendFleetClonesToGameboard(fleetElements);
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
        console.log(`The ${shipType} has not been placed. Continuing...`);
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

  private updateGameboard() {
    this.clearBoardContainer(this.boardContainer);

    const gameboard: DocumentFragment = this.generateBoardFragment(
      this.playerState.gameboardBuilder.boardSize
    );

    this.boardContainer.appendChild(gameboard);

    this.handleFleetPlacement(
      this.playerState.fleetBuilder,
      this.fleetElements
    );
  }

  // 💭 --------------------------------------------------------------
  // 💭 HTML Drag and Drop API

  private handleDragListeners(gameboardContainer: HTMLDivElement) {
    const dragState: DragState = {
      currentShipInstance: null,
      initialPlacementConfigurations: null,
      isValidDropTarget: false,
      currentDragOverCell: null,
    };

    gameboardContainer.addEventListener('dragstart', (e: DragEvent) =>
      this.handleShipDragStart(e, dragState)
    );
    gameboardContainer.addEventListener('dragenter', (e: DragEvent) =>
      this.handleShipDragEnter(e)
    );
    gameboardContainer.addEventListener('dragleave', (e: DragEvent) =>
      this.handleShipDragLeave(e)
    );
    gameboardContainer.addEventListener('dragleave', (e: DragEvent) =>
      this.handleShipDragLeave(e)
    );
    gameboardContainer.addEventListener('dragover', (e: DragEvent) =>
      this.handleShipDragOver(e, dragState)
    );
    gameboardContainer.addEventListener('drop', (e: DragEvent) =>
      this.handleShipDrop(e, dragState)
    );
    gameboardContainer.addEventListener('dragend', (e: DragEvent) =>
      this.handleShipDragEnd(e, dragState)
    );
  }

  private handleShipDragStart(e: DragEvent, dragState: DragState) {
    if (!(e.target instanceof HTMLDivElement))
      throw new Error('Target element not found or is not an HTMLElement.');

    // Ensure it's a valid ship container
    if (!e.target.classList.contains('ship-container')) return;

    const snapToClone = (
      e: DragEvent,
      boardContainer: HTMLDivElement
    ): void => {
      if (!e.target || !(e.target instanceof HTMLDivElement))
        throw new Error('Target element not found or is not an HTMLElement.');

      const shipContainerElement: HTMLDivElement = e.target;
      const shipContainerId: string | null =
        shipContainerElement.getAttribute('id');

      const shipContainerClone: HTMLDivElement | null =
        boardContainer.querySelector(`#${shipContainerId}-clone`);

      if (!shipContainerClone) throw new Error('Ship clone not found.');
      if (!shipContainerId)
        throw new Error("Ship container doesn't have an ID.");

      const shipBoundingRect = shipContainerElement.getBoundingClientRect();

      shipContainerClone.style.height = `${shipBoundingRect.height}px`;
      shipContainerClone.style.width = `${shipBoundingRect.width}px`;

      const shipBow = shipContainerElement.querySelector(`.ship-bow`);
      if (!shipBow) throw new Error('Ship bow not found.');

      const shipBowBoundingRect = shipBow?.getBoundingClientRect();

      e.dataTransfer?.setDragImage(
        shipContainerClone,
        shipBowBoundingRect.width / 2,
        shipBowBoundingRect.height / 2
      );

      // reveal ship container clone
      shipContainerClone.style.visibility = 'visible'; // Ensure the clone is visible
      shipContainerClone.style.pointerEvents = 'auto'; // Ensure pointer events work on the clone

      // TODO: Make this less hacky 🫠
      // enable drag events for grid cells under ships
      setTimeout(() => {
        shipContainerElement.style.pointerEvents = 'none';
      }, 0);
    };

    const classifyValidCellCoordinates = (
      boardContainer: HTMLDivElement,
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

    // Update drag state
    const setUpShipForDrag = (
      dragState: DragState,
      fleet: Fleet,
      shipType: ShipType
    ) => {
      // Ensure the ship type exists in the fleet

      if (!fleet[shipType])
        throw new Error(`The ${shipType} is not present in the fleet.`);

      // Set the current ship instance and its initial configurations
      dragState.currentShipInstance = fleet[shipType];
      dragState.initialPlacementConfigurations =
        dragState.currentShipInstance.currentplacementConfigurations;
    };

    const shipContainer: HTMLDivElement = e.target;

    // Get ship type and orientation, ensuring valid attributes and types
    const shipType: ShipType = getConvertedTypeFromAttr(
      e.target,
      'data-shiptype',
      isShipType
    );

    const orientation: Orientation = getConvertedTypeFromAttr(
      e.target,
      'data-orientation',
      isOrientation
    );

    const fleet: Fleet = this.playerState.fleetBuilder.fleet;

    setUpShipForDrag(dragState, fleet, shipType);

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

    // Handle snapping and classifying valid cells
    snapToClone(e, this.boardContainer);
    classifyValidCellCoordinates(
      this.boardContainer,
      shipContainer,
      orientation,
      this.playerState.gameboardController
    );
  }

  private handleShipDragEnter(e: DragEvent) {
    if (!(e.target instanceof HTMLDivElement))
      throw new Error('Target element not found or is not an HTMLElement.');

    // Ensure it's a grid cell
    if (!e.target.classList.contains('grid-cell')) return;

    const gridCell: HTMLDivElement = e.target;

    // Check if current grid cell is valid for placement
    const areValidBowCoordinates = gridCell.classList.contains(
      'valid-bow-coordinates'
    );

    // Add appropriate visual feedback class to grid cell
    areValidBowCoordinates
      ? gridCell.classList.add('placement-is-valid')
      : gridCell.classList.add('placement-is-invalid');
  }

  private handleShipDragLeave(e: DragEvent) {
    if (!(e.target instanceof HTMLDivElement))
      throw new Error('Target element not found or is not an HTMLElement.');

    if (!e.target.classList.contains('grid-cell')) return;

    const gridCell: HTMLDivElement = e.target;

    // Remove assigned visual feedback class from grid cell
    if (gridCell.classList.contains('placement-is-valid')) {
      gridCell.classList.remove('placement-is-valid');
    } else if (gridCell.classList.contains('placement-is-invalid')) {
      gridCell.classList.remove('placement-is-invalid');
    }
  }

  private handleShipDragOver(e: DragEvent, dragState: DragState) {
    // Enables the drop event to fire
    e.preventDefault();

    if (!(e.target instanceof HTMLDivElement))
      throw new Error('Target element not found or is not an HTMLElement.');
    if (!e.target.classList.contains('grid-cell')) return;

    const gridCell: HTMLDivElement = e.target;

    // Update drag state for cleanup
    dragState.currentDragOverCell = gridCell;

    // Prevent further operations for invalid cells
    if (!gridCell.classList.contains('valid-bow-coordinates')) return;
  }

  private handleShipDrop(e: DragEvent, dragState: DragState) {
    e.preventDefault();

    if (!e.target || !(e.target instanceof HTMLDivElement))
      throw new Error('Target element not found or is not an HTMLElement.');

    if (!e.target.classList.contains('valid-bow-coordinates')) return;

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
    this.updateGameboard();

    // Reset valid drop target state
    dragState.isValidDropTarget = false;
  }

  private handleShipDragEnd(e: DragEvent, dragState: DragState) {
    if (!(e.target instanceof HTMLDivElement))
      throw new Error('Target element not found or is not an HTMLElement.');

    if (!e.target.classList.contains('ship-container')) return;
    const resetDragStyles = (shipContainerElement: HTMLDivElement): void => {
      // Extract and validate ship container ID
      const shipContainerId: string | null =
        shipContainerElement.getAttribute('id');

      // Retrieve and validate ship clone element
      const shipContainerClone: HTMLDivElement | null =
        this.boardContainer.querySelector(`#${shipContainerId}-clone`);

      if (!shipContainerId || !shipContainerClone) {
        throw new Error(
          `Invalid ship container state. ID: ${shipContainerId}, Clone: ${shipContainerClone}`
        );
      }

      // Re-hide drag clone
      shipContainerClone.style.visibility = 'hidden'; // Ensure the clone is visible
      shipContainerClone.style.pointerEvents = 'none'; // Ensure pointer events are revoked from clone

      // Remove drag events for grid cells under ships
      shipContainerElement.style.pointerEvents = 'auto';
    };
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
    const removeVisualFeedback = (
      currentDragOverCell: HTMLDivElement,
      isValidDropTarget: boolean
    ): void => {
      const feedbackClass: string = isValidDropTarget
        ? 'placement-is-valid'
        : 'placement-is-invalid';
      currentDragOverCell.classList.remove(feedbackClass);
    };

    const shipContainerElement: HTMLDivElement = e.target;

    try {
      resetDragStyles(shipContainerElement);

      const { currentDragOverCell, isValidDropTarget } = dragState;
      if (!currentDragOverCell)
        throw new Error(
          `Current drag over cell is missing. Drag state: ${JSON.stringify(
            dragState
          )}`
        );
      removeVisualFeedback(currentDragOverCell, isValidDropTarget);

      if (!isValidDropTarget) {
        resetShipPosition();
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 💭 --------------------------------------------------------------
  // 💭 Utilities

  // TODO: Do I need this
  public getId(): string {
    return this.id;
  }
}
