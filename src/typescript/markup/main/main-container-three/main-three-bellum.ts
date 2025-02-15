import { createElement } from "../../../utilities/random-utilities";

export function createMainThreeBellumFragment(): DocumentFragment {

  // ! Fleet hit-points visual feedback

  const mainContainerThreeBellumWrapper = createElement('div', ['bellum'], {
    id: 'main-container-three-bellum',
  });

  const bellumFragment = new DocumentFragment();
  bellumFragment.appendChild(mainContainerThreeBellumWrapper);

  return bellumFragment;
}

