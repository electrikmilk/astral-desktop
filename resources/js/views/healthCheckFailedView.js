import {View} from '../support/views.js';
import {html, text} from '../support/render.js';
import {faIcon} from '../faIcon.js';

export default new View(() => {
    return html('div', {className: 'fixed-center shake', style: 'color: #fafafa'},
        html('div', {},
            html('div', {className: 'text-xl'}, faIcon('triangle-exclamation')),
            html('div', {},
                html('h3', {}, text('Remote health check failed')),
                html('p', {}, text('Unable to connect to remote host!')),
                html('p', {}, text('Trying again in 10 seconds...')),
            ),
        ),
    );
});
