import { createElement } from '../../../utilities/random-utilities';

// 💭 Main Container One Bellum: <Insert Here>
// ! Player turn state text with hit, miss, sunken ship text notifications

export function createMainOneBellumFragment(): DocumentFragment {

  // !

  const mainContainerOneBellumWrapper: HTMLDivElement = createElement('div', ['bellum'], {
    id: 'main-container-one-bellum',
  });

  const bellumFragment: DocumentFragment = new DocumentFragment();
  bellumFragment.appendChild(mainContainerOneBellumWrapper);

  return bellumFragment;
}
