import {Picasso} from '../../js/support/picasso.js';
import {drawInput} from './input.js';
import {CANVAS, CANVAS_HEIGHT, CANVAS_WIDTH} from './index.js';
import {blink, drawOutput} from './output.js';

let picasso;

export function PicassoCanvas() {
    if (!picasso) {
        picasso = new Picasso(CANVAS, {
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            defaultTextColor: '#fafafa',
            defaultFont: '16px Consolas, monospace',
        });
        picasso.paint(() => {
            if (blink) {
                PicassoCanvas().box('#333333', 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            }

            drawInput();
            drawOutput();
        });
    }

    return picasso;
}
