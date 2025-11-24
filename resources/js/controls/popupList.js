import {html, model, text} from '../support/render.js';
import {Component} from '../component.js';

export class PopupList extends Component {
    options;
    selected;
    visible;

    constructor(options) {
        super();

        this.store({
            options: options,
            selected: null,
            visible: false,
        });
    }

    setOptions(newOptions) {
        this.options.set(newOptions);
    }

    open() {
        this.visible.set(true);
    }

    close() {
        this.visible.set(false);
    }

    toggle() {
        this.visible.update(v => !v);
    }

    value() {
        return this.selected.value;
    }

    template() {
        return model(this.visible, visible => {
                if (!visible) {
                    return html();
                }

                return model(this.options, (options) => {
                    let optionsList = [];
                    for (const option of options) {
                        if (option.divider) {
                            optionsList.push(html('hr'));
                            continue;
                        }

                        optionsList.push(html('a', {
                                className: 'popup-list-option',
                                onclick: () => {
                                    if (option.value) {
                                        this.selected.set(option.value);
                                    }
                                    if (option.onclick) {
                                        option.onclick();
                                    }
                                    this.close();
                                },
                            },
                            text(option.label),
                        ));
                    }

                    return html('div', {className: 'popup-list'}, ...optionsList);
                });
            },
        );
    }
}
