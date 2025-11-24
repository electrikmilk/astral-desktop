/*
 * Rendering functions.
 */

import {obj2CSS, sleep} from './util.js';

/* HTML */

// Render HTML.
export function html(tag, attrs, ...elements) {
    const element = document.createElement(tag);
    if (elements) {
        element.append(...elements);
    }
    if (attrs) {
        for (let key in attrs) {
            element[key] = attrs[key];
        }
    }

    return element;
}

// Render text.
export function text(text) {
    return document.createTextNode(text);
}

// Model HTML based on a store.
export function model(store, callback) {
    const element = document.createElement('span');
    store.model((newValue) => {
        const newRender = callback(newValue);
        if (element.innerHTML === '' || element.innerHTML !== newRender.outerHTML) {
            transitionRenderState(newValue, element, newRender);
        }
    });

    return element;
}

// Transition model states.
async function transitionRenderState(newValue, element, render) {
    if (!element.classList.contains('fade-out')) {
        element.classList.add('fade-out');
        await sleep(.3);
    }

    element.innerHTML = '';

    element.style.opacity = 0;
    if (element.classList.contains('fade-out')) {
        element.classList.remove('fade-out');
    }

    element.append(render);

    element.classList.add('fade');
    await sleep(.3);
    element.style.opacity = 1;
    element.classList.remove('fade');
}

/* CSS */

// Style an element with an object.
export function styleElement(element, styles) {
    for (const style in styles) {
        element.style[style] = styles[style];
    }
}

let styleRules = [];
let styleTag = null;

// Push document style.
export function pushCSS(rules) {
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.type = 'text/css';
        document.head.append(styleTag);
    }
    if (styleRules.indexOf(rules) === -1) {
        styleRules.push(rules);
    }
    styleTag.innerText = obj2CSS(styleRules);
}
