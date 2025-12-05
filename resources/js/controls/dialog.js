import {Panel} from '../support/panel.js';
import {html, text} from '../support/render.js';

export class DialogPanel extends Panel {
    innerTitle;
    text;
    warning = false;
    okCallback = () => {
        this.close();
    };
    cancelCallback = () => {
        this.close();
    };
    cancelButton = true;
    okLabel = 'OK';
    cancelLabel = 'Cancel';

    constructor(props = {
        title: null,
        text: null,
        icon: null,
        warning: false,
        cancelButton: true,
        okLabel: 'OK',
        cancelLabel: 'Cancel',
    }) {
        super(props.warning ? 'Warning' : 'Alert', null, props.warning ? '/storage/alert/warn.png' : '/storage/alert/prompt.png', false);

        this.innerTitle = props.title;
        this.text = props.text;
        this.warning = props.warning ?? false;

        if (props.ok) {
            this.okCallback = props.ok;
        }
        if (props.cancel) {
            this.cancelCallback = props.cancel;
        }
        this.cancelButton = props.cancelButton ?? true;
        this.okLabel = props.okLabel ?? 'OK';
        this.cancelLabel = props.cancelLabel ?? 'Cancel';
    }

    open() {
        const okButton = html('button', {
                onclick: () => this.okCallback(this),
                className: this.warning ? 'danger' : 'primary',
                autofocus: !this.cancelButton,
            },
            text(this.okLabel ?? (this.warning ? 'Proceed' : 'OK')),
        );

        const cancelButton = html('button', {
                onclick: () => this.cancelCallback(this),
                autofocus: this.cancelButton,
            },
            text(this.cancelLabel),
        );

        this.window.append(html('div', {className: 'text-center', style: {padding: '1rem'}},
            html('img', {src: this.icon, alt: 'Alert', width: 128, height: 128}),
            html('h3', {}, text(this.innerTitle)),
            html('p', {}, text(this.text)),
            this.cancelButton ? html('div', {style: {display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}},
                cancelButton,
                okButton,
            ) : html('div', {style: {display: 'grid', gridTemplateColumns: '1fr', gap: '1rem'}}, okButton),
        ));
    }
}
