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

export const createIdentifier = (id: string, playerType: string, identifier?: string): string => {
  if (playerType !== 'player' && playerType !== 'bot')
    throw new Error('`playerType` must be either "player" or "bot"');

  const extractedNumberString: string = id.split(playerType)[1].toLowerCase();
  return identifier
    ? `${playerType}-${extractedNumberString}-${identifier}`
    : `${playerType}-${extractedNumberString}`;
}