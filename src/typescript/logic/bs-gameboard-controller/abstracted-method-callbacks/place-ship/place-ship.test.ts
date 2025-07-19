import {
  Coordinates,
  Gameboard,
  IPlacePieceWrapperParams,
  Orientation,
  ShipLength,
  ShipSymbolValue,
  ShipType
} from '../../../../types/logic-types';
import { PlayerContext } from '../../../../types/state-types';
import { BattleshipBuilder } from '../../../bs-ship-builder/bs-ship-builder';
import { BattleshipFleetBuilder } from '../../../bs-fleet-builder/bs-fleet-builder';
import { createPositionObject } from '../../../../utilities/logic-utilities';
import { createPlayerContext } from '../../../../state/player-state';

describe('`placeShip`', () => {
  // 💭 --------------------------------------------------------------
  // 💭 Setup

  const getNewCarrierTestShip = (): BattleshipBuilder =>
    BattleshipFleetBuilder.createHasbroFleet().getShip(ShipType.Carrier);

  let playerState: PlayerContext = createPlayerContext();

  beforeEach(() => {
    playerState = createPlayerContext();
  });

  const placeShip = (input: IPlacePieceWrapperParams) =>
    playerState.gameboardController.placePiece(input);

  // 💭 --------------------------------------------------------------
  // 💭 Helpers

  const generateExpectedBoard = (input: IPlacePieceWrapperParams) => {
    const expectedBoard: Gameboard = Array.from({ length: 10 }, () =>
      Array(10).fill(playerState.gameboardBuilder.fillValue)
    );

    const shipSymbol: ShipSymbolValue = input.ship.symbol;
    const coordinates: Coordinates = input.coordinates;
    const [x, y]: Coordinates = coordinates;
    const shipLength: ShipLength = input.ship.length;
    const orientation: Orientation = input.orientation;

    if (orientation === 'horizontal') {
      for (let i = x; i < x + shipLength; i++) {
        expectedBoard[y][i] = shipSymbol;
      }
    } else {
      for (let i = y; i < y + shipLength; i++) {
        expectedBoard[i][x] = shipSymbol;
      }
    }

    return expectedBoard;
  };

  const generateCoordinates = (bowX: number, bowY: number): Coordinates => [
    bowX,
    bowY,
  ];

  const generateOrientation = (orientation: Orientation): Orientation => {
    return orientation;
  };

  const generateOverlapErrorMessage = ({
    ship,
    coordinates,
    orientation,
  }: IPlacePieceWrapperParams): string =>
    `"${JSON.stringify(
      createPositionObject(coordinates, orientation, ship.length)
    )}" is unavailable for ship with Size: ${
      ship.length
    } and Orientation: ${orientation}.`;

  const generateOutOfBoundsErrorMessage = ({
    ship,
    coordinates,
    orientation,
  }: IPlacePieceWrapperParams): string => {
    return `Invalid Command: The ship placement attempt with the following configurations is out of bounds - Coordinates: ${coordinates}, Length: ${ship.length}, Orientation: ${orientation}.`;
  };

  // 💭 --------------------------------------------------------------
  // 💭 Tests

  describe('ship placement', () => {
    const validPlacementTestCases = [
      {
        input: {
          ship: getNewCarrierTestShip(),
          coordinates: generateCoordinates(0, 3),
          orientation: generateOrientation('horizontal'),
        },
        expected: generateExpectedBoard({
          ship: getNewCarrierTestShip(),
          coordinates: [0, 3],
          orientation: 'horizontal',
        }),
      },
      {
        input: {
          ship: getNewCarrierTestShip(),
          coordinates: generateCoordinates(4, 5),
          orientation: generateOrientation('vertical'),
        },
        expected: generateExpectedBoard({
          ship: getNewCarrierTestShip(),
          coordinates: [4, 5],
          orientation: 'vertical',
        }),
      },
    ];

    test.each(validPlacementTestCases)(
      'ship is placed correctly on the gameboard',
      ({ input, expected }) => {
        placeShip(input);
        expect(playerState.gameboardBuilder.board).toEqual(expected);
      }
    );
  });

  describe('ship overlap', () => {
    const getNewSubmarineTestShip = (): BattleshipBuilder =>
      BattleshipFleetBuilder.createHasbroFleet().getShip(ShipType.Submarine);

    const overlapTestCases = [
      {
        input: {
          ship: getNewSubmarineTestShip(),
          coordinates: generateCoordinates(3, 0),
          orientation: generateOrientation('horizontal'),
        },
        expectedError: generateOverlapErrorMessage({
          ship: getNewSubmarineTestShip(),
          coordinates: [3, 0],
          orientation: 'horizontal',
        }),
      },
      {
        input: {
          ship: getNewSubmarineTestShip(),
          coordinates: generateCoordinates(3, 0),
          orientation: generateOrientation('vertical'),
        },
        expectedError: generateOverlapErrorMessage({
          ship: getNewSubmarineTestShip(),
          coordinates: [3, 0],
          orientation: 'vertical',
        }),
      },
    ];

    test.each(overlapTestCases)(
      'ship placement overlap throws error',
      ({ input, expectedError }) => {
        placeShip({
          ship: getNewCarrierTestShip(),
          coordinates: [0, 0],
          orientation: 'horizontal',
        });
        expect(() => placeShip(input)).toThrow(expectedError);
      }
    );
  });

  describe('ship boundary', () => {
    const outOfBoundsTestCases = [
      {
        input: {
          ship: getNewCarrierTestShip(),
          coordinates: generateCoordinates(7, 0),
          orientation: generateOrientation('horizontal'),
        },
        expectedError: generateOutOfBoundsErrorMessage({
          ship: getNewCarrierTestShip(),
          coordinates: [7, 0],
          orientation: 'horizontal',
        }),
      },
      {
        input: {
          ship: getNewCarrierTestShip(),
          coordinates: generateCoordinates(0, 8),
          orientation: generateOrientation('vertical'),
        },
        expectedError: generateOutOfBoundsErrorMessage({
          ship: getNewCarrierTestShip(),
          coordinates: [0, 8],
          orientation: 'vertical',
        }),
      },
    ];

    test.each(outOfBoundsTestCases)(
      'ship placement out of bounds throws error',
      ({ input, expectedError }) => {
        expect(() => placeShip(input)).toThrow(expectedError);
      }
    );
  });
});