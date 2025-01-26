import './styles/sass/index.scss'

import { players } from './typescript/state/player-state';
import { randomizeBSGameboard } from './typescript/setup/randomize-bs-gameboard';
import { createHeader } from './typescript/markup/header/header';
import { createMain } from './typescript/markup/main/main';

function init() {
  const randomizeBSGameboards = () => {
    randomizeBSGameboard(
      players.player.gameboardController,
      players.player.fleetBuilder.fleet
    );
    randomizeBSGameboard(
      players.opponent.gameboardController,
      players.opponent.fleetBuilder.fleet
    );
  };

  // benchmark board set randomization
  console.time('randomizeBSGameboards');
  randomizeBSGameboards();
  console.timeEnd('randomizeBSGameboards');

  // > --------------------------------------------------------------
  // > DOM

  const content = document.getElementById('content');
  if (!content) throw new Error('Fuck!');

  const header = createHeader();
  const mainElement = createMain(players);
  content.append(header, mainElement);
}

// time all the above stuff
console.time('init');
init();
console.timeEnd('init');