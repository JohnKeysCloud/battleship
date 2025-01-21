
import { PlayerState } from "../../types/state-types";
import { createElement } from "../../utilities/random-utilities";

import { MainContainerTwo } from "./main-container-two/main-container-two";

import { PlayerGameboardComponent } from "../../components/player-gameboard-component/player-gameboard-component";
import { OpponentGameboardComponent } from "../../components/opponent-gameboard-component/opponent-gameboard-component";

// 💭 --------------------------------------------------------------

import { HotSwapContainer } from "../../utilities/create-hot-swap-container";
import { createMainOneParabellumFragment } from "./main-container-one-fragments/main-one-parabellum";
import { createMainOneBellumFragment } from "./main-container-one-fragments/main-one-bellum";
import { createMainOnePostBellumFragment } from "./main-container-one-fragments/main-one-post-bellum";

import { createMainThreeParabellumFragment } from "./main-container-three-fragments/main-three-parabellum";
import { createMainThreeBellumFragment } from "./main-container-three-fragments/main-three-bellum";
import { createMainThreePostBellumFragment } from "./main-container-three-fragments/main-three-post-bellum";

import { FragmentKey } from "../../types/markup-types";

export function createMain(
  players: { player: PlayerState; opponent: PlayerState }
) {  
  const playerGameboardComponent = new PlayerGameboardComponent(
    players.player
  );
  const playerGameboardController = players.player.gameboardController;
  const playerFleet = players.player.fleetBuilder.fleet;

  const opponentGameboardComponent = new OpponentGameboardComponent(
    players.opponent
  );

  // 💭 --------------------------------------------------------------

  const mainOneFragments: { [key in FragmentKey]: DocumentFragment } = {
    parabellum: createMainOneParabellumFragment(),
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

  // 💭 --------------------------------------------------------------

  const mainContainerTwo = new MainContainerTwo(
    playerGameboardComponent,
    opponentGameboardComponent
  );

  // 💭 --------------------------------------------------------------

  const mainThreeFragments: { [key in FragmentKey]: DocumentFragment } = {
    parabellum: createMainThreeParabellumFragment(
      playerGameboardComponent,
      playerGameboardController,
      playerFleet
    ),
    bellum: createMainThreeBellumFragment(),
    postBellum: createMainThreePostBellumFragment(),
  }; 
  const mainContainerThree = new HotSwapContainer(
    'section',
    mainThreeFragments,
    'parabellum',
    ['main-container'],
    {
      id: 'main-container-three',
    }
  );

  // 💭 --------------------------------------------------------------

  const mainElement = createElement('main', ['gameboard-main'], {
    id: 'player-gameboard-section',
  });

  mainContainerOne.render(mainElement);
  mainContainerTwo.render(mainElement);
  mainContainerThree.render(mainElement);

  return mainElement;
}
