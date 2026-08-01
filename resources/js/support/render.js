/*
 * Rendering functions.
 */

import {obj2CSS, sleep} from './util.js';

/* HTML */

// Render HTML.
export function html(tag, config, ...elements) {
    const element = document.createElement(tag);
    if (elements) {
        element.append(...elements);
    }
    if (config) {
        for (let key in config) {
            if (key in element) {
                if (key === 'style' && typeof config[key] === 'object') {
                    for (let key in config['style']) {
                        element.style[key] = config['style'][key];
                    }
                    continue;
                }
                element[key] = config[key];
            } else if (typeof config[key] === 'boolean') {
                config[key] ? element.setAttribute(key, config[key]) : element.removeAttribute(key);
            } else {
                element.setAttribute(key, config[key]);
            }
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
            transitionRenderState(element, newRender);
        }
    });

    return element;
}

// Transition model states.
async function transitionRenderState(element, render) {
    if (!element.classList.contains('disappear')) {
        element.classList.add('disappear');
        await sleep(.3);
    }

    element.innerHTML = '';

    element.style.opacity = 0;
    if (element.classList.contains('disappear')) {
        element.classList.remove('disappear');
    }

    element.append(render);

    element.classList.add('appear');
    await sleep(.3);
    element.style.opacity = 1;
    element.classList.remove('appear');
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
