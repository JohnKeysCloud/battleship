
import { PlayerState } from "../../types/state-types";
import { createElement } from "../../utilities/random-utilities";

import { InstructionsComponent } from "../../components/buttons/instructions-component/instructions-component";
import { instructionsLightboxController } from "../lightboxes/instructions-dialog";

import { createMainContainerOne } from "./main-container-one/main-container-one";
import { MainContainerTwo } from './main-container-two/main-container-two';
import { createMainContainerThree } from "./main-container-three/main-container-three";

export function createMain(players: { player: PlayerState; opponent: PlayerState }) {
  const instructionsButton = new InstructionsComponent(
    instructionsLightboxController
  );

  const mainContainerOne = createMainContainerOne(instructionsButton);
  const mainContainerTwo = new MainContainerTwo(players);
  const mainContainerThree = createMainContainerThree(
    mainContainerTwo.playerGameboard,
    instructionsButton
  );

  const mainElement = createElement('main');
  mainContainerOne.render(mainElement);
  mainContainerTwo.render(mainElement);
  mainContainerThree.render(mainElement);

  return mainElement;
}