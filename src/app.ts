import { initApp } from './typescript/meta/init-app';
import { createDOM } from './typescript/meta/create-dom';

function pressStart() {
  console.time('initApp');
  initApp();
  console.timeEnd('initApp');

  console.time('createDOM');
  createDOM();
  console.timeEnd('createDOM');
}

console.time('pressStart');
pressStart();
console.timeEnd('pressStart');