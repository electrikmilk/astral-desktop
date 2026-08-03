import {MARGIN_X} from './index.js';
import {INPUT_Y} from './input.js';
import {PicassoCanvas} from './canvas.js';
import beepSound from './beep.wav';

export let output = [];
export let outputIndex = 0;

export function clearOutput() {
    outputIndex = 0;
    output = [];
}

export let blink = false;

export async function beep() {
    if (blink) {
        return;
    }
    blink = true;

    await new Promise((resolve) => setTimeout(async () => {
        await new Audio(beepSound).play();
        blink = false;
        resolve();
    }, 1));
}

export function setOutputIndex(index) {
    if (index === -1 || index > output.length) {
        beep();
        return;
    }
    outputIndex = index;
}

const ESC = 27;

export function drawOutput() {
    let lineY = INPUT_Y - 25;
    for (let i = outputIndex; i < output.length; i++) {
        if (lineY < 0) {
            break;
        }

        const line = output[i];
        for (let j = 0; j < line.length; j++) {
            const charCode = line.charCodeAt(j);
            if (charCode === ESC && line[j + 1] === '[') {
                j += 2;
            }

            let code = '';
            for (let k = j; k < line.length; k++) {
                if (line[k] === 'm') {
                    break;
                }

                code += line[k];
            }

            // console.log('code', code);
        }


        PicassoCanvas().text(line, MARGIN_X, lineY, '#cccccc');
        lineY -= 25;
    }
}

export function pushOutput(...items) {
    output = output.reverse();
    output.push(...items);
    output = output.reverse();
}
