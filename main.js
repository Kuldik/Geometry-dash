import { createStartScene } from './scenes/startScene.js';

class Game {
    constructor() {
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0xF5F5F5,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            antialias: true
        });

        // Добавление canvas в DOM
        const container = document.getElementById('pixi-container');
        container.appendChild(this.app.view);

        // Фокусировка
        this.app.view.tabIndex = 1;
        this.app.view.focus();
        this.app.view.style.outline = 'none';

        window.addEventListener('resize', () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        });

        createStartScene(this.app);
    }
}

window.addEventListener('DOMContentLoaded', () => new Game());
