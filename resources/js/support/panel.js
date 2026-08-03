import {addInit} from '../init.js';
import {html, text} from './render.js';
import {Store} from './store.js';

let container;

addInit('panels', () => {
    if (!container) {
        container = html('div', {className: 'panels-container'});
        document.body.appendChild(container);
    }
});

class PanelManager {
    panels = [];

    anyPanels() {
        return this.panels.length !== 0;
    }

    activate(panel) {
        this.panels.forEach(p => p.window.classList.remove('active'));
        this.panels[this.panels.indexOf(panel)].window.classList.add('active');
    }

    add(panel) {
        this.panels.push(panel);
    }

    has(title) {
        return this.panels.find(p => p.title === title);
    }

    remove(panel) {
        this.panels.splice(this.panels.indexOf(panel), 1);
    }

    closeAll() {
        this.panels.forEach(p => p.close());
    }
}

export const panels = new PanelManager();

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
        this.window = html('div', {
            className: 'panel',
            onclick: () => panels.activate(this),
        });
        if (isOpenModel) {
            this.isOpen = isOpenModel;
        }
        if (isMiniModel) {
            this.isMini = isMiniModel;
        }

        container.appendChild(this.window);
        panels.add(this);

        $('.panels-container').selectable();
        $(this.window).draggable({
            handle: '.panel-bar',
            containment: 'parent',
        });
    }

    resizeable() {
        $(this.window).resizable({
            containment: '.panels-container',
            minHeight: 400,
            minWidth: 500,
            handles: 'nw,ne,sw,se,n,e,s,w',
        });
        return this;
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
        this.titleBar = html('div', {className: 'panel-bar font-demi'},
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

        this.window.append(html('div', {className: 'panel-frame surface'},
            html('iframe', {
                src: this.url,
                frameBorder: '0',
                onload: (event) => {
                    event.target.contentWindow.document.body.onclick = () => panels.activate(this);
                },
            }),
        ));
        this.isOpen.set(true);

        this.open();
    }


    open() {
        this.window.classList.remove('fade-out');
        this.window.classList.remove('disappear-out');
        if (this.isMini.value) {
            this.window.classList.add('appear-in');
        }
        this.isOpen.set(true);
        this.isMini.set(false);

        panels.activate(this);
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
            panels.remove(this);
            delete this;
        }, 400);
    }
}
