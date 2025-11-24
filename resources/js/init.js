/*
Register functions to run on init.
 */

export let inits = {};

export function addInit(name, callable) {
    inits[name] = callable;
}

export function init() {
    for (const i in inits) {
        console.log('[init]', i);
        inits[i]();
    }
}
