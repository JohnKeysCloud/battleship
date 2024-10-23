import { BattleshipBuilder } from './typescript/logic/bs-ship-builder/bs-ship-builder';
import { randomizeGameboard } from './typescript/setup/randomize-gameboard';
import { players } from './typescript/state/player-state';

function init() {
  const randomizeGameboards = () => {
    randomizeGameboard(players.playerOne);
    randomizeGameboard(players.playerTwo);
  };

  // benchmark board set randomization
  console.time('randomizeGameboards');
  randomizeGameboards();
  console.timeEnd('randomizeGameboards');

  // `movePiece` Test
  const computerBoardInstance = players.playerTwo.gameboardInstance;
  const computerCarrier: BattleshipBuilder = players.playerTwo.fleet.carrier!;
  computerBoardInstance.prettyPrint();
  computerBoardInstance.movePiece(computerCarrier, [0,0]);
  computerBoardInstance.prettyPrint();
}

console.time('init');
init();
console.timeEnd('init');


