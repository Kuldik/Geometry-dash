// ✅ objects/obstacle.js

import { OBSTACLE_SPEED } from '../utils/constants.js';

export class Obstacle {
    constructor(app, groundManager) {
        this.app = app;
        this.groundManager = groundManager;

        this.width = Math.random() * 40 + 20;
        this.height = Math.random() * 60 + 30;

        const base = this.width;
        const height = this.height;

        this.sprite = new PIXI.Graphics()
            .beginFill(0xFF3300)
            .moveTo(0, height)
            .lineTo(base / 2, 0)
            .lineTo(base, height)
            .lineTo(0, height)
            .endFill();

        this.sprite.x = this.app.screen.width;
        this.sprite.y = this.groundManager.getGroundY(this.sprite.x) - height;
    }

    update() {
        this.sprite.x -= OBSTACLE_SPEED;
        this.sprite.y = this.groundManager.getGroundY(this.sprite.x) - this.height;
    }

    isOutOfScreen() {
        return this.sprite.x + this.width < 0;
    }

    destroy() {
        this.sprite.destroy();
    }
}
