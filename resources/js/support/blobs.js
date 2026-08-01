/*
 * Animates the blobs in the background, handles their movement, etc.
 *
 * Throw some random blobs in the background with `rainbowBlobs()`.
 */

import {RNG} from './random.js';
import {addInit} from '../init.js';
import {sleep} from './util.js';
import desktopColors from '../stores/desktopColors.js';

let container;
export let blobs = [];

addInit('blobs', () => {
    if (container) {
        return;
    }

    container = document.createElement('div');
    container.className = 'blobs-container';
    document.body.appendChild(container);
});

export async function clearBlobs() {
    for (const blob of blobs) {
        await blob.clear();
    }
    await sleep(0.5);
}

export function desktopBlobs() {
    new ColorBlobGroup(desktopColors);
}

export class ColorBlobGroup {
    blobs = [];
    delay = 500;

    constructor(...colors) {
        this.add(...colors);
    }

    add(...colors) {
        let timeout = 0;
        for (const color of colors) {
            setTimeout(() => {
                this.blobs.push(
                    new ColorBlob(color),
                );
            }, timeout += this.delay);
        }
    }

    clear() {
        for (const blob of this.blobs) {
            blob.clear();
        }

        this.blobs = [];
        delete this;
    }
}

export class ColorBlob {
    x;
    y;
    blur;
    scale;
    opacity;
    animationInterval;

    constructor(color) {
        blobs.push(this);

        this.element = document.createElement('div');
        this.element.className = 'blob';
        this.element.style.background = color;

        container.appendChild(this.element);

        let initX = new RNG(0, 100, 1000);
        let initY = new RNG(0, 100, 1000);
        initX.new();
        initY.new();
        initX.maybeNeg();
        initY.maybeNeg();

        this.element.style.top = initY.value + 'px';
        this.element.style.left = initX.value + 'px';

        this.x = new RNG(initX.value, -100, window.innerWidth + 100);
        this.y = new RNG(initY.value, -100, window.innerHeight + 100);
        this.blur = new RNG(1, 100, 200);
        this.scale = new RNG(.1, .1, 2);
        this.opacity = new RNG(0, .1, 1);

        this.animate();
        this.animationInterval = setInterval(() => {
            this.animate();
        }, 1500);
    }

    animate() {
        this.element.animate([
            {
                top: this.y.new() + 'px',
                left: this.x.new() + 'px',
                filter: `blur(${this.blur.new()}px)`,
                transform: `scale(${this.scale.new()})`,
                opacity: this.opacity.new(),
            },
        ], {
            duration: 3000,
            fill: 'forwards',
            easing: 'ease-in-out',
            iterations: 1,
        });
    }

    async clear() {
        return new Promise((resolve) => {
            clearInterval(this.animationInterval);
            this.element.animate([
                {
                    filter: 'blur(100px)',
                    transform: 'scale(0)',
                    opacity: 0,
                },
            ], {
                duration: 1000,
                fill: 'forwards',
                easing: 'ease-in-out',
                iterations: 1,
            });
            setTimeout(() => {
                this.element.remove();
                resolve();
            }, 1000);
        });
    }
}
