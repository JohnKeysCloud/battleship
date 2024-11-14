import { BattleshipBuilder } from './typescript/logic/bs-ship-builder/bs-ship-builder';
import { BattleshipBoardController } from './typescript/logic/bs-gameboard-controller/bs-gameboard-controller';
import { randomizeGameboard } from './typescript/setup/randomize-gameboard';
import { players } from './typescript/state/player-state';
import { BattleshipBoardBuilder } from './typescript/logic/bs-gameboard-builder/bs-gameboard-builder';

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

  const computerBoardController: BattleshipBoardController = players.playerTwo.gameboardController;
  const computerCarrier: BattleshipBuilder = players.playerTwo.fleetBuilder.fleet.carrier!;

  // * Should log warning because ship is already placed
  // console.log('Intentional invalid ship placement:')
  // computerBoardController.placePiece({ ship: computerCarrier, coordinates: [0, 0], orientation: 'horizontal' });
  
  console.log('Initial fleet coordinates:');
  console.log(computerBoardController.fleetCoordinates);

  // * initial board print
  console.log('Initial randomized board');
  computerBoardController.prettyPrint();
  console.log('Fleet coordinates:');
  console.log(computerBoardController.fleetCoordinates);
  
  // * rotate ship once
  console.log(`Rotate ${computerCarrier.type}:`);
  computerBoardController.rotatePiece(computerCarrier);
  computerBoardController.prettyPrint();
  console.log('Fleet coordinates:');
  console.log(computerBoardController.fleetCoordinates);
  
  // * rotate ship again
  console.log(`Rotate ${computerCarrier.type}:`);
  computerBoardController.rotatePiece(computerCarrier);
  computerBoardController.prettyPrint();
  console.log('Fleet coordinates:');
  console.log(computerBoardController.fleetCoordinates);
  
  // * rotate ship another time
  console.log(`Rotate ${computerCarrier.type}:`);
  computerBoardController.rotatePiece(computerCarrier);
  computerBoardController.prettyPrint();
  console.log('Fleet coordinates:');
  console.log(computerBoardController.fleetCoordinates);
  
  // * rotate ship penultimately
  console.log(`Rotate ${computerCarrier.type}:`);
  computerBoardController.rotatePiece(computerCarrier);
  computerBoardController.prettyPrint();
  console.log('Fleet coordinates:');
  console.log(computerBoardController.fleetCoordinates);
  
  // * rotate ship once more
  console.log(`Rotate ${computerCarrier.type}:`);
  computerBoardController.rotatePiece(computerCarrier);
  computerBoardController.prettyPrint();
  console.log('Fleet coordinates:');
  console.log(computerBoardController.fleetCoordinates);
  
  // * move da ship
  console.log(`Move ${computerCarrier.type}:`);
  computerBoardController.movePiece(computerCarrier, [9, 0]);
  computerBoardController.prettyPrint();
  console.log('Fleet coordinates:');
  console.log(computerBoardController.fleetCoordinates);
  
  // * rotate ship in new position
  console.log(`Rotate ${computerCarrier.type}:`);
  computerBoardController.rotatePiece(computerCarrier);
  computerBoardController.prettyPrint();
  console.log('Fleet coordinates:');
  console.log(computerBoardController.fleetCoordinates);
  
  // * rotate ship penultimately, again
  console.log(`Rotate ${computerCarrier.type}:`);
  computerBoardController.rotatePiece(computerCarrier);
  computerBoardController.prettyPrint();
  console.log('Fleet coordinates:');
  console.log(computerBoardController.fleetCoordinates);
  
  // * rotate ship once more, again
  console.log(`Rotate ${computerCarrier.type}:`);
  computerBoardController.rotatePiece(computerCarrier);
  computerBoardController.prettyPrint();
  
  // * check all coordinates the ship occupies
  console.log('Final fleet coordinates:');
  console.log(computerBoardController.fleetCoordinates);
}

// time all the above stuff
console.time('init');
init();
console.timeEnd('init');