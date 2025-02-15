import { createElement } from '../../../utilities/random-utilities';

// 💭 Main Container One Post Bellum: <Insert Here>
// ! Game over message with winner and loser text and a button to restart the game

export function createMainOnePostBellumFragment(): DocumentFragment {
  // !

  const mainContainerPostBellumWrapper: HTMLDivElement = createElement(
    'div',
    ['bellum'],
    {
      id: 'main-container-one-post-bellum',
    }
  );

  const postBellumFragment: DocumentFragment = new DocumentFragment();
  postBellumFragment.appendChild(mainContainerPostBellumWrapper);

  return postBellumFragment;
}