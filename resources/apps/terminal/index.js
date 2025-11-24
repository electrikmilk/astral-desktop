import '../../js/bootstrap';

import {handleInput, resetInput, setPrefix, shell} from './input.js';
import {outputIndex, pushOutput, setOutputIndex} from './output.js';
import {PicassoCanvas} from './canvas.js';

export const CANVAS = document.querySelector('canvas#tty');
export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 480;
export const MARGIN_X = 20;

window.onload = async () => {
    PicassoCanvas();
    await setPrefix();

    pushOutput(
        'Howdy! This is a HTML5 Canvas terminal emulator.',
        '[ctrl-w = clip, ctrl-u = clear, ꜛ/ꜜ= scroll]',
        'Apologies, this will feel more familiar to Unix users (for now).',
        '',
        'Host Shell: ' + shell,
    );

    resetInput();

    document.body.addEventListener('keydown', handleInput);
    CANVAS.addEventListener('mousewheel', (e) => {
        if (e.deltaY > 0) {
            setOutputIndex(outputIndex - 1);
        } else {
            setOutputIndex(outputIndex + 1);
        }
    });
};
