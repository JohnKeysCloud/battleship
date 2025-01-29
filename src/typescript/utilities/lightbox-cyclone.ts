
interface DialogState {
  isDialogOpen: boolean;
  isEscapeKeyListenerAttached: boolean;
  isCloseButtonListenerAttached: boolean;
};

/**
 * Lightbox by Cyclone Studios 💭
 * 
 * A class that manages a modal dialog, allowing it to be opened, closed, and interacted with.
 * It handles aria attributes, keyboard interactions (Escape key), and close button events.
 * 
 * @example
 * const dialogElement = document.querySelector('dialog');
 * const lightbox = new LightBox(dialogElement);
 * lightbox.openDialog();
 * 
 * @class
 */
class LightBox {
  /**
   * The current state of the dialog (open/close and event listener attachment status).
   * @private
   * @type {DialogState}
   */
  private readonly dialogState: DialogState = {
    isDialogOpen: false,
    isEscapeKeyListenerAttached: false,
    isCloseButtonListenerAttached: false,
  };

  /**
   * The ID of the dialog element.
   * @private
   * @type {string}
   */
  private readonly dialogId: string;

  /**
   * The close button element inside the dialog.
   * @private
   * @type {HTMLButtonElement}
   */
  private readonly dialogCloseButton: HTMLButtonElement;

  /**
   * The listener function for closing the dialog when the close button is clicked.
   * @private
   * @type {() => void}
   */
  private closeButtonListener: () => void;

  /**
   * The listener function for handling the Escape key to close the dialog.
   * @private
   * @type {(event: KeyboardEvent) => void}
   */
  private escapeKeyListener: (event: KeyboardEvent) => void;

  /**
   * Creates an instance of the LightBox class.
   * @param {HTMLDialogElement} dialogElement - The dialog element to manage.
   * @param {string} [dialogCloseButtonID='ds-close-button'] - The ID of the close button inside the dialog.
   * @param {boolean} [dialogInDocumentBody=true] - Whether to observe the dialog's removal from the document body.
   * @throws {Error} Throws an error if the dialog element doesn't have an ID.
   */
  constructor(
    private readonly dialogElement: HTMLDialogElement,
    private readonly dialogCloseButtonID: string = 'ds-close-button',
    private readonly dialogInDocumentBody: boolean = true
  ) {
    if (!this.dialogElement.id)
      throw new Error('Dialog element must have an id.');

    this.dialogId = this.dialogElement.id;
    this.dsAddDialogAria(this.dialogElement);
    this.dialogCloseButton = this.dsGetCloseButton(
      this.dialogCloseButtonID,
      this.dialogId
    );
    this.dsAddCloseButtonAria(this.dialogCloseButton);

    this.closeButtonListener = this.closeDialog.bind(this);
    this.escapeKeyListener = this.dsHandleEscapeKey.bind(this);

    this.observeDialogRemoval();
  }

  /**
   * Opens the dialog and sets the necessary aria attributes.
   * Adds event listeners for closing the dialog.
   */
  public openDialog() {
    if (this.dialogState.isDialogOpen) return;

    this.dialogElement.showModal();
    this.dsToggleDialogAriaStates(true);
    this.dsAddListeners();
    this.dialogState.isDialogOpen = true;
  }

  /**
   * Closes the dialog with an animation and removes event listeners.
   */
  public closeDialog() {
    requestAnimationFrame(() => {
      this.dialogElement.classList.add('closing');
    });

    this.dialogElement.addEventListener(
      'animationend',
      () => {
        this.dialogElement.classList.remove('closing');
        this.dialogElement.close();
        this.dsToggleDialogAriaStates(false);
        this.dsRemoveListeners();
        this.dialogState.isDialogOpen = false;
      },
      { once: true }
    );
  }

  /**
   * Returns whether the dialog is currently open.
   * @returns {boolean} True if the dialog is open, false otherwise.
   */
  public isOpen(): boolean {
    return this.dialogState.isDialogOpen;
  }

  /**
   * Adds event listeners for the dialog's close button and Escape key.
   * @private
   */
  private dsAddListeners() {
    if (!this.dialogState.isCloseButtonListenerAttached) {
      this.dialogCloseButton.addEventListener(
        'click',
        this.closeButtonListener
      );
      this.dialogState.isCloseButtonListenerAttached = true;
    }

    if (!this.dialogState.isEscapeKeyListenerAttached) {
      window.addEventListener('keydown', this.escapeKeyListener);
      this.dialogState.isEscapeKeyListenerAttached = true;
    }
  }

  /**
   * Removes event listeners for the dialog's close button and Escape key.
   * @private
   */
  private dsRemoveListeners() {
    this.dialogCloseButton.removeEventListener(
      'click',
      this.closeButtonListener
    );
    this.dialogState.isCloseButtonListenerAttached = false;

    window.removeEventListener('keydown', this.escapeKeyListener);
    this.dialogState.isEscapeKeyListenerAttached = false;
  }

  /**
   * Toggles the aria-hidden and aria-modal attributes based on the dialog's state.
   * @private
   * @param {boolean} isOpen - Whether the dialog is open or closed.
   */
  private dsToggleDialogAriaStates(isOpen: boolean) {
    this.dialogElement.setAttribute('aria-hidden', (!isOpen).toString());
    this.dialogElement.setAttribute('aria-modal', isOpen.toString());
  }

  /**
   * Retrieves the close button element inside the dialog.
   * @private
   * @param {string} closeButtonId - The ID of the close button.
   * @param {string} dialogId - The ID of the dialog.
   * @returns {HTMLButtonElement} The close button element.
   * @throws {Error} Throws an error if the close button is not found.
   */
  private dsGetCloseButton(
    closeButtonId: string,
    dialogId: string
  ): HTMLButtonElement {
    const closeButton = this.dialogElement.querySelector<HTMLButtonElement>(
      `#${closeButtonId}`
    );

    if (!closeButton) {
      throw new Error(
        `Close button with ID "${closeButtonId}" not found in dialog "${dialogId}".`
      );
    }

    return closeButton;
  }

  /**
   * Adds aria attributes to the dialog element.
   * @private
   * @param {HTMLDialogElement} dialogElement - The dialog element to update.
   */
  private dsAddDialogAria(dialogElement: HTMLDialogElement): void {
    dialogElement.setAttribute('aria-modal', 'false');
    dialogElement.setAttribute('aria-hidden', 'true');
  }

  /**
   * Adds aria attributes to the close button.
   * @private
   * @param {HTMLButtonElement} closeButton - The close button element to update.
   */
  private dsAddCloseButtonAria(closeButton: HTMLButtonElement): void {
    closeButton.setAttribute('aria-label', 'Close Dialog');
  }

  /**
   * Handles the Escape key press to close the dialog.
   * @private
   * @param {KeyboardEvent} event - The keyboard event triggered by pressing a key.
   */
  private dsHandleEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.dialogState.isDialogOpen) {
      event.preventDefault();
      this.closeDialog();
    }
  }

  /**
   * Observes the removal of the dialog element from the DOM and removes listeners accordingly.
   * @private
   */
  private observeDialogRemoval() {
    const observer: MutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        Array.from(mutation.removedNodes).forEach((node) => {
          if (node === this.dialogElement) {
            this.dsRemoveListeners();
            observer.disconnect(); // Stop observing once removed
            return;
          }
        });
      }
    });

    this.dialogInDocumentBody
      ? observer.observe(document.body, { childList: true })
      : observer.observe(document.body, { childList: true, subtree: true });
  }
}

// 💭 --------------------------------------------------------------

// 💡 Fun fact:
// Lightboxes are named after the lightbox that photographers use to view slides.
// Ok… maybe it's not that fun.

// Lightbox by Cyclone Studios 💭