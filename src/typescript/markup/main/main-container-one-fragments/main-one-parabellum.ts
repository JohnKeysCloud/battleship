import { createElement } from "../../../utilities/random-utilities";
import { instructionsLightboxController } from "../../lightboxes/instructions-dialog";

// 💭 Main Container One Parabellum: Heading and Help Button

export function createMainOneParabellumFragment(): DocumentFragment {
  const parabellumHeading = createElement('h2');
  parabellumHeading.textContent = 'Parabellum';

  const informationImage = createElement('img', [], {
    id: 'information-image',
    src: 'https://cyclone-studios.s3.us-east-2.amazonaws.com/s3_misc-images/information-icon.png',
  });

  // ? to open instructions modal
  const informationButton: HTMLButtonElement = createElement('button', [], {
    id: 'information-button',
    type: 'button'
  });
  informationButton.appendChild(informationImage);
  informationButton.addEventListener('click', () => {
    instructionsLightboxController.openLightbox();
  });

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