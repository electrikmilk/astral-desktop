import {nextFrame} from './util.js';
import {init} from '../init.js';

/*
Applications API
 */

export async function initApp() {
    await nextFrame();
    init();
}
