import { createElement } from "../../../utilities/random-utilities";

// 💭 Main Container One Parabellum: Heading and Help Button

export function createMainOneParabellumFragment(): DocumentFragment {
  const parabellumHeading = createElement('h2');
  parabellumHeading.textContent = 'Parabellum';

  const informationImage = createElement('img', [], {
    id: 'information-image',
    src: 'https://cdn-icons-png.flaticon.com/512/63/63830.png',
  });

  // ? to open instructions modal
  const informationButton: HTMLButtonElement = createElement('button', [], {
    id: 'information-button',
  });
  informationButton.appendChild(informationImage);

  const informationButtonContainer: HTMLDivElement = createElement('div', [], {
    id: 'information-button-container'
  });
  informationButtonContainer.appendChild(informationButton);

  const mainContainerOneParabellumWrapper: HTMLDivElement = createElement(
    'div',
    ['parabellum'],
    {
      id: 'main-container-one-parabellum',
    }
  );
  mainContainerOneParabellumWrapper.append(
    parabellumHeading,
    informationButtonContainer
  );

  const parabellumFragment: DocumentFragment = new DocumentFragment();
  parabellumFragment.append(mainContainerOneParabellumWrapper);

  return parabellumFragment;
}