import { BattleshipBuilder } from './typescript/logic/bs-ship-builder/bs-ship-builder';
import { randomizeGameboard } from './typescript/setup/randomize-gameboard';
import { players } from './typescript/state/player-state';

function init() {
  const randomizeGameboards = () => {
    randomizeGameboard(players.playerOne);
    randomizeGameboard(players.playerTwo);
  };

  console.time('randomizeGameboards');
  randomizeGameboards();
  console.timeEnd('randomizeGameboards');

  const computerBoardInstance = players.playerTwo.gameboardInstance;
  const computerCarrier: BattleshipBuilder = players.playerTwo.fleet.carrier;
  computerBoardInstance.prettyPrint();
  computerBoardInstance.removePiece(computerCarrier);
  computerBoardInstance.prettyPrint();
}

console.time('init');
init();
console.timeEnd('init');


