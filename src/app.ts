import './styles/sass/index.scss'
import { players } from './typescript/state/player-state';
import { randomizeBSGameboard } from './typescript/setup/randomize-bs-gameboard';

import { BotGameboardComponent } from './typescript/components/bot-gameboard-component/bot-gameboard-component';
import { PlayerGameboardComponent } from './typescript/components/player-gameboard-component/player-gameboard-component';
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

  // 💭 --------------------------------------------------------------
  // 💭 Player
  const playerGameboardComponent = new PlayerGameboardComponent(
    'playerOne',
    players.playerOne
  );
  playerGameboardComponent.render('#content');

  const shipShuffler = new ShipShufflerButtonComponent(
    players.playerOne.gameboardController,
    players.playerOne.fleetBuilder.fleet,
    '#content',
    'player-one-ship-shuffler-button'
  );

  shipShuffler.render('#content');

  // 💭 --------------------------------------------------------------
  // 💭 Bot
  const botGameboardComponent = new BotGameboardComponent('botOne', players.playerTwo);
  botGameboardComponent.render('#content');
}

// time all the above stuff
console.time('init');
init();
console.timeEnd('init');