import {MARGIN_X} from './index.js';
import {executing, input, INPUT_X, INPUT_Y, prefix} from './input.js';
import {PicassoCanvas} from './canvas.js';

export let cursorInput = '';
export let cursorIndex = -1;

export function setCursor(index = null, input = null) {
    cursorIndex = index;
    cursorInput = input;
}

let blink = true;

setInterval(() => {
    blink = !blink;
}, 500);

export function drawCursor() {
    if (blink) {
        return;
    }

    let CURSOR_X = MARGIN_X + PicassoCanvas().textWidth(prefix) + INPUT_X + PicassoCanvas().textWidth(cursorInput);
    if (executing) {
        CURSOR_X = MARGIN_X;
    }
    PicassoCanvas().box('#eeeeee', CURSOR_X, INPUT_Y, 8, 14);
}

function cursorCanMove(toIndex) {
    if (toIndex < -1) {
        return false;
    }
    if (toIndex > input.length) {
        return false;
    }

    cursorIndex = toIndex;

    if (cursorIndex === 0) {
        cursorInput = '';
        return;
    }
    if (input.length === toIndex) {
        cursorInput = input;
        return false;
    }

    return true;
}

export function moveCursorLeft() {
    if (!cursorCanMove(cursorIndex - 1)) {
        return;
    }

    moveCursor();
}

export function moveCursorRight() {
    if (!cursorCanMove(cursorIndex + 1)) {
        return;
    }

    moveCursor();
}

function moveCursor() {
    console.log(input.length, cursorIndex);
    cursorInput = input.split('').splice(cursorIndex, input.length - (cursorIndex + 1)).join('');
}
