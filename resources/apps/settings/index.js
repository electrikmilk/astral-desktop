import {ViewController} from '../../js/support/views.js';
import {nextFrame} from '../../js/support/util.js';
import {init} from '../../js/init.js';
import indexView from './views/indexView.js';

export const views = new ViewController();

window.onload = async () => {
    await nextFrame();
    init();

    await views.load(indexView);
};
