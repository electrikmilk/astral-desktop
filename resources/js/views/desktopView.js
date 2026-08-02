import {View} from '../support/views.js';
import {Panel, panels} from '../support/panel.js';

import {html, model, text} from '../support/render.js';

import astralIcon from '../../assets/astral_icon.svg';
import astralIconLight from '../../assets/astral_icon_light.svg';
import darkMode from '../stores/darkMode.js';
import {PopupList} from '../controls/popupList.js';
import start from '../../assets/start.wav';
import startView from './startView.js';
import {renderComponent} from '../component.js';
import {clearBlobs, desktopBlobs} from '../support/blobs.js';
import {Store} from '../support/store.js';
import {DialogPanel} from '../controls/dialog.js';
import desktopColors from '../stores/desktopColors.js';

const apps = [
    {
        name: 'Terminal',
        url: route('apps.terminal'),
        icon: '/storage/app-icons/terminal.png',
    },
    {
        name: 'Settings',
        url: route('apps.settings'),
        icon: '/storage/app-icons/settings.png',
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
        const appOpen = new Store(false);
        const appMini = new Store(false);

        appList.push(model(appMini, (minimized) => html('a', {
                className: minimized ? 'raises surface' : 'raises',
                onclick: () => {
                    const openPanel = panels.has(app.name);
                    if (!openPanel) {
                        const window = new Panel(app.name, app.url, app.icon, appOpen, appMini).withMinimizeButton();
                        window.init();
                        return;
                    }

                    openPanel.open();
                },
            },
            html('img', {src: app.icon, width: 64}),
            model(appOpen, (open) => html('div', {className: 'panel-indicator'}, open ? text('•') : text(''))),
        )));
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
                if (panels.anyPanels()) {
                    (new DialogPanel({
                        title: 'Windows are open!',
                        text: 'Cannot refresh while windows are open.',
                        warning: true,
                        okLabel: 'Close Open Windows',
                        ok: (dialog) => {
                            dialog.close();
                            panels.closeAll();
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

    let initColors = 0;
    desktopColors.model(async () => {
        if (initColors) {
            await clearBlobs();
            desktopBlobs();
        }
        initColors++;
    });

    return html('section', {},
        html('div', {
                className: 'surface padded top-bar',
                style: 'border-radius: 0',
            },
            homeButton,
            renderComponent(popupList),
            model(clock, (timestamp) => html('div', {}, text(timestamp))),
        ),
        html('div', {className: 'surface padded m-1', style: 'position:fixed;bottom:0;left:0;right:0'},
            ...appList,
        ),
    );
});
