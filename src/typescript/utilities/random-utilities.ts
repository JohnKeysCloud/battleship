export const areArraysEqual = <T>(arrayOne: T[], arrayTwo: T[]) =>
  arrayOne.length === arrayTwo.length
  &&
  arrayOne.every((value, index) => value === arrayTwo[index]);

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

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

export const waitForAnimationEnd = (element: HTMLElement): Promise<void> => {
  return new Promise((resolve) => {
    const handler = () => {
      element.removeEventListener('animationend', handler);
      resolve();
    };
    element.addEventListener('animationend', handler);
  });
}
export const waitForTransitionEnd = (
  element: HTMLElement,
  timeout = 1000, // ? make timeout value slightly longer than the longest transition duration
  expectedCount?: number, // ? optional number of transitionend events to wait for (e.g., for nested transitions)
  callback?: () => void // ? optional callback, same as `if (callback) callback();`
): Promise<void> => {
  return new Promise((resolve) => {
    let resolved = false;
    let transitionCount = 0;

    const cleanup = () => {
      if (!resolved) {
        resolved = true;
        element.removeEventListener('transitionend', handler);
        clearTimeout(timer); // clear fallback timeout once resolved
        resolve();
        callback?.();
      }
    };

    const handler = (event: TransitionEvent) => {
      // ? If expecting multiple transitions, count until expectedCount is met
      if (expectedCount !== undefined && expectedCount > 0) {
        transitionCount++;
        if (transitionCount >= expectedCount) {
          cleanup();
        }
        return;
      }

      // ? Only resolve if transition event is on the element itself
      if (event.target === element) {
        cleanup();
      }
    };

    element.addEventListener('transitionend', handler);

    // Fallback timeout if `transitionend` event doesn't fire
    const timer = setTimeout(() => {
      cleanup();
    }, timeout);
  });
};
export const waitForEvent = <K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  eventType: K,
  callback?: () => void
): Promise<HTMLElementEventMap[K]> => {
  return new Promise((resolve) => {
    const handler = (event: HTMLElementEventMap[K]) => {
      element.removeEventListener(eventType, handler as EventListener);
      resolve(event);
      if (callback) callback();
    };
    element.addEventListener(eventType, handler as EventListener);
  });
};

export type Range<
  N extends number,
  Acc extends number[] = []
> = Acc['length'] extends N ? Acc[number] : Range<N, [...Acc, Acc['length']]>;