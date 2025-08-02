import { InstructionsComponent } from "../../components/buttons/instructions-component/instructions-component";
import { FragmentKey } from "../../../types/dom-types";
import { createMainOneParabellumFragment } from "./main-one-parabellum";
import { createMainOneBellumFragment } from "./main-one-bellum";
import { createMainOnePostBellumFragment } from "./main-one-post-bellum";
import { CycloneHotSwapContainer } from "../../../utilities/cycloneHotSwapContainer";
import { CycloneSitRepScroller } from "../../../utilities/cycloneSitRepScroller.ts/cyclone-sit-rep-scroller";
import { CycloneReactiveText } from "../../../utilities/cycloneTextComponent/cyclone-text-component";
import EventBus from "../../../utilities/event-bus";
import { createElement } from "../../../utilities/random-utilities";

export function createMainContainerOne(
  eventBus: EventBus,
  instructionsButton: InstructionsComponent,
  sitRepContainer: CycloneSitRepScroller
): CycloneHotSwapContainer {
  
  const victoryBanner = createElement('h3', [], { id: 'victory-banner' });
  const victoryBannerController = new CycloneReactiveText(
    victoryBanner,
    eventBus,
    'updateVictoryBannerText'
  );
  victoryBannerController.init();

  const mainOneFragments: { [key in FragmentKey]: DocumentFragment } = {
    parabellum: createMainOneParabellumFragment(instructionsButton),
    bellum: createMainOneBellumFragment(sitRepContainer),
    postBellum: createMainOnePostBellumFragment(victoryBanner),
  };

  const mainContainerOne = new CycloneHotSwapContainer(
    'section',
    mainOneFragments,
    'parabellum',
    ['main-container'],
    {
      id: 'main-container-one',
    }
  );

  return mainContainerOne;
}