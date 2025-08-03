import './cyclone-footer.scss'
import { createElement } from "../random-utilities"

export class CycloneFooter {
  private readonly FOOTNOTE_TEXT_CONTENT = `© ${new Date().getFullYear()} Time Capsule NY, LLC. All Rights Reserved`;
  private readonly CYCLONE_STUDIOS_LOGO = 'https://cyclone-studios.s3.us-east-2.amazonaws.com/s3_cyclone-studios/alphaLogos/cycloneStudios/cycloneStudios.svg' ;

  private readonly id = 'cyclone-footer';
  public readonly element: HTMLElement = createElement('footer', [], {
    id: this.id,
  });
  
  #targetElement: HTMLElement | null = null;
  
  constructor() {
    this.element.appendChild(this.generateContent());
  }

  public static render(targetElement: HTMLElement) {
    const instance = new CycloneFooter();
    instance.mount(targetElement);
    return instance;
  }

  private generateContent(): DocumentFragment {
    const footnote = createElement('p', [], { id: 'footnote' });
    footnote.textContent = this.FOOTNOTE_TEXT_CONTENT;

    const poweredByText = createElement('p', [], { id: 'powered-by-text' });
    poweredByText.textContent = 'Powered By';

    const img = createElement('img', [], {
      id: 'cyclone-studios-logo',
      src: this.CYCLONE_STUDIOS_LOGO,
      alt: 'Cyclone Studios Logo',
    });

    const picture = createElement('picture', [], {
      id: 'cyclone-studios-picture',
    });
    picture.appendChild(img);

    const cycloneStudiosContainer = createElement('div', [], {
      id: 'cyclone-studios-container',
    });
    cycloneStudiosContainer.append(poweredByText, picture);

    const contentFragment = document.createDocumentFragment();
    contentFragment.append(footnote, cycloneStudiosContainer);

    return contentFragment;
  }

  public mount(targetElement: HTMLElement): void {
    if (this.#targetElement) return; // Already mounted

    if (!targetElement) throw new Error(`Target element not found.`);

    this.#targetElement = targetElement;

    targetElement.appendChild(this.element);
  }

  public unmount() {
    if (!this.#targetElement) {
      console.warn("Note to DEV: The Cyclone Studios footer isn't mounted dumbass!");
      return;
    };
    
    this.#targetElement.removeChild(this.element);
    this.#targetElement = null;
  }
}