import {View} from '../support/views.js';
import {Panel, windows} from '../support/panel.js';

import {html, model, text} from '../support/render.js';

import astralIcon from '../../assets/astral_icon.svg';
import astralIconLight from '../../assets/astral_icon_light.svg';
import darkMode from '../stores/darkMode.js';
import {PopupList} from '../controls/popupList.js';
import start from '../../assets/start.wav';
import startView from './startView.js';
import {renderComponent} from '../component.js';
import {clearBlobs} from '../support/blobs.js';
import {Store} from '../support/store.js';
import {DialogPanel} from '../controls/dialog.js';

const apps = [
    {
        name: 'Terminal',
        url: route('apps.terminal'),
        icon: '/storage/app-icons/terminal.png',
    },
];

function createTimestamp() {
    const now = new Date();

    const timeUnits = [
        now.getHours(),
        now.getMinutes(),
    ].map(u => u.toString()
                .padStart(2, '0'));

    return [now.toDateString(), timeUnits.join(':')].join(' ');
}

export default new View((view, controller) => {
    let appList = [];
    for (const app of apps) {
        appList.push(html('a', {
                className: 'raises',
                onclick: () => {
                    const window = new Panel(app.name, app.url, app.icon);
                    window.open();
                },
            },
            html('img', {src: app.icon, width: 64}),
        ));
    }

    view.onLoad(() => {
        new Audio(start).play();
    });

    async function refresh() {
        controller.clear();
        await clearBlobs();
        window.location.reload();
    }

    const popupList = new PopupList([
        {
            label: 'Refresh',
            value: 'refresh',
            onclick: () => {
                if (windows.length !== 0) {
                    (new DialogPanel({
                        title: 'Windows are open!',
                        text: 'Cannot refresh while windows are open.',
                        warning: true,
                        okLabel: 'Close Open Windows',
                        ok: (dialog) => {
                            dialog.close();
                            windows.forEach(window => window.close());
                            refresh();
                        },
                    })).open();
                } else {
                    refresh();
                }
            },
        },
        {
            label: 'Exit',
            value: 'exit',
            onclick: () => {
                (new DialogPanel({
                    title: 'Exit Desktop',
                    text: 'Are you sure you want to exit the desktop?',
                    warning: true,
                    ok: (dialog) => {
                        dialog.close();
                        clearBlobs();
                        controller.load(startView);
                    },
                })).open();
            },
        },
    ]);

    const homeButton = html('a', {
            className: 'raises',
            onclick: () => {
                popupList.toggle();
            },
        },
        model(darkMode, (darkModeOn) => html('img', {
            src: darkModeOn ? astralIconLight : astralIcon,
            width: 32,
        })),
    );

    popupList.visible.model((visible) => {
        if (visible) {
            homeButton.classList.add('surface');
        } else {
            homeButton.classList.remove('surface');
        }
    });

    const clock = new Store(createTimestamp());
    setInterval(() => {
        clock.set(createTimestamp());
    }, 1000);

    return html('section', {},
        html('div', {
                className: 'surface padded',
                style: 'border-radius: 0',
            },
            homeButton,
            renderComponent(popupList),
            model(clock, (timestamp) => html('div', {style: 'float: right'}, text(timestamp))),
        ),
        html('div', {className: 'surface padded m-1', style: 'position:fixed;bottom:0;left:0;right:0'},
            ...appList,
        ),
    );
});
