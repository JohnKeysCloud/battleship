<!-- ! DRAFT -->

# Cyclone Lightbox Controller

## Overview

The **Cyclone Lightbox Controller** is a lightweight utility designed to handle smooth animations for `<dialog>` elements in vanilla TypeScript projects. It ensures a polished user experience without imposing opinionated structures or unnecessary dependencies.

## Features

- **Animation Handling**: Manages smooth entrance and exit animations for native `<dialog>` elements.
- **Unopinionated**: Does not enforce external close buttons or alternative dialog behaviors.
- **Flexible**: Works with any `<dialog>` element without modifying its core functionality.

## Why No External Close Buttons?

Dialogs are meant to manage their own closing mechanisms. External close buttons introduce inconsistencies in expected behavior. This module adheres to the correct usage of `<dialog>` elements by ensuring that all close interactions remain internal.

## Installation

```sh
npm install cyclone-lightbox-controller
```

## Usage

### Basic Example

```typescript
import { CycloneLightboxController } from 'cyclone-lightbox-controller';

const myDialog = document.getElementById('my-dialog') as HTMLDialogElement;
const lightboxController = new CycloneLightboxController(
  myDialog,
  'my-dialog-close-button'
);
```

### Instructions Dialog Example

```typescript
import { CycloneLightboxController } from '../../utilities/cyclone-lightbox';
import { InstructionsDialogComponent } from '../components/instructions-dialog-component';

const instructionsDialog = new InstructionsDialogComponent();
const instructionsLightboxController = new CycloneLightboxController(
  instructionsDialog.element,
  'instructions-dialog-close-button'
);
```

## API

### `new CycloneLightboxController(dialogElement, closeButtonId)`

#### Parameters:

- **`dialogElement`** (`HTMLDialogElement`) – The target `<dialog>` element.
- **`closeButtonId`** (`string`) – The ID of the close button within the dialog.

#### Methods:

- **`open()`** – Animates and opens the dialog.
- **`close()`** – Animates and closes the dialog.
- **`toggle()`** – Toggles the dialog with smooth animations.

## Best Practices

- Ensure that your `<dialog>` elements always include an internal close button.
- Use `CycloneLightboxController` strictly for handling animations, not for opening/closing logic.
- Avoid modifying native `<dialog>` behaviors outside of animations.

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you find any bugs or have feature suggestions.
