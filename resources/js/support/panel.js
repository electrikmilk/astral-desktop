import {addInit} from '../init.js';
import {html, text} from './render.js';
import {Store} from './store.js';

let container;
export let windows = [];

addInit('panels', () => {
    if (!container) {
        container = html('div', {className: 'panels-container'});
        document.body.appendChild(container);
    }
});

export class Panel {
    window;
    title = 'Application';
    icon;
    url;
    titleBar;
    minimizeButton = false;
    closeButton = true;
    isOpen = new Store(true);
    isMini = new Store(false);

    constructor(title, url, icon, isOpenModel = null, isMiniModel = null) {
        this.title = title;
        this.icon = icon;
        this.url = url;
        this.window = html('div', {className: 'panel'});
        if (isOpenModel) {
            this.isOpen = isOpenModel;
        }
        if (isMiniModel) {
            this.isMini = isMiniModel;
        }

        container.appendChild(this.window);
        windows.push(this);

        $(this.window).draggable().selectable().resizable();
    }

    withMinimizeButton() {
        this.minimizeButton = true;
        return this;
    }

    withoutCloseButton() {
        this.closeButton = false;
        return this;
    }

    initTitleBar() {
        this.titleBar = html('div', {className: 'panel-title font-demi'},
            html('div', {
                    className: 'flex-center',
                    style: 'gap: 0 .5rem',
                },
                html('img', {src: this.icon, width: 32}),
                text(this.title),
            ),
        );

        const titleBarButtons = html('div', {className: 'panel-btns'});

        if (this.minimizeButton) {
            titleBarButtons.append(html('div', {
                className: 'panel-btn panel-mini-btn',
                innerHTML: '&minus;',
                onclick: () => {
                    this.minimize();
                },
            }));
        }

        if (this.closeButton) {
            titleBarButtons.append(html('div', {
                className: 'panel-btn panel-close-btn',
                innerHTML: '&times;',
                onclick: () => {
                    this.close();
                },
            }));
        }

        this.titleBar.append(titleBarButtons);

        this.window.appendChild(this.titleBar);
    }

    init() {
        this.initTitleBar();
        this.window.append(html('div', {className: 'panel-frame'},
            html('iframe', {
                src: this.url,
                width: 640,
                height: 480,
                frameBorder: '0',
            }),
        ));
        this.isOpen.set(true);
    }


    open() {
        this.window.classList.remove('fade-out');
        this.window.classList.remove('disappear-out');
        this.isOpen.set(true);
        this.isMini.set(false);
    }

    minimize() {
        this.window.classList.add('disappear-out');
        this.isMini.set(true);
    }

    close() {
        this.isOpen.set(false);
        this.isMini.set(false);
        this.window.classList.add('fade-out');
        setTimeout(() => {
            this.window.remove();
            windows.splice(windows.indexOf(this), 1);
            delete this;
        }, 400);
    }
}
