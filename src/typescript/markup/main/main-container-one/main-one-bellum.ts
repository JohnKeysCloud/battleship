import { createElement } from '../../../utilities/random-utilities';
import { CycloneSitRepScroller } from '../../../utilities/cycloneSitRepScroller.ts/cyclone-sit-rep-scroller';

// 💭 Main Container One Bellum: Situation Report (turn/attack state messaages)

export function createMainOneBellumFragment(
  sitRepScrollerController: CycloneSitRepScroller
): DocumentFragment {
  const bellumHeading = createElement('h2');
  bellumHeading.textContent = 'Parabellum';

  const latestUpdatesHeading = createElement('h3');
  latestUpdatesHeading.textContent = 'Situation Report:';

  // 💭 --------------------------------------------------------------
  
  const mainContainerOneBellumWrapper: HTMLDivElement = createElement(
    'div',
    ['bellum'],
    {
      id: 'main-container-one-bellum',
    }
  );
  mainContainerOneBellumWrapper.append(
    latestUpdatesHeading,
    sitRepScrollerController.element
  );

  const bellumFragment: DocumentFragment = new DocumentFragment();
  bellumFragment.appendChild(mainContainerOneBellumWrapper);

  return bellumFragment;
}
