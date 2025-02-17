import '../../styles/sass/index.scss';

import { players } from '../state/player-state';
import { CycloneLightboxController } from '../utilities/cycloneLightbox.ts/cyclone-lightbox';

// 💭 markup
import { createHeader } from '../markup/header/header';
import { MainComponent } from '../markup/main/main-component';
import { InstructionsDialogComponent } from '../components/instructions-dialog-component/instructions-dialog-component';
// import { instructionsDialog } from '../markup/lightboxes/instructions-dialog';

// 💭 --------------------------------------------------------------

export class DOMController {
  public readonly instructionsLightboxController: CycloneLightboxController;
  public readonly main: MainComponent;

  private readonly content: HTMLElement;
  private readonly header: HTMLElement;
  private readonly instructionsDialog: InstructionsDialogComponent;
  // private readonly footer: HTMLElement;

  constructor() {
    if (!document) throw new Error('Fuck!');

    const content = document.getElementById('content');
    if (!content) throw new Error('Shit!');

    this.content = content;
    this.header = createHeader();
    this.instructionsDialog = new InstructionsDialogComponent();
    this.instructionsLightboxController = new CycloneLightboxController(
      this.instructionsDialog.element,
      'instructions-dialog-close-button'
    );
    this.main = new MainComponent(players, this.instructionsLightboxController);
    // this.footer = createFooter();
  }

  public render() {
    this.content.appendChild(this.header);
    this.main.render(this.content);
    this.instructionsDialog.render(document.body);
    // append footer via this.footer
  }
}