import { FragmentKey } from "../../../types/dom-types";

import { PlayerGameboardComponent } from "../../components/gameboard-component/player-gameboard-component/player-gameboard-component";
import { InstructionsComponent } from "../../components/buttons/instructions-component/instructions-component";
import { ShipShufflerButtonComponent } from "../../components/buttons/ship-shuffler-component/ship-shuffler-component";
import { ReadyUpButtonComponent } from "../../components/buttons/ready-up-component/ready-up-component";
import { ScoreBoardComponent } from "../../components/score-board-component/score-board-component";

import { createMainThreeParabellumFragment } from "./main-three-parabellum";
import { createMainThreeBellumFragment } from "./main-three-bellum";
import { createMainThreePostBellumFragment } from "./main-three-post-bellum";

import { CycloneHotSwapContainer } from "../../../utilities/cycloneHotSwapContainer";
import { GameState } from "../../../state/game-state";

import { PlayerCore, PlayerType } from "../../../types/state-types";
import { Fleet} from "../../../types/logic-types";
import { BattleshipFleetBuilder } from "../../../logic/bs-fleet-builder/bs-fleet-builder";


export function createMainContainerThree(
  playerGameboardComponent: PlayerGameboardComponent,
  instructionsButton: InstructionsComponent,
  gameState: GameState,
  playerCore: PlayerCore
): CycloneHotSwapContainer {
  const playerGameboardController = playerCore.player.gameboardController;

  const fleets: { [key in PlayerType]: Fleet } = {
    player: playerCore.player.fleetBuilder.fleet,
    opponent: playerCore.opponent.fleetBuilder.fleet,
  };
  const shipTypes = BattleshipFleetBuilder.shipTypes(gameState.version);

  const shipShufflerButton = new ShipShufflerButtonComponent(
    playerGameboardComponent.id,
    playerGameboardController,
    fleets.player,
    gameState
  );

  const readyUpButton = new ReadyUpButtonComponent(
    playerGameboardComponent,
    shipShufflerButton,
    instructionsButton,
    gameState.transitionToNextPhase,
  );

  const scoreBoard = new ScoreBoardComponent(
    fleets,
    shipTypes
  );

  const mainThreeFragments: { [key in FragmentKey]: DocumentFragment } = {
    parabellum: createMainThreeParabellumFragment(
      shipShufflerButton,
      readyUpButton
    ),
    bellum: createMainThreeBellumFragment(
      scoreBoard,
    ),
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