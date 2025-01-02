import { createLogicTestObject } from './utilities/logic-test-init';
import { BattleshipBoardBuilder } from '../../bs-gameboard-builder/bs-gameboard-builder';
import { BattleshipBoardController } from '../bs-gameboard-controller';

let logicTestObject = createLogicTestObject();

let testBoardBuilder: BattleshipBoardBuilder = logicTestObject.boardBuilder;
let testBoardController: BattleshipBoardController = logicTestObject.boardController;

beforeEach(() => {
  logicTestObject = createLogicTestObject();
  testBoardBuilder = logicTestObject.boardBuilder;
  testBoardController = logicTestObject.boardController;
});

// 💭
test('test', () => {
  expect(true).toBe(true);
});
