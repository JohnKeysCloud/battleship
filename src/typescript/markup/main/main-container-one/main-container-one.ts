import { InstructionsComponent } from "../../components/buttons/instructions-component/instructions-component";
import { FragmentKey } from "../../../types/markup-types";
import { createMainOneParabellumFragment } from "./main-one-parabellum";
import { createMainOneBellumFragment } from "./main-one-bellum";
import { createMainOnePostBellumFragment } from "./main-one-post-bellum";
import { CycloneHotSwapContainer } from "../../../utilities/cycloneHotSwapContainer";

export function createMainContainerOne(
  instructionsButton: InstructionsComponent
): CycloneHotSwapContainer {
  const mainOneFragments: { [key in FragmentKey]: DocumentFragment } = {
    parabellum: createMainOneParabellumFragment(instructionsButton),
    bellum: createMainOneBellumFragment(),
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