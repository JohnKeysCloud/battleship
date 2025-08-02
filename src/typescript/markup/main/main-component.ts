import { PlayerCore } from "../../types/state-types";
import { createElement } from "../../utilities/random-utilities";

import { createMainContainerOne } from "./main-container-one/main-container-one";
import { MainContainerTwo } from './main-container-two/main-container-two';
import { createMainContainerThree } from "./main-container-three/main-container-three";
import { InstructionsComponent } from "../components/buttons/instructions-component/instructions-component";

import { CycloneHotSwapContainer } from "../../utilities/cycloneHotSwapContainer";
import { CycloneLightboxController } from "../../utilities/cycloneLightbox.ts/cyclone-lightbox";
import { CycloneSitRepScroller } from "../../utilities/cycloneSitRepScroller.ts/cyclone-sit-rep-scroller";
import { GameState } from "../../state/game-state";

export class MainComponent {
  private readonly mainElement: HTMLElement = createElement('main');

  public readonly mainContainerOne: CycloneHotSwapContainer;
  public readonly mainContainerTwo: MainContainerTwo;
  public readonly mainContainerThree: CycloneHotSwapContainer;

  private readonly instructionsButton: InstructionsComponent;

  constructor(
    private readonly playerCore: PlayerCore,
    private readonly instructionsLightboxController: CycloneLightboxController,
    private readonly cycloneSitRepScroller: CycloneSitRepScroller,
    // ? maybe set to return string used to update ui via the css-class `player-turn` || `opponent-turn`
    private readonly gameState: GameState
  ) {
    this.instructionsButton = new InstructionsComponent(
      this.instructionsLightboxController
    );

    this.mainContainerOne = this.createMainContainerOne();
    this.mainContainerTwo = new MainContainerTwo(
      this.playerCore,
      this.gameState
    );
    this.mainContainerThree = this.createMainContainerThree();

    this.renderMainContainers();
  }

  private createMainContainerOne(): CycloneHotSwapContainer {
    return createMainContainerOne(
      this.gameState.eventBus,
      this.instructionsButton,
      this.cycloneSitRepScroller
    );
  }

  private createMainContainerThree(): CycloneHotSwapContainer {
    return createMainContainerThree(
      this.mainContainerTwo.playerGameboard,
      this.instructionsButton,
      this.gameState,
      this.playerCore
    );
  }

  private renderMainContainers(): void {
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