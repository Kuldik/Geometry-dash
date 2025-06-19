import {
  Text,
  TextStyle,
  Loader
} from 'https://cdn.jsdelivr.net/npm/pixi.js@8.0.0/dist/pixi.mjs';

import { Player } from '../objects/player.js';
import { Obstacle } from '../objects/obstacle.js';
import { checkCollision } from '../utils/collision.js';
import { Score } from '../utils/score.js';
import { OBSTACLE_INTERVAL, WIN_SCORE } from '../utils/constants.js';

let obstacleTimer = 0;
let obstacles = [];
let scoreLabel;
let gameTicker;

export function createGameScene(app, onWin, onLose, playerColor = 0xff0000) {
  app.stage.removeChildren();

  const loader = new Loader();
  loader.add('player', 'img/dash.png');

  loader.load((_, resources) => {
    const texture = resources.player.texture;
    const score = new Score();
    const player = new Player(app, texture);

    const scoreStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fill: '#ffffff',
      stroke: { color: '#000000', width: 4 }
    });

    scoreLabel = new Text(`Очки: ${score.current}`, scoreStyle);
    scoreLabel.anchor.set(0.5);
    scoreLabel.position.set(app.screen.width / 2, 60);
    app.stage.addChild(scoreLabel);

    let isSpaceHeld = false;
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') isSpaceHeld = true;
    });
    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        player.jump(isSpaceHeld);
        isSpaceHeld = false;
      }
    });

    gameTicker = app.ticker.add(() => {
      player.update();

      obstacleTimer += app.ticker.elapsedMS;
      if (obstacleTimer > OBSTACLE_INTERVAL) {
        const obs = new Obstacle(app);
        obstacles.push(obs);
        obstacleTimer = 0;
      }

      obstacles.forEach((obstacle) => obstacle.update());

      obstacles = obstacles.filter((obs) => {
        if (obs.isOutOfScreen()) {
          score.add();
          updateScore(score);
          obs.destroy(app);
          return false;
        }
        return true;
      });

      for (const obs of obstacles) {
        if (checkCollision(player, obs)) {
          endGame(false);
          return;
        }
      }

      if (score.current >= WIN_SCORE) {
        endGame(true);
      }
    });

    function updateScore(score) {
      scoreLabel.text = `Очки: ${score.current}`;
    }

    function endGame(won) {
      gameTicker.stop();
      app.stage.removeChildren();
      obstacles.forEach((o) => o.destroy(app));
      obstacles = [];

      if (won) {
        onWin(app);
      } else {
        onLose(app);
      }
    }
  });
}
