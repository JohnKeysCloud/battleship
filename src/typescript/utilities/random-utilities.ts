export const areArraysEqual = <T>(arrayOne: T[], arrayTwo: T[]) =>
  arrayOne.length === arrayTwo.length
  &&
  arrayOne.every((value, index) => value === arrayTwo[index]);

export const getConvertedTypeFromAttr = <T extends string>(
  element: HTMLElement,
  attribute: string,
  typeGuard: (value: string) => value is T
): T => {
  const attrValue = element.getAttribute(attribute);
  if (!attrValue || !typeGuard(attrValue)) {
    throw new Error(`Invalid or missing attribute: ${attribute}`);
  }
  return attrValue;
};

export const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const isEmptyObject = (obj: Record<PropertyKey, unknown>): boolean => {
  return (
    Object.keys(obj).length === 0 &&
    Object.getOwnPropertySymbols(obj).length === 0
  );
};

export type Range<N extends number, Acc extends number[] = []> =
  Acc['length'] extends N
    ? Acc[number]
    : Range<N, [...Acc, Acc['length']]>;
    

export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  classes: string[] = [],
  attributes: Record<string, string> = {}
): HTMLElementTagNameMap[K] => {
  const element: HTMLElementTagNameMap[K] = document.createElement(tag);
  classes.forEach((cls) => element.classList.add(cls));
  Object.entries(attributes).forEach(([key, value]) =>
    element.setAttribute(key, value)
  );
  return element;
};

export const generateListFragment = (
  listItemTextContentArray: { textContent: string }[],
  identifier: string,
  attributes: Record<string, string> = {}
): DocumentFragment => {
  if (!listItemTextContentArray.length)
    throw new Error('The listItemTextContentArray is empty.');

  if (!identifier) throw new Error('You must identify your list items.');

  const listFragment = new DocumentFragment();

  listItemTextContentArray.forEach((listItem, index) => {
    const listElement: HTMLLIElement = createElement(
      'li',
      [`${identifier}-list-item`],
      {
        id: `${identifier}-list-item-${++index}`,
        ...attributes,
      }
    );
    listElement.textContent = listItem.textContent;

    listFragment.appendChild(listElement);
  });
  
  return listFragment;
};