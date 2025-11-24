import {View} from '../support/views.js';
import {Panel} from '../support/panel.js';

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

const apps = [
    {
        name: 'Terminal',
        url: route('apps.terminal'),
        icon: '/storage/app-icons/terminal.png',
    },
];

function createTimestamp() {
    const now = new Date();
    return now.toDateString() + ' ' + now.getHours() + ':' + now.getMinutes();
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

    const popupList = new PopupList([
        {
            label: 'Exit',
            value: 'exit',
            onclick: () => {
                controller.load(startView);
                clearBlobs();
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
