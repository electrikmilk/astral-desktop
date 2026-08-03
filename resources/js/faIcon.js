import {html} from './support/render.js';

export function faIcon(icon) {
    return html('i', {className: 'fa-solid fa-' + icon});
}
