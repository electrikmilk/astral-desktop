/*
 * Local storage configuration store.
 */

import {Store} from './store.js';

export class ConfigStore extends Store {
    key;

    constructor(key, initialValue) {
        super(initialValue);
        this.key = key;

        const storedValue = localStorage.getItem(this.key);
        if (storedValue) {
            this.value = JSON.parse(storedValue).value;
        }
    }

    react() {
        super.react();
        if (this.key) {
            localStorage.setItem(this.key, JSON.stringify({value: this.value}));
        }
    }
}
