import { createElement } from "../../../utilities/random-utilities";

export function createMainThreePostBellumFragment(): DocumentFragment {

  // ! Play again button and find new opponent button (disabled) 

  const mainContainerThreePostBellumWrapper = createElement('div', ['post-bellum'], {
    id: 'main-container-three-post-bellum',
  });

  const bellumFragment = new DocumentFragment();
  bellumFragment.appendChild(mainContainerThreePostBellumWrapper);

  return bellumFragment;
}
