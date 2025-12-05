/*
 * Switch between interfaces, handles transitions.
 */

import {html} from './render.js';

export function renderApp(...elements) {
    const app = document.querySelector('#app');
    app.innerHTML = '';
    app.append(...elements);
}

export class View {
    element;
    handler;
    loadHandler;

    constructor(handler) {
        this.handler = handler;
    }

    onLoad(handler) {
        this.loadHandler = handler;
    }

    render(controller) {
        return this.element = html('div', {className: 'view'},
            this.handler(this, controller, matchMedia('(prefers-color-scheme: dark)').matches),
        );
    }

    dissolve() {
        return new Promise((resolve) => {
            this.element.classList.remove('fade-in');
            this.element.classList.add('fade-out');
            setTimeout(() => {
                resolve();
                this.element.remove();
            }, 1000);
        });
    }
}

export class ViewController {
    currentView;

    async prev() {
        if (this.currentView) {
            await this.currentView.dissolve();
        }
    }

    async load(view) {
        await this.prev();

        this.currentView = view;

        const renderedView = this.currentView.render(this);
        renderApp(renderedView);

        if (this.currentView.loadHandler) {
            this.currentView.loadHandler();
        }

        // Give images a sec to load in, etc.
        setTimeout(() => {
            renderedView.classList.add('fade-in');
        }, 500);
    }

    async clear() {
        await this.prev();
        this.currentView = null;
    }
}
