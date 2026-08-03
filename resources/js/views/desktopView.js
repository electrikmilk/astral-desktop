import astralIcon from '../../assets/astral_icon.svg';
import astralIconLight from '../../assets/astral_icon_light.svg';
import start from '../../assets/start.wav';

import {renderComponent} from '../component.js';
import {clearBlobs, desktopBlobs} from '../support/blobs.js';
import {Store} from '../support/store.js';
import {DialogPanel} from '../controls/dialog.js';
import {PopupList} from '../controls/popupList.js';

import darkMode from '../stores/darkMode.js';
import desktopColors from '../stores/desktopColors.js';

import {View} from '../support/views.js';
import {Panel, panels} from '../support/panel.js';
import {html, model, text} from '../support/render.js';
import startView from './startView.js';
import {apps} from '../applications.js';

function createTimestamp() {
    const now = new Date();

    const timeUnits = [
        now.getHours(),
        now.getMinutes(),
    ].map(u => u.toString()
                .padStart(2, '0'));

    return [now.toDateString(), timeUnits.join(':')].join(' ');
}

const isFullscreen = new Store(false);

export default new View((view, controller) => {
    let appList = [];
    for (const app of apps) {
        const appOpen = new Store(false);
        const appMini = new Store(false);
        const icon = '/storage/app-icons/' + app.icon;

        appList.push(model(appMini, (minimized) => html('a', {
                className: minimized ? 'raises surface' : 'raises',
                onclick: () => {
                    const openPanel = panels.has(app.name);
                    if (!openPanel) {
                        const window = new Panel(app.name, app.url, icon, appOpen, appMini)
                            .withMinimizeButton();

                        if (app.resizeable) {
                            window.resizeable();
                        }

                        window.init();
                        return;
                    }

                    openPanel.open();
                },
            },
            html('img', {src: icon, width: 64}),
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

    function desktopExitBlock(callback) {
        if (panels.anyPanels()) {
            (new DialogPanel({
                title: 'Windows are open!',
                text: 'Are you sure? Windows are still open.',
                warning: true,
                okLabel: 'Close Open Windows',
                ok: (dialog) => {
                    dialog.close();
                    panels.closeAll();
                    callback();
                },
            })).open();
            return;
        }

        callback();
    }

    const mainMenu = new PopupList([
        {
            label: 'Refresh',
            value: 'refresh',
            onclick: () => {
                desktopExitBlock(() => refresh());
            },
        },
        {
            template: () => model(isFullscreen, () => text(isFullscreen.value ? 'Exit Fullscreen' : 'Enter Fullscreen')),
            value: 'fullscreen',
            onclick: () => {
                const doc = document.documentElement;
                if (document.fullscreenElement === doc) {
                    document.exitFullscreen();
                    isFullscreen.set(false);
                    return;
                }

                if (doc.requestFullscreen) {
                    doc.requestFullscreen();
                } else if (doc.webkitRequestFullscreen) {
                    doc.webkitRequestFullscreen();
                } else if (doc.msRequestFullscreen) {
                    doc.msRequestFullscreen();
                }

                isFullscreen.set(true);
            },
        },
        {
            label: 'Exit',
            value: 'exit',
            onclick: () => {
                desktopExitBlock(() => {
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
                });
            },
        },
    ]);

    const homeButton = html('a', {
            className: 'raises',
            onclick: () => {
                mainMenu.toggle();
            },
        },
        model(darkMode, (darkModeOn) => html('img', {
            src: darkModeOn ? astralIconLight : astralIcon,
            width: 32,
        })),
    );

    mainMenu.visible.model((visible) => {
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
            html('div', {},
                homeButton,
                renderComponent(mainMenu),
            ),
            model(clock, (timestamp) => html('div', {}, text(timestamp))),
        ),
        html('div', {className: 'surface padded m-1 app-bar'},
            ...appList,
        ),
    );
});
