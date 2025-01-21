import { createElement } from "../../../utilities/random-utilities";

// 💭 Main Container One Parabellum: Heading and Help Button

export function createMainOneParabellumFragment(): DocumentFragment {
  const parabellumHeading = createElement('h2', [], { id: 'subheading' });
  parabellumHeading.textContent = 'Parabellum';

  // ? to open instructions modal
  const instructionsButton: HTMLButtonElement = createElement('button', [], {
    id: 'instructions-button',
  });

  const instructionsButtonContainer: HTMLDivElement = createElement('div', [], {
    id: 'instructions-button-container',
  });
  instructionsButtonContainer.appendChild(instructionsButton);

  const mainContainerOneParabellumWrapper: HTMLDivElement = createElement(
    'div',
    ['parabellum'],
    {
      id: 'main-container-one-parabellum',
    }
  );
  mainContainerOneParabellumWrapper.append(
    parabellumHeading,
    instructionsButtonContainer
  );

  const parabellumFragment: DocumentFragment = new DocumentFragment();
  parabellumFragment.append(mainContainerOneParabellumWrapper);

  return parabellumFragment;
}