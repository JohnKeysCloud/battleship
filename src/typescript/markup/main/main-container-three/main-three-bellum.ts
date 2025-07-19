import { createElement } from "../../../utilities/random-utilities";
import { ScoreBoardComponent } from "../../components/buttons/score-board-component/score-board-component";

export function createMainThreeBellumFragment(scoreBoard: ScoreBoardComponent): DocumentFragment {
  const mainContainerThreeBellumWrapper = createElement('div', ['bellum'], {
    id: 'main-container-three-bellum',
  });
  scoreBoard.render(mainContainerThreeBellumWrapper);

  const bellumFragment = new DocumentFragment();
  bellumFragment.appendChild(mainContainerThreeBellumWrapper);

  return bellumFragment;
}

