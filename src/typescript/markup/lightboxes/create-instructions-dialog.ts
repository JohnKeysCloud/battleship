import { createElement, generateListFragment } from "../../utilities/random-utilities";
import instructionsListItemTextContentArray from '../../../json/instructions-list-item-text-content.json';

export function createInstructionsDialog(
) {
  const subheading = createElement('h2', ['sub-heading']);
  subheading.textContent = 'Parabellum';

  const tertiaryHeading = createElement('h3', ['tertiary-heading']);
  tertiaryHeading.textContent = 'Deploy your Bips:';

  const listItemContentArray: { textContent: string }[] =
    instructionsListItemTextContentArray;
  
  const listItemFragment = generateListFragment(listItemContentArray, 'instructions');

  const instructionsList = createElement('ul', ['instructions-list'], {
    id: 'instructions-list',
  });
  instructionsList.appendChild(listItemFragment);

  const instructionsDialog = createElement('dialog', [], { id: 'instructions-dialog' });
  instructionsDialog.append(subheading, tertiaryHeading, instructionsList);

  return instructionsDialog;
};