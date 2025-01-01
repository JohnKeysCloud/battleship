import { BattleshipBuilder } from './typescript/logic/bs-ship-builder/bs-ship-builder';
import { BattleshipBoardController } from './typescript/logic/bs-gameboard-controller/bs-gameboard-controller';
import { randomizeBSGameboard } from './typescript/setup/randomize-bs-gameboard';
import { players } from './typescript/state/player-state';
import { PlayerGameboardComponent } from './typescript/components/player-gameboard-component/player-gameboard-component';
import './styles/sass/index.scss'
import { ShipShufflerButtonComponent } from './typescript/components/ship-shuffler-component/ship-shuffler-component';

function init() {
  const randomizeBSGameboards = () => {
    randomizeBSGameboard(
      players.playerOne.gameboardController,
      players.playerOne.fleetBuilder.fleet
    );
    randomizeBSGameboard(
      players.playerTwo.gameboardController,
      players.playerTwo.fleetBuilder.fleet
    );
  };

  // benchmark board set randomization
  console.time('randomizeBSGameboards');
  randomizeBSGameboards();
  console.timeEnd('randomizeBSGameboards'); 

  // create and render gameboard component to '#content`
  const playerGameboardComponent = new PlayerGameboardComponent('playerTwo', players.playerTwo);
  playerGameboardComponent.render('#content');

  const shipShuffler = new ShipShufflerButtonComponent(
    players.playerTwo.gameboardController,
    players.playerTwo.fleetBuilder.fleet,
    '#content',
    'player-one-ship-shuffler-button',
  );

  shipShuffler.render('#content');

  // 💭 --------------------------------------------------------------
  // 💭 ----------------- TESTING GAMEBOARD METHODS ------------------

  const computerBoardController: BattleshipBoardController = players.playerTwo.gameboardController;
  const computerBoardRepository = players.playerTwo.gameboardRepository;
  const computerCarrier: BattleshipBuilder = players.playerTwo.fleetBuilder.fleet.carrier!;

}

// time all the above stuff
console.time('init');
init();
console.timeEnd('init');