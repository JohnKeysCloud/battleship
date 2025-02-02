import { CycloneLightboxController } from "../../utilities/cycloneLightbox.ts/cyclone-lightbox";
import { InstructionsDialogComponent } from "../../components/instructions-dialog-component/instructions-dialog-component";

export const instructionsDialog = new InstructionsDialogComponent();

export const instructionsLightboxController = new CycloneLightboxController(
  instructionsDialog.element,
  'instructions-dialog-close-button'
);