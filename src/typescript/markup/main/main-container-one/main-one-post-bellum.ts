import { createElement } from '../../../utilities/random-utilities';


// 💭 Main Container One Post Bellum: <Insert Here>
// ! Game over message with winner and loser text and a button to restart the game

export function createMainOnePostBellumFragment(
  victoryBanner: HTMLElement
): DocumentFragment {
  const parabellumHeading: HTMLHeadingElement = createElement(
    'h2',
    ['secondary-heading'],
    {
      id: 'game-over-heading',
    }
  );
  parabellumHeading.textContent = 'Game Over';

  const mainContainerPostBellumWrapper: HTMLDivElement = createElement(
    'div',
    ['post-bellum'],
    {
      id: 'main-container-one-post-bellum',
    }
  );
  mainContainerPostBellumWrapper.append(parabellumHeading, victoryBanner);

  const postBellumFragment: DocumentFragment = new DocumentFragment();
  postBellumFragment.appendChild(mainContainerPostBellumWrapper);

  return postBellumFragment;
}