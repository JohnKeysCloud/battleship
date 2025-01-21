import './styles/sass/index.scss'

import { createElement } from './typescript/utilities/random-utilities';
import { players } from './typescript/state/player-state';
import { randomizeBSGameboard } from './typescript/setup/randomize-bs-gameboard';
import { createGitHubLink } from './typescript/utilities/create-github-link';
import { createMain } from './typescript/markup/main/create-main';

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

  // 💭 --------------------------------------------------------------

  // ? ./typescript/markup/nav/create-nav.ts)

  const headingLink = createElement('a', ['heading-link'], {
    id: 'heading-link',
    href: 'https://johnkeyscloud.github.io/battleship/',
  });
  headingLink.textContent = 'ShattleBip';

  const heading: HTMLHeadingElement = createElement('h1', ['main-heading']);
  heading.appendChild(headingLink);

  const gitHubLogoLink: HTMLAnchorElement = createGitHubLink();

  const navigation: HTMLElement = createElement('nav');
  navigation.append(heading, gitHubLogoLink);

  content.appendChild(navigation); // 💭

  // 💭 --------------------------------------------------------------

  const mainElement = createMain(players);
  content.appendChild(mainElement);
}

// time all the above stuff
console.time('init');
init();
console.timeEnd('init');