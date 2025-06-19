import {
  Text,
  TextStyle
} from 'https://cdn.jsdelivr.net/npm/pixi.js@8.0.0/dist/pixi.mjs';
import { createGameScene } from './gameScene.js';

let pickr;
let selectedColor = '#ff0000';

export function createStartScene(app) {
  console.log('СТАРТОВАЯ СЦЕНА ЗАПУЩЕНА');
  app.stage.removeChildren();

  const titleStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 32,
    fill: '#ffffff',
    stroke: { color: '#000000', width: 4 }
  });

  const title = new Text('Нажми ПРОБЕЛ или кнопку, чтобы начать', titleStyle);
  title.anchor.set(0.5);
  title.position.set(app.screen.width / 2, app.screen.height / 2 - 80);
  app.stage.addChild(title);

  console.log('TITLE TYPE', title);
  console.log('HAS ANCHOR?', title.anchor);
  const buttonStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 28,
    fill: '#00ff00'
  });

  const button = new Text('НАЧАТЬ ИГРУ', buttonStyle);
  button.anchor.set(0.5);
  button.position.set(app.screen.width / 2, app.screen.height / 2 + 40);
  button.interactive = true;
  button.buttonMode = true;
  app.stage.addChild(button);

  button.on('pointerdown', () => startGame());

  setupPickr();

  const spaceListener = (e) => {
    if (e.code === 'Space') startGame();
  };
  window.addEventListener('keydown', spaceListener);

  function startGame() {
    window.removeEventListener('keydown', spaceListener);
    destroyPickr();
    const hex = parseInt(selectedColor.replace('#', '0x'), 16);
    createGameScene(app, handleWin, handleLose, hex);
  }

  function handleWin(app) {
    showEndScene(app, '🏆 Победа! Нажми ПРОБЕЛ, чтобы начать заново');
  }

  function handleLose(app) {
    showEndScene(app, '💀 Поражение. Нажми ПРОБЕЛ, чтобы попробовать ещё раз');
  }

  function showEndScene(app, message) {
    app.stage.removeChildren();

    const messageStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 32,
      fill: '#ffffff',
      stroke: { color: '#000000', width: 4 }
    });

    const text = new Text(message, messageStyle);
    text.anchor.set(0.5);
    text.position.set(app.screen.width / 2, app.screen.height / 2);
    app.stage.addChild(text);

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        createStartScene(app);
      }
    });
  }
}

function setupPickr() {
  pickr = Pickr.create({
    el: '#color-picker-container',
    theme: 'monolith',
    default: selectedColor,
    swatches: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
    components: {
      preview: true,
      opacity: false,
      hue: true,
      interaction: {
        input: true,
        save: true
      }
    }
  });

  pickr.on('save', (color) => {
    selectedColor = color.toHEXA().toString();
  });
}

function destroyPickr() {
  if (pickr) {
    pickr.destroyAndRemove();
    document.getElementById('color-picker-container').innerHTML = '';
  }
}
