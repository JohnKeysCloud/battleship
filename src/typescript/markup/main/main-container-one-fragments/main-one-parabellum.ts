import { InstructionsComponent } from "../../../components/buttons/instructions-component/instructions-component";
import { createElement } from "../../../utilities/random-utilities";
import { instructionsLightboxController } from "../../lightboxes/instructions-dialog";

// 💭 Main Container One Parabellum: Heading and Help Button

export function createMainOneParabellumFragment(): DocumentFragment {
  const parabellumHeading = createElement('h2');
  parabellumHeading.textContent = 'Parabellum';

  const instructionsButton = new InstructionsComponent(instructionsLightboxController);

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