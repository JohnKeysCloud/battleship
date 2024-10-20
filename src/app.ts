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

  computerBoardInstance.prettyPrint();
  computerBoardInstance.removePiece([3, 4]);
}

console.time('init');
init();
console.timeEnd('init');


