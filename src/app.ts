import { BattleshipBuilder } from './typescript/logic/bs-ship-builder/bs-ship-builder';
import { BattleshipBoardController } from './typescript/logic/bs-gameboard-controller/bs-gameboard-controller';
import { randomizeGameboard } from './typescript/setup/randomize-gameboard';
import { players } from './typescript/state/player-state';
import { GameboardComponent } from './typescript/components/bs-gameboard-component/bs-gameboard-component';
import './styles/sass/main.scss'
import { ShipType } from './typescript/types/logic-types';

function init() {
  const randomizeGameboards = () => {
    randomizeGameboard(players.playerOne);
    randomizeGameboard(players.playerTwo);
  };

  // benchmark board set randomization
  console.time('randomizeGameboards');
  randomizeGameboards();
  console.timeEnd('randomizeGameboards'); 

  // create and render gameboard component to '#content`
  const gameboardComponent = new GameboardComponent('playerTwo', players.playerTwo);
  gameboardComponent.render('#content');

  // 💭 --------------------------------------------------------------
  // 💭 RANDOMIZER BUTTON COMPONENT
  
  // randomizer button
  const randomizeBoardButton = document.createElement('button');
  randomizeBoardButton.textContent = 'Randomize Board'
  const content = document.getElementById('content');
  content?.appendChild(randomizeBoardButton);

  randomizeBoardButton.addEventListener('click', () => {
    players.playerTwo.gameboardController.removeAllPieces();
    randomizeGameboard(players.playerTwo);
    gameboardComponent.render('#content');
  });

  // 💭 --------------------------------------------------------------

  // 💭 --------------------------------------------------------------
  // 💭 ----------------- TESTING GAMEBOARD METHODS ------------------

  const computerBoardController: BattleshipBoardController = players.playerTwo.gameboardController;
  const computerBoardRepository = players.playerTwo.gameboardRepository;
  const computerCarrier: BattleshipBuilder = players.playerTwo.fleetBuilder.fleet.carrier!;

  // // * Should log warning because ship is already placed
  // // console.log('Intentional invalid ship placement:')
  // // computerBoardController.placePiece({ ship: computerCarrier, coordinates: [0, 0], orientation: 'horizontal' });
  
  // console.log('Initial fleet coordinates:');
  // console.log(computerBoardRepository.fleetCoordinates);

  // // * initial board print
  // console.log('Initial randomized board');
  // computerBoardController.prettyPrint();
  // console.log('Fleet coordinates:');
  // console.log(computerBoardRepository.fleetCoordinates);
  
  // // * rotate ship once
  // console.log(`Rotate ${computerCarrier.type}:`);
  // computerBoardController.rotatePiece(computerCarrier);
  // computerBoardController.prettyPrint();
  // console.log('Fleet coordinates:');
  // console.log(computerBoardRepository.fleetCoordinates);
  
  // // * rotate ship again
  // console.log(`Rotate ${computerCarrier.type}:`);
  // computerBoardController.rotatePiece(computerCarrier);
  // computerBoardController.prettyPrint();
  // console.log('Fleet coordinates:');
  // console.log(computerBoardRepository.fleetCoordinates);
  
  // // * rotate ship another time
  // console.log(`Rotate ${computerCarrier.type}:`);
  // computerBoardController.rotatePiece(computerCarrier);
  // computerBoardController.prettyPrint();
  // console.log('Fleet coordinates:');
  // console.log(computerBoardRepository.fleetCoordinates);
  
  // // * rotate ship penultimately
  // console.log(`Rotate ${computerCarrier.type}:`);
  // computerBoardController.rotatePiece(computerCarrier);
  // computerBoardController.prettyPrint();
  // console.log('Fleet coordinates:');
  // console.log(computerBoardRepository.fleetCoordinates);
  
  // // * rotate ship once more
  // console.log(`Rotate ${computerCarrier.type}:`);
  // computerBoardController.rotatePiece(computerCarrier);
  // computerBoardController.prettyPrint();
  // console.log('Fleet coordinates:');
  // console.log(computerBoardRepository.fleetCoordinates);
  
  // // * move da ship
  // console.log(`Move ${computerCarrier.type}:`);
  // computerBoardController.movePiece(computerCarrier, [9, 0]);
  // computerBoardController.prettyPrint();
  // console.log('Fleet coordinates:');
  // console.log(computerBoardRepository.fleetCoordinates);
  
  // // * rotate ship in new position
  // console.log(`Rotate ${computerCarrier.type}:`);
  // computerBoardController.rotatePiece(computerCarrier);
  // computerBoardController.prettyPrint();
  // console.log('Fleet coordinates:');
  // console.log(computerBoardRepository.fleetCoordinates);
  
  // // * rotate ship penultimately, again
  // console.log(`Rotate ${computerCarrier.type}:`);
  // computerBoardController.rotatePiece(computerCarrier);
  // computerBoardController.prettyPrint();
  // console.log('Fleet coordinates:');
  // console.log(computerBoardRepository.fleetCoordinates);
  
  // // * rotate ship once more, again
  // console.log(`Rotate ${computerCarrier.type}:`);
  // computerBoardController.rotatePiece(computerCarrier);
  // computerBoardController.prettyPrint();
  
  // // * check all coordinates the ship occupies
  // console.log('Final fleet coordinates:');
  // console.log(computerBoardRepository.fleetCoordinates);
}

// time all the above stuff
console.time('init');
init();
console.timeEnd('init');