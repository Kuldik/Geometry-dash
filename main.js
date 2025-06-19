const PIXI = window.PIXI;
import { createStartScene } from './scenes/startScene.js';

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundAlpha: 0,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
});

document.getElementById('pixi-container').appendChild(app.view);
createStartScene(app);
