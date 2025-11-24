/*
 * Reactivity store.
 */

export class Store {
    value = null;
    handlers = [];

    constructor(initialValue) {
        this.value = initialValue;
        this.react();
    }

    set(value) {
        this.value = value;
        this.react();
    }

    async update(handler) {
        this.value = await handler(this.value);
        this.react();
    }

    model(handler) {
        handler(this.value);
        this.handlers.push(handler);
    }

    react() {
        this.handlers.forEach(s => s(this.value));
    }
}
