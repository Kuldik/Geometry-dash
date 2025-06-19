// objects/player.js

import { GRAVITY, JUMP_FORCE, LONG_JUMP_HOLD, GROUND_Y } from '../utils/constants.js';
import * as PIXI from '/node_modules/pixi.js/dist/pixi.mjs';


export class Player {
  constructor(app, texture) {
    this.app = app;
    this.size = 64; // размер персонажа
    this.sprite = new PIXI.Sprite(texture);

    // Центрируем спрайт
    this.sprite.anchor.set(0.5);
    this.sprite.width = this.size;
    this.sprite.height = this.size;
    this.sprite.position.set(150, GROUND_Y - this.size / 2);

    this.vy = 0;
    this.isJumping = false;
    this.isAlive = true;
    this.rotationTarget = 0;

    app.stage.addChild(this.sprite);
  }

  jump(isHeld = false) {
    if (!this.isJumping) {
      this.vy = isHeld ? LONG_JUMP_HOLD : JUMP_FORCE;
      this.isJumping = true;
      this.rotationTarget += Math.PI / 2;
    }
  }

  update() {
    if (!this.isAlive) return;

    this.vy += GRAVITY;
    this.sprite.y += this.vy;

    // Приземление
    if (this.sprite.y >= GROUND_Y - this.size / 2) {
      this.sprite.y = GROUND_Y - this.size / 2;
      this.vy = 0;
      this.isJumping = false;
    }

    // Плавное вращение к целевому значению
    this.sprite.rotation += (this.rotationTarget - this.sprite.rotation) * 0.2;
  }

  die() {
    this.isAlive = false;
  }

  reset() {
    this.sprite.y = GROUND_Y - this.size / 2;
    this.sprite.rotation = 0;
    this.vy = 0;
    this.rotationTarget = 0;
    this.isJumping = false;
    this.isAlive = true;
  }
}
