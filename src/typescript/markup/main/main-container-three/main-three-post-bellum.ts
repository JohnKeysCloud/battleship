import { createElement } from "../../../utilities/random-utilities";
import { App } from "../../../../app";

export function createMainThreePostBellumFragment(): DocumentFragment {
  const playAgainButton = createElement('button', ['end-game-button'], {
    id: 'play-again-button'
  });
  playAgainButton.textContent = 'Play Again'
  playAgainButton.addEventListener('click', App.pressStart); 

  const findNewOpponentButton = createElement('button', ['end-game-button'], {
    id: 'find-new-opponent-button'
  });
  findNewOpponentButton.textContent = 'Find New Opponent';
  // ? TODO: remove when multiplayer is implemented 
  findNewOpponentButton.setAttribute('disabled', 'true');

  const endGameButtonContainer = createElement('div', [], {
    id: 'end-game-button-container'
  });
  endGameButtonContainer.append(playAgainButton, findNewOpponentButton);

  const mainContainerThreePostBellumWrapper = createElement('div', ['post-bellum'], {
    id: 'main-container-three-post-bellum',
  });
  mainContainerThreePostBellumWrapper.append(endGameButtonContainer);

  const bellumFragment = new DocumentFragment();
  bellumFragment.appendChild(mainContainerThreePostBellumWrapper);

  return bellumFragment;
}
