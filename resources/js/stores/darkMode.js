import {Store} from '../support/store.js';

const prefersColorSchemeDark = '(prefers-color-scheme: dark)';
const darkMode = new Store(window.matchMedia(prefersColorSchemeDark).matches);

window.matchMedia(prefersColorSchemeDark).addEventListener('change', e => darkMode.set(e.matches));

export default darkMode;
