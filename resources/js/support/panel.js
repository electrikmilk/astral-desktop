import {addInit} from '../init.js';
import {html, text} from './render.js';

let container;
let windows = [];

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

    constructor(title, url, icon) {
        this.title = title;
        this.icon = icon;
        this.url = url;
        this.window = html('div', {className: 'panel'});

        this.initTitleBar();

        container.appendChild(this.window);
        windows.push(this);

        $(this.window).draggable().selectable().resizable();
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
            html('div', {
                className: 'panel-close-btn',
                innerHTML: '&times;',
                onclick: () => {
                    this.close();
                },
            }),
        );

        this.window.appendChild(this.titleBar);
    }


    open() {
        this.window.className = 'panel';
        this.window.append(html('div', {className: 'panel-frame'},
            html('iframe', {
                src: this.url,
                width: 640,
                height: 480,
                frameBorder: '0',
            }),
        ));
    }

    close() {
        this.window.remove();
        delete this;
    }
}
