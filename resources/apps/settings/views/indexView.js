import {View} from '../../../js/support/views.js';
import {html, model, text} from '../../../js/support/render.js';
import desktopColors from '../../../js/stores/desktopColors.js';

export default new View((view, controller) => {
    return html('div', {},
        html('p', {className: 'm-1 opacity-half'}, text('Some settings apply on refresh.')),
        html('div', {className: 'surface padded m-1'},
            html('div', {style: {display: 'grid', gridTemplateColumns: '1fr 1fr'}},
                text('Desktop Colors'),
                html('div', {className: 'padded m-1'},
                    model(desktopColors, (colors) => {
                        let colorInputs = [];
                        for (const c in colors) {
                            const color = colors[c];
                            colorInputs.push(
                                html('input', {
                                    type: 'color',
                                    value: color,
                                    onchange: () => {
                                        desktopColors.update((dc) => {
                                            dc[c] = event.target.value;
                                            return dc;
                                        });
                                    },
                                }),
                            );
                        }

                        return html('div', {}, ...colorInputs);
                    }),
                ),
            ),
        ),
    );
});
