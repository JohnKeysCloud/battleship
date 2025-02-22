//  get details from main one parabellum fragment and render
import { createElement } from "../../../../utilities/random-utilities";
import { CycloneLightboxController } from "../../../../utilities/cycloneLightbox.ts/cyclone-lightbox";
import './instructions-component.scss';

export class InstructionsComponent {
  private readonly instructionsButton: HTMLButtonElement;
  private readonly instructionsButtonContainer: HTMLDivElement;
  private readonly instructionsImageSrc: string =
    'https://cyclone-studios.s3.us-east-2.amazonaws.com/s3_misc-images/information-icon.png';
  private readonly buttonId: string = 'instructions-button';
  private readonly buttonImageId: string = 'instructions-image';

  #listenerAttached: boolean = false;
  private readonly openInstructionsDialog: () => void;

  constructor(
    private instructionsLightboxController: CycloneLightboxController
  ) {
    this.instructionsButton = this.createInstructionsButton();
    this.instructionsButtonContainer = this.createInstructionsButtonContainer();
    this.instructionsButtonContainer.appendChild(this.instructionsButton);

    this.openInstructionsDialog = (): void => this.instructionsLightboxController.openLightbox();

    this.toggleEventListener();
  }

  public render(targetElement: HTMLElement) {
    if (!targetElement) {
      throw new Error(`Target element not found. Recieved ${targetElement}.`);
    }

    targetElement.appendChild(this.instructionsButtonContainer);
  }

  public toggleEventListener() {
    if (this.#listenerAttached === true) {
      this.instructionsButton.removeEventListener('click', this.openInstructionsDialog);
      this.#listenerAttached = false;
    } else {
      this.instructionsButton.addEventListener('click', this.openInstructionsDialog);
      this.#listenerAttached = true;
    }
  }

  // 💭 --------------------------------------------------------------
  
  private createInstructionsButton(): HTMLButtonElement {
    const instructionsImage: HTMLImageElement = createElement('img', [], {
      id: this.buttonImageId,
      src: this.instructionsImageSrc,
    });

    const instructionsButton: HTMLButtonElement = createElement('button', [], {
      id: this.buttonId,
      type: 'button',
    });

    instructionsButton.appendChild(instructionsImage);

    return instructionsButton;
  }

  private createInstructionsButtonContainer(): HTMLDivElement {
    const instructionsButtonContainer: HTMLDivElement = createElement('div', [], {
      id: `${this.buttonId}-container`,
    });

    return instructionsButtonContainer;
  }
}