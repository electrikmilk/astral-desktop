export async function sleep(s) {
    return await new Promise(resolve => setTimeout(resolve, s * 1000));
}

export function rad(d, h) {
    return ((d * d) / (8 * h) + h / 2);
}

export function empty(value) {
    if (value === undefined || typeof value === 'undefined' || value === null) {
        return true;
    }
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    if (typeof value === 'object') {
        return Object.is(value, {});
    }

    return (!value && value !== 0 && value !== false);
}

export async function nextFrame() {
    await new Promise(resolve => setTimeout(resolve));
}

export const TRY = func => {
    try {
        return [func(), null];
    } catch (e) {
        return [null, e];
    }
};

/* Convert an object to CSS.
"rule": {
    "property": "value"
}
 */
export function obj2CSS(obj) {
    let css = '';
    for (const rules of obj) {
        for (const rule in rules) {
            css += rule + '{';
            for (const property in rules[rule]) {
                css += `${property}:${rules[rule][property]};`;
            }
            css += '}';
        }
    }

    return css;
}

export function returnIfTrue(e, result) {
    return (e) ? result : null;
}
