import { createElement } from "../../utilities/random-utilities";
import { createNav } from "./nav/nav";

export function createHeader() {
  const nav = createNav();

  const header = createElement('header');
  header.appendChild(nav);

  return header;
}