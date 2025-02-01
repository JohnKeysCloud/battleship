import '../../styles/sass/index.scss';

import { players } from '../state/player-state';

// 💭 markup
import { createHeader } from '../markup/header/header';
import { createMain } from '../markup/main/main';
import { instructionsDialog } from '../markup/lightboxes/instructions-dialog';

// 💭 --------------------------------------------------------------

export function createDOM() {
  const content = document.getElementById('content');
  if (!content) throw new Error('Fuck!');

  const header = createHeader();
  const mainElement = createMain(players);
  content.append(header, mainElement);

  instructionsDialog.render(document.body);
}
