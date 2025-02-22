import { createElement } from "./random-utilities";

/**
 * A container for dynamically swapping and managing fragments of the DOM.
 * 
 * @class CycloneHotSwapContainer
 * @param {keyof HTMLElementTagNameMap} elementTag - The HTML element tag for the container (e.g., 'section', 'div').
 * @param {{ [key: string]: DocumentFragment }} fragments - A collection of swappable fragments, keyed by string identifiers.
 * @param {string} initialFragmentKey - The key of the initial fragment to render in the container.
 * @param {string[]} [classNames=[]] - An array of class names to apply to the container element (optional).
 * @param {Record<string, string>} [attributes={}] - A set of attributes to apply to the container element (optional).
 */
export class CycloneHotSwapContainer {
  private readonly hotSwapContainer: HTMLElement;
  private readonly fragmentsArray: DocumentFragment[];
  #currentIndex: number;

  constructor(
    private readonly elementTag: keyof HTMLElementTagNameMap,
    private readonly fragments: { [key: string]: DocumentFragment },
    private readonly initialFragmentKey: string,
    private readonly classNames: string[] = [],
    private readonly attributes: Record<string, string> = {}
  ) {
    if (!fragments[initialFragmentKey]) {
      throw new Error(
        `Initial fragment with key "${initialFragmentKey}" does not exist.`
      );
    }

    this.hotSwapContainer = createElement(
      this.elementTag,
      this.classNames,
      this.attributes
    );

    this.fragmentsArray = Object.values(this.fragments);

    this.#currentIndex = this.setInitialIndex(
      this.fragmentsArray,
      this.fragments,
      this.initialFragmentKey
    );

    this.hotSwapContainer.appendChild(this.fragments[this.initialFragmentKey]);
  }

  public render(targetElement: HTMLElement) {
    targetElement.appendChild(this.hotSwapContainer);
  }

  public swapFragmentByKey(key: string): void {
    const fragment = this.getFragment(key);
    this.swapFragment(fragment);
    this.#currentIndex = this.fragmentsArray.indexOf(fragment);
  }

  public swapByOrder(): void {
    this.#currentIndex = (this.#currentIndex + 1) % this.fragmentsArray.length;
    this.swapFragment(this.fragmentsArray[this.#currentIndex]);
  }

  private setInitialIndex(
    fragmentsArray: DocumentFragment[],
    fragments: { [key: string]: DocumentFragment },
    initialFragmentKey: string
  ): number {
    const initialIndex = fragmentsArray.indexOf(fragments[initialFragmentKey]);
    if (initialIndex === -1) {
      throw new Error(
        `Initial fragment with key "${initialFragmentKey}" does not exist.`
      );
    }
    return initialIndex;
  }

  private getFragment(key: string): DocumentFragment {
    const fragment = this.fragments[key];
    if (!fragment) {
      throw new Error(`Fragment with key "${key}" does not exist.`);
    }
    return fragment;
  }

  private swapFragment(fragment: DocumentFragment) {
    this.hotSwapContainer.replaceChildren(fragment);
  }
}