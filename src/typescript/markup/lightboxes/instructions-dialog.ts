import { createElement, generateListFragment } from "../../utilities/random-utilities";
import instructionsListItemTextContentArray from '../../../json/instructions-list-item-text-content.json';


export class InstructionsDialogComponent {
  private readonly instructionsDialog: HTMLDialogElement;
  private readonly instructionsDialogCloseButton: HTMLButtonElement;
  static readonly dialogId = 'instructions-dialog';
  static readonly closeButtonId = 'instructions-dialog-close-button';

  constructor() {
    this.instructionsDialogCloseButton =
      this.createInstructionsDialogCloseButton();
    this.instructionsDialog = this.createInstructionsDialog(
      this.instructionsDialogCloseButton
    );
  }

  get element(): HTMLDialogElement {
    return this.instructionsDialog;
  }

  private createInstructionsDialogCloseButton() {
    const instructionsDialogCloseButton = createElement(
      'button',
      ['close-button'],
      {
        id: InstructionsDialogComponent.closeButtonId,
        'aria-label': 'Close Instructions Dialog',
      }
    );
    instructionsDialogCloseButton.textContent = 'X';

    this.addEventListener(instructionsDialogCloseButton);

    return instructionsDialogCloseButton;
  }

  private createInstructionsDialog(closeButton: HTMLButtonElement) {
    const tertiaryHeading = createElement('h3', ['tertiary-heading'], {
      id: 'instructions-dialog-heading',
    });
    tertiaryHeading.textContent = 'Deploy your Bips:';

    const listItemContentArray: { textContent: string }[] =
      instructionsListItemTextContentArray;

    const listItemFragment = generateListFragment(
      listItemContentArray,
      'instructions'
    );

    const instructionsList = createElement('ul', ['instructions-list'], {
      id: 'instructions-list',
    });
    instructionsList.appendChild(listItemFragment);

    const instructionsContentContainer = createElement('div', [], {
      id: 'instructions-content',
    });
    instructionsContentContainer.append(tertiaryHeading, instructionsList);

    const instructionsDialog = createElement('dialog', [], {
      id: InstructionsDialogComponent.dialogId,
    });
    instructionsDialog.append(
      closeButton,
      instructionsContentContainer
    );

    return instructionsDialog;
  }

  private addEventListener(instructionsDialogCloseButton: HTMLButtonElement) {
    instructionsDialogCloseButton.addEventListener('click', () => {
      this.instructionsDialog.close();
    });
  }

  public render(targetElement: HTMLElement) {
    if (!targetElement) {
      throw new Error(`Target element not found. Recieved ${targetElement}.`);
    }

    targetElement.appendChild(this.instructionsDialog);
  }
}
