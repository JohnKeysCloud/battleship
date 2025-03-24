import { players } from "../../../state/player-state";

import { FragmentKey } from "../../../types/markup-types";

import { PlayerGameboardComponent } from "../../components/player-gameboard-component/player-gameboard-component";
import { InstructionsComponent } from "../../components/buttons/instructions-component/instructions-component";
import { ShipShufflerButtonComponent } from "../../components/buttons/ship-shuffler-component/ship-shuffler-component";
import { ReadyUpButtonComponent } from "../../components/buttons/ready-up-component/ready-up-component";

import { createMainThreeParabellumFragment } from "./main-three-parabellum";
import { createMainThreeBellumFragment } from "./main-three-bellum";
import { createMainThreePostBellumFragment } from "./main-three-post-bellum";

import { CycloneHotSwapContainer } from "../../../utilities/cycloneHotSwapContainer";

export function createMainContainerThree(
  playerGameboardComponent: PlayerGameboardComponent,
  instructionsButton: InstructionsComponent,
  transitionToNextPhase: () => void
): CycloneHotSwapContainer {
  const playerGameboardController = players.player.gameboardController;
  const playerFleet = players.player.fleetBuilder.fleet;

  const shipShufflerButton = new ShipShufflerButtonComponent(
    playerGameboardComponent.id,
    playerGameboardComponent.gameboardContainer,
    playerGameboardController,
    playerFleet
  );

  const readyUpButton = new ReadyUpButtonComponent(
    playerGameboardComponent,
    shipShufflerButton,
    instructionsButton,
    transitionToNextPhase,
  );

  const mainThreeFragments: { [key in FragmentKey]: DocumentFragment } = {
    parabellum: createMainThreeParabellumFragment(
      shipShufflerButton,
      readyUpButton
    ),
    bellum: createMainThreeBellumFragment(),
    postBellum: createMainThreePostBellumFragment(),
  };
  const mainContainerThree = new CycloneHotSwapContainer(
    'section',
    mainThreeFragments,
    'parabellum', 
    ['main-container'],
    {
      id: 'main-container-three',
    }
  );

  return mainContainerThree;
}