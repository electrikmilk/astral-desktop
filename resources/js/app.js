import './bootstrap';
import {init} from './init.js';
import {nextFrame} from './support/util.js';
import {ViewController} from './support/views.js';
import startView from './views/startView.js';

export const views = new ViewController();

window.onload = async () => {
    await nextFrame();
    init();

    await views.load(startView);
};
