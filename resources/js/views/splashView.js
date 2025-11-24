import {View} from '../support/views.js';
import appsView from './desktopView.js';

import {html} from '../support/render.js';

import start from '../../assets/start.wav';
import appIcon from '../../assets/astral_logo.png';

export default new View((view, controller) => {
    view.onLoad(() => {
        new Audio(start);
        //.play()
        setTimeout(() => controller.load(appsView), 2500);
    });

    return html('div', {className: 'fixed-center'},
        html('div', {className: 'fade'},
            html('img', {src: appIcon, width: 256}),
        ),
    );
});
