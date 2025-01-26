import { createElement } from "../../../utilities/random-utilities";
import { createGitHubLink } from "../../../utilities/create-github-link";

export function createNav() {
  const headingLink = createElement('a', ['heading-link'], {
    id: 'heading-link',
    href: 'https://johnkeyscloud.github.io/battleship/',
  });
  headingLink.textContent = 'ShattleBip';

  const heading: HTMLHeadingElement = createElement('h1', ['main-heading']);
  heading.appendChild(headingLink);

  const gitHubLogoLink: HTMLAnchorElement = createGitHubLink();

  const nav: HTMLElement = createElement('nav');
  nav.append(heading, gitHubLogoLink);

  return nav;
}; 