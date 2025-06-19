// objects/obstacle.js

import * as PIXI from '/node_modules/pixi.js/dist/pixi.mjs';

import { OBSTACLE_SPEED, GAME_WIDTH, GROUND_Y } from '../utils/constants.js';

export class Obstacle {
  constructor(app) {
    this.width = Math.random() * 40 + 20;
    this.height = Math.random() * 60 + 30;

    this.sprite = new PIXI.Graphics();
    this.sprite.beginFill(0x000000);
    this.sprite.drawRect(0, 0, this.width, this.height);
    this.sprite.endFill();
    this.sprite.x = GAME_WIDTH + this.width;
    this.sprite.y = GROUND_Y - this.height;

    app.stage.addChild(this.sprite);
  }

  update() {
    this.sprite.x -= OBSTACLE_SPEED;
  }

  isOutOfScreen() {
    return this.sprite.x + this.width < 0;
  }

  destroy(app) {
    app.stage.removeChild(this.sprite);
  }
}
