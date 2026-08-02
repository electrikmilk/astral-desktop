import {CANVAS_HEIGHT, MARGIN_X} from './index.js';
import {clearOutput, outputIndex, pushOutput, setOutputIndex} from './output.js';
import {cursorIndex, drawCursor, moveCursorLeft, moveCursorRight, setCursor} from './cursor.js';
import {PicassoCanvas} from './canvas.js';
import {empty} from '../../js/support/util.js';

export const INPUT_X = 10;
export let INPUT_Y;

export let input = '';
export let prefix = '$';
export let executing = false;

let user;
let host;
export let shell;

let saveCwd = '/';
let cwd = '/';

// TODO: this is unix based.
export async function setPrefix() {
    const init = await shellRequest('whoami && uname -n && echo $SHELL');
    if (init.status !== 200) {
        setTimeout(setPrefix, 1000);
        return;
    }

    const output = init.data.output;
    user = output[0];
    host = output[1];
    shell = output[2];
    prefix = [[user, host].join('@'), '$'].join(' ');
}

export function drawInput() {
    if (!INPUT_Y) {
        INPUT_Y = (CANVAS_HEIGHT - 40);
    }

    if (!executing) {
        PicassoCanvas().text(prefix, MARGIN_X, INPUT_Y);
        PicassoCanvas().text(input, MARGIN_X + INPUT_X + PicassoCanvas().textWidth(prefix), INPUT_Y);
    }
    drawCursor();
}

export async function handleInput(event) {
    if (executing) {
        return;
    }
    if (event.key.toLowerCase() === 'u' && event.ctrlKey) {
        resetInput();
        return;
    }
    if (event.key.toLowerCase() === 'w' && event.ctrlKey) {
        clipInput();
        return;
    }

    switch (event.key) {
        case 'Backspace':
            backChar();
            break;
        case 'Enter':
            await processInput();
            resetInput();
            break;
        case 'ArrowUp':
            setOutputIndex(outputIndex + 1);
            break;
        case 'ArrowDown':
            setOutputIndex(outputIndex - 1);
            break;
        case 'ArrowLeft':
            moveCursorLeft();
            break;
        case 'ArrowRight':
            moveCursorRight();
            break;
        case 'CapsLock':
        case 'Shift':
        case 'Tab':
        case 'Control':
        case 'Meta':
        case 'Dead':
        case 'Escape':
        case 'Alt':
            break;
        default:
            input += event.key;
            moveCursorRight();
    }
}

export function resetInput() {
    input = '';
    setCursor(0, '');
    setOutputIndex(0);
}

function backChar() {
    if (input.length <= 1) {
        resetInput();
        return;
    }

    let splitInput = input.split('');
    splitInput.splice(cursorIndex - 1, 1);

    input = splitInput.join('');
    moveCursorLeft();
}

const specialChars = new RegExp(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g);

function clipInput() {
    let revInput = input.split('').reverse();
    for (let i = 0; i < input.length; i++) {
        if (revInput[i].match(specialChars)) {
            revInput.splice(i, input.length - i);
            input = revInput.reverse().join('');
            break;
        }
    }

    resetInput();
}

async function processInput() {
    const saveInput = input;
    const args = input.split(' ');
    resetInput();

    pushOutput('> ' + saveInput);

    const command = args[0];
    const emptyFirstArg = empty(args[1]);
    switch (command) {
        case 'clear':
            clearOutput();
            return;
        case 'pwd':
            pushOutput(cwd);
            return;
        case 'cd':
            saveCwd = cwd;
            if (emptyFirstArg) {
                cwd = '/';
                break;
            }
            cwd = args[1];

            if (!cwd.startsWith('/')) {
                if (saveCwd.endsWith('/')) {
                    cwd = saveCwd + args[1];
                } else {
                    cwd = saveCwd + '/' + args[1];
                }
            }
            break;
    }

    let output = [];
    if (saveInput.length > 0) {
        const response = await shellRequest(saveInput);
        if (response.status !== 200) {
            output.push(response.data.output);
        } else {
            if (command === 'cd') {
                if (response.data.status === 1) {
                    cwd = saveCwd;
                } else if (!emptyFirstArg) {
                    cwd = args[1];
                }
            }
            for (let line of response.data.output) {
                output.push(line);
            }
            if (response.data.status !== 0) {
                output.push('exited with code ' + response.data.status);
            }
        }

        pushOutput(...output, '');
    }
}

export async function shellRequest(inputText) {
    executing = true;
    const response = await axios.post(route('shell.in'), {
        input: inputText,
        cwd: cwd,
    }).finally(() => executing = false);

    if (response.status !== 200) {
        console.error('failed!');
    }

    return response;
}
