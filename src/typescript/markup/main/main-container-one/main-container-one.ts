import { InstructionsComponent } from "../../components/buttons/instructions-component/instructions-component";
import { FragmentKey } from "../../../types/dom-types";
import { createMainOneParabellumFragment } from "./main-one-parabellum";
import { createMainOneBellumFragment } from "./main-one-bellum";
import { createMainOnePostBellumFragment } from "./main-one-post-bellum";
import { CycloneHotSwapContainer } from "../../../utilities/cycloneHotSwapContainer";
import { CycloneSitRepScroller } from "../../../utilities/cycloneSitRepScroller.ts/cyclone-sit-rep-scroller";

export function createMainContainerOne(
  instructionsButton: InstructionsComponent,
  sitRepContainer: CycloneSitRepScroller
): CycloneHotSwapContainer {
  const mainOneFragments: { [key in FragmentKey]: DocumentFragment } = {
    parabellum: createMainOneParabellumFragment(instructionsButton),
    bellum: createMainOneBellumFragment(sitRepContainer),
    postBellum: createMainOnePostBellumFragment(),
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