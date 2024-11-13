import { BattleshipBuilder } from './typescript/logic/bs-ship-builder/bs-ship-builder';
import { BattleshipBoardController } from './typescript/logic/bs-gameboard-controller/bs-gameboard-controller';
import { randomizeGameboard } from './typescript/setup/randomize-gameboard';
import { players } from './typescript/state/player-state';

// expose players object to global scope for console fun
window['playerObj'] = players;

function init() {

  console.log()


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

  const computerBoardBuilder = players.playerTwo.gameboardBuilder;
  const computerBoardController = new BattleshipBoardController(computerBoardBuilder);
  const computerCarrier: BattleshipBuilder = players.playerTwo.fleet.carrier!;

  // Should log warning because ship is already placed
  console.log('Intentional invalid ship placement:')
  computerBoardController.placePiece({ ship: computerCarrier, coordinates: [0, 0], orientation: 'horizontal' });
  
  // initial board print
  console.log('Initial randomized board');
  computerBoardController.prettyPrint();
  
  // rotate ship once
  console.log(`Rotate ${computerCarrier.type}:`);
  computerBoardController.rotatePiece(computerCarrier);
  computerBoardController.prettyPrint();
  
  // rotate ship again
  console.log(`Rotate ${computerCarrier.type}:`);
  computerBoardController.rotatePiece(computerCarrier);
  computerBoardController.prettyPrint();
  
  // rotate ship another time
  console.log(`Rotate ${computerCarrier.type}:`);
  computerBoardController.rotatePiece(computerCarrier);
  computerBoardController.prettyPrint();
  
  // rotate ship penultimately
  console.log(`Rotate ${computerCarrier.type}:`);
  computerBoardController.rotatePiece(computerCarrier);
  computerBoardController.prettyPrint();
  
  // rotate ship once more
  console.log(`Rotate ${computerCarrier.type}:`);
  computerBoardController.rotatePiece(computerCarrier);
  computerBoardController.prettyPrint();
  
  // move da ship
  console.log(`Move ${computerCarrier.type}:`);
  computerBoardController.movePiece(computerCarrier, [9, 0]);
  computerBoardController.prettyPrint();
  
  // rotate ship in new position
  console.log(`Rotate ${computerCarrier.type}:`);
  computerBoardController.rotatePiece(computerCarrier);
  computerBoardController.prettyPrint();
  
  // rotate ship penultimately, again
  console.log(`Rotate ${computerCarrier.type}:`);
  computerBoardController.rotatePiece(computerCarrier);
  computerBoardController.prettyPrint();
  
  // rotate ship once more, again
  console.log(`Rotate ${computerCarrier.type}:`);
  computerBoardController.rotatePiece(computerCarrier);
  computerBoardController.prettyPrint();
  
  // check all coordinates the ship occupies
  console.log(`Print coordinates occupied by ${computerCarrier.type}:`);
  console.log(computerBoardController.fleetCoordinates)
}

// time all the above stuff
console.time('init');
init();
console.timeEnd('init');