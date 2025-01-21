import { createElement } from "./random-utilities";

/**
 * A container for dynamically swapping and managing fragments of the DOM.
 * 
 * @class HotSwapContainer
 * @param {keyof HTMLElementTagNameMap} elementTag - The HTML element tag for the container (e.g., 'section', 'div').
 * @param {{ [key: string]: DocumentFragment }} fragments - A collection of swappable fragments, keyed by string identifiers.
 * @param {string} initialFragmentKey - The key of the initial fragment to render in the container.
 * @param {string[]} [classNames=[]] - An array of class names to apply to the container element (optional).
 * @param {Record<string, string>} [attributes={}] - A set of attributes to apply to the container element (optional).
 */
export class HotSwapContainer {
  private readonly hotSwapContainer: HTMLElement;

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

    this.hotSwapContainer.appendChild(this.fragments[this.initialFragmentKey]);
  }

  public render(targetElement: HTMLElement) {
    targetElement.appendChild(this.hotSwapContainer);
  }

  public replaceFragment(fragment: DocumentFragment) {
    this.hotSwapContainer.replaceChildren(fragment);
  }

  public replaceFragmentByKey(key:string): void {
    const fragment = this.getFragment(key);
    this.replaceFragment(fragment);
  }

  private getFragment(key:string): DocumentFragment {
    const fragment = this.fragments[key];
    if (!fragment) {
      throw new Error(`Fragment with key "${key}" does not exist.`);
    }
    return fragment;
  }
}