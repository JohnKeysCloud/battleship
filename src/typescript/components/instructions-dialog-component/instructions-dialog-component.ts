import { createElement, generateListFragment } from "../../utilities/random-utilities";
import instructionsListItemTextContentArray from '../../../json/instructions-list-item-text-content.json';
import './instructions-dialog-component.scss';

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

  get closeButton(): HTMLButtonElement {
    return this.instructionsDialogCloseButton;
  }

  private createInstructionsDialogCloseButton() {
    const instructionsDialogCloseButton = createElement(
      'button',
      ['close-button'],
      {
        id: InstructionsDialogComponent.closeButtonId,
        type: 'button',
        'aria-label': 'Close Instructions Dialog',
      }
    );
    instructionsDialogCloseButton.textContent = 'X';

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

    const unanchoredShipExample = createElement('div', [], {
      id: 'unanchored-ship-example',
    });

    const unanchoredShipText = createElement('p', [], {
      id: 'unanchored-ship-text',
    });
    unanchoredShipText.textContent = '= Bips adrift';

    const visualFeedbackKeyContainer = createElement('div', [], {
      id: 'visual-feedback-key-container',
    });
    visualFeedbackKeyContainer.append(
      unanchoredShipExample,
      unanchoredShipText
    );

    const instructionsContentContainer = createElement('div', [], {
      id: 'instructions-content',
    });
    instructionsContentContainer.append(
      tertiaryHeading,
      instructionsList,
      visualFeedbackKeyContainer,
    );

    const instructionsDialog = createElement('dialog', [], {
      id: InstructionsDialogComponent.dialogId,
    });
    instructionsDialog.append(
      closeButton,
      instructionsContentContainer
    );

    return instructionsDialog;
  }

  public render(targetElement: HTMLElement) {
    if (!targetElement) {
      throw new Error(`Target element not found. Recieved ${targetElement}.`);
    }

    targetElement.appendChild(this.instructionsDialog);
  }
}