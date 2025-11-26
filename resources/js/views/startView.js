import {View} from '../support/views.js';
import {views} from '../app.js';
import notDoingSoHotView from './healthCheckFailedView.js';

import {Store} from '../support/store.js';
import remote from '../stores/remote.js';

import {clearBlobs, ColorBlobGroup, desktopBlobs} from '../support/blobs.js';
import {html, model, text} from '../support/render.js';
import {empty} from '../support/util.js';

import computerOn from '../../assets/computer/on.png';
import computerOff from '../../assets/computer/off.png';
import astralProjectionInstallPoint from '../../assets/computer/astral_installed.png';
import appIcon from '../../assets/astral_logo.png';
import desktopView from './desktopView.js';

export let remoteOK = new Store(false);

export default new View((view, controller) => {
    const welcomeBlobs = new ColorBlobGroup(
        '#fffe0b',
        '#ffcf39',
        '#2ea6f3',
        '#198af3',
        '#f19a00',
        '#d98602',
        '#a24cff',
        '#a451f6',
    );
    const startButton = html('button', {
            onclick: () => {
                startButton.disabled = true;
                welcomeBlobs.clear();
                desktopBlobs();
                controller.load(desktopView);
            },
            disabled: true,
        },
        text('Start'),
    );

    view.onLoad(async () => {
        remote.model(info => startButton.disabled = !remoteOK.value || empty(info));

        await new Promise((resolve) => {
            setTimeout(async () => {
                await checkRemoteHealth();
                resolve();
            }, 2000);
        });

        await remote.update(async () => {
            const response = await axios.get(route('remote.info')).catch(() => {
                // D:
            });

            if (response) {
                return response.data;
            }
        });


        setInterval(checkRemoteHealth, 10000);
    });

    return html('div', {className: 'fixed-center'},
        html('div', {},
            html('div', {style: 'display:none'},
                html('img', {src: computerOn}),
                html('img', {src: computerOff}),
                html('img', {src: astralProjectionInstallPoint}),
            ),
            html('div', {className: 'surface p-1'},
                model(remote, (info) => {
                    if (empty(info)) {
                        return model(remoteOK, ok => html('img', {src: (ok ? computerOn : computerOff)}));
                    }

                    return html('img', {src: astralProjectionInstallPoint});
                }),
                model(remote, (info) => {
                    const emptyInfo = empty(info);
                    return html('div', {},
                        html('h3', {style: 'margin: .3rem 0'},
                            text(emptyInfo ? 'Connecting to Astral host...' : info.name),
                            html('div', {
                                className: 'indicator' + (remoteOK.value ? ' success' : ''),
                                style: 'margin-left: .5rem',
                            }),
                        ),
                        html('p', {style: 'opacity: 0.5'}, !emptyInfo ? text(`Astral Installed - ${info.system} (${info.arch})`) : text('Astral not appear to be installed.')),
                    );
                }),
                startButton,
            ),
            html('div', {className: 'flex-center text-lg', style: 'margin-top: 2rem'},
                html('img', {src: appIcon, width: 64}),
                html('p', {style: 'margin:0;margin-left: .5rem;'}, text('Astral')),
            ),
        ),
    );
});

let initialHealthCheck = true;

async function checkRemoteHealth() {
    const response = await axios.get('/').catch(() => {
        if (remoteOK.value === true) {
            console.error('health check failed!');
            remoteOK.set(false);
            remoteConnectionErrorScreen();
        }
    });
    if (response && response.status === 200 && !remoteOK.value) {
        if (!initialHealthCheck) {
            console.info('health restored!');
            await views.clear();
            await clearBlobs();
            window.onload(null);
        }
        remoteOK.set(true);
    }
    initialHealthCheck = false;
}

async function remoteConnectionErrorScreen() {
    if (views.currentView) {
        await views.clear();
    }

    await clearBlobs();
    new ColorBlobGroup('darkred', 'maroon');

    setTimeout(() => {
        views.load(notDoingSoHotView);
    }, 2000);
}
