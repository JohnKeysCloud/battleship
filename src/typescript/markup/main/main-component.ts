
import { PlayerState } from "../../types/state-types";
import { createElement } from "../../utilities/random-utilities";

import { createMainContainerOne } from "./main-container-one/main-container-one";
import { MainContainerTwo } from './main-container-two/main-container-two';
import { createMainContainerThree } from "./main-container-three/main-container-three";
import { InstructionsComponent } from "../components/buttons/instructions-component/instructions-component";

import { CycloneHotSwapContainer } from "../../utilities/cycloneHotSwapContainer";
import { CycloneLightboxController } from "../../utilities/cycloneLightbox.ts/cyclone-lightbox";

export class MainComponent {
  private readonly mainElement: HTMLElement;
  public readonly mainContainerOne: CycloneHotSwapContainer;
  public readonly mainContainerTwo: MainContainerTwo;
  public readonly mainContainerThree: CycloneHotSwapContainer;
  private readonly instructionsButton: InstructionsComponent;

  constructor(
    private readonly players: { player: PlayerState; opponent: PlayerState },
    private readonly instructionsLightboxController: CycloneLightboxController,
    private readonly transitionToNextPhase: () => void
  ) {
    this.mainElement = createElement('main');

    this.instructionsButton = new InstructionsComponent(
      this.instructionsLightboxController
    );

    this.mainContainerOne = createMainContainerOne(this.instructionsButton);
    this.mainContainerTwo = new MainContainerTwo(this.players);
    this.mainContainerThree = createMainContainerThree(
      this.mainContainerTwo.playerGameboard,
      this.instructionsButton,
      this.transitionToNextPhase
    );

    this.mainContainerOne.render(this.mainElement);
    this.mainContainerTwo.render(this.mainElement);
    this.mainContainerThree.render(this.mainElement);
  }

  public render(targetElement: HTMLElement) {
    if (!targetElement) {
      throw new Error(`Target element not found. Recieved ${targetElement}.`);
    }

    targetElement.appendChild(this.mainElement);
  }
}