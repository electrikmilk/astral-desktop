import {ViewController} from '../../js/support/views.js';
import indexView from './views/indexView.js';
import {initApp} from '../../js/support/application.js';

export const views = new ViewController();

window.onload = async () => {
    await initApp();

    await views.load(indexView);
};
