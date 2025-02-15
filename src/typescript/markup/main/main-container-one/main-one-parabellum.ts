import { InstructionsComponent } from "../../../components/buttons/instructions-component/instructions-component";
import { createElement } from "../../../utilities/random-utilities";

// 💭 Main Container One Parabellum: Heading and Help Button

export function createMainOneParabellumFragment(
  instructionsButton: InstructionsComponent
): DocumentFragment {
  const parabellumHeading = createElement('h2');
  parabellumHeading.textContent = 'Parabellum';

  const mainContainerOneParabellumWrapper: HTMLDivElement = createElement(
    'div',
    ['parabellum'],
    {
      id: 'main-container-one-parabellum',
    }
  );

  mainContainerOneParabellumWrapper.append(parabellumHeading);
  instructionsButton.render(mainContainerOneParabellumWrapper);

  const parabellumFragment: DocumentFragment = new DocumentFragment();
  parabellumFragment.append(mainContainerOneParabellumWrapper);

  return parabellumFragment;
}