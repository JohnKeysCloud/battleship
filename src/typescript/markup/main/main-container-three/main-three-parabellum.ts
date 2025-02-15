import { createElement } from "../../../utilities/random-utilities";
import { ShipShufflerButtonComponent } from "../../../components/buttons/ship-shuffler-component/ship-shuffler-component";
import { ReadyUpButtonComponent } from "../../../components/buttons/ready-up-component/ready-up-component";

export function createMainThreeParabellumFragment(
  shipShufflerButton: ShipShufflerButtonComponent,
  readyUpButton: ReadyUpButtonComponent
): DocumentFragment {  
  const mainContainerThreeParabellumWrapper: HTMLDivElement = createElement(
    'div',
    ['parabellum'],
    {
      id: 'main-container-three-parabellum',
    }
  );
  shipShufflerButton.render(mainContainerThreeParabellumWrapper);
  readyUpButton.render(mainContainerThreeParabellumWrapper);

  const parabellumFragment = new DocumentFragment();
  parabellumFragment.appendChild(mainContainerThreeParabellumWrapper);

  return parabellumFragment;
};