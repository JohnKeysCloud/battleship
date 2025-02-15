import { InstructionsComponent } from "../../../components/buttons/instructions-component/instructions-component";
import { FragmentKey } from "../../../types/markup-types";
import { createMainOneParabellumFragment } from "./main-one-parabellum";
import { createMainOneBellumFragment } from "./main-one-bellum";
import { createMainOnePostBellumFragment } from "./main-one-post-bellum";
import { HotSwapContainer } from "../../../utilities/create-hot-swap-container";

export function createMainContainerOne(
  instructionsButton: InstructionsComponent
): HotSwapContainer {
  const mainOneFragments: { [key in FragmentKey]: DocumentFragment } = {
    parabellum: createMainOneParabellumFragment(instructionsButton),
    bellum: createMainOneBellumFragment(),
    postBellum: createMainOnePostBellumFragment(),
  };

  const mainContainerOne = new HotSwapContainer(
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