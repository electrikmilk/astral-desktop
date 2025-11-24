import {Store} from './support/store.js';

export class Component {
    constructor(props) {
        this.store(props);
    }

    store(props) {
        for (const prop in props) {
            this[prop] = new Store(props[prop] ?? null);
        }
    }

    template() {
        // override
    }
}

// Render a component class.
export function renderComponent(component) {
    return component.template();
}
