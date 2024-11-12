import { BattleshipBuilder } from './typescript/logic/bs-ship-builder/bs-ship-builder';
import { randomizeGameboard } from './typescript/setup/randomize-gameboard';
import { players } from './typescript/state/player-state';

// expose players object to global scope for console fun
window['playerObj'] = players;

function init() {
  const randomizeGameboards = () => {
    randomizeGameboard(players.playerOne);
    randomizeGameboard(players.playerTwo);
  };

  // benchmark board set randomization
  console.time('randomizeGameboards');
  randomizeGameboards();
  console.timeEnd('randomizeGameboards');

  // 💭 --------------------------------------------------------------
  // 💭 ----------------- TESTING GAMEBOARD METHODS ------------------

  const computerBoardInstance = players.playerTwo.gameboardInstance;
  const computerCarrier: BattleshipBuilder = players.playerTwo.fleet.carrier!;

  // Should log warning because ship is already placed
  computerBoardInstance.placePiece({ ship: computerCarrier, coordinates: [0, 0], orientation: 'horizontal' });
  
  // initial board print
  console.log('Initial randomized board');
  computerBoardInstance.prettyPrint();
  
  // rotate ship once
  console.log(`Rotate ${computerCarrier.type}`);
  computerBoardInstance.rotatePiece(computerCarrier);
  computerBoardInstance.prettyPrint();
  
  // rotate ship again
  console.log(`Rotate ${computerCarrier.type}`);
  computerBoardInstance.rotatePiece(computerCarrier);
  computerBoardInstance.prettyPrint();
  
  // rotate ship another time
  console.log(`Rotate ${computerCarrier.type}`);
  computerBoardInstance.rotatePiece(computerCarrier);
  computerBoardInstance.prettyPrint();
  
  // rotate ship penultimately
  console.log(`Rotate ${computerCarrier.type}`);
  computerBoardInstance.rotatePiece(computerCarrier);
  computerBoardInstance.prettyPrint();
  
  // rotate ship once more
  console.log(`Rotate ${computerCarrier.type}`);
  computerBoardInstance.rotatePiece(computerCarrier);
  computerBoardInstance.prettyPrint();
  
  // move da ship
  console.log(`Move ${computerCarrier.type}`);
  computerBoardInstance.movePiece(computerCarrier, [9, 0]);
  computerBoardInstance.prettyPrint();
  
  // rotate ship in new position
  console.log(`Rotate ${computerCarrier.type}`);
  computerBoardInstance.rotatePiece(computerCarrier);
  computerBoardInstance.prettyPrint();
  
  // rotate ship penultimately, again
  console.log(`Rotate ${computerCarrier.type}`);
  computerBoardInstance.rotatePiece(computerCarrier);
  computerBoardInstance.prettyPrint();
  
  // rotate ship once more, again
  console.log(`Rotate ${computerCarrier.type}`);
  computerBoardInstance.rotatePiece(computerCarrier);
  computerBoardInstance.prettyPrint();
  
  // check all coordinates the ship occupies
  console.log(`Print coordinates occupied by ${computerCarrier.type}`);
  console.log(computerBoardInstance.fleetCoordinates)
}

// time all the above stuff
console.time('init');
init();
console.timeEnd('init');