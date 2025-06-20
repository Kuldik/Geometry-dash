// ✅ objects/Obstacle.js
import { OBSTACLE_SPEED } from '../utils/constants.js';

export class Obstacle {
    constructor(app, groundY) {
        this.app = app;
        this.width = Math.random() * 40 + 20;
        this.height = Math.random() * 60 + 30;

        const base = this.width;
        const height = this.height;

        this.sprite = new PIXI.Graphics()
            .beginFill(0xFF0000)
            .moveTo(0, height)
            .lineTo(base / 2, 0)
            .lineTo(base, height)
            .lineTo(0, height)
            .endFill();

        this.sprite.x = this.app.screen.width;
        this.sprite.y = groundY - height;
        this.sprite.eventMode = 'none';
    }

    update() {
        this.sprite.x -= OBSTACLE_SPEED;
    }

    isOutOfScreen() {
        return this.sprite.x + this.width < 0;
    }

    destroy() {
        this.sprite.destroy();
    }
}
