import {html, text} from '../../../js/support/render.js';
import {View} from '../../../js/support/views.js';

export default new View(() => {
    return html('div', {}, text('Files app'));
});
