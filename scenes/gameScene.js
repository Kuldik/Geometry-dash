
import { Score } from '../utils/score.js';
import { Player } from '../objects/player.js';
import { Obstacle } from '../objects/obstacle.js';
import { checkCollision } from '../utils/collision.js';
import { OBSTACLE_INTERVAL, WIN_SCORE } from '../utils/constants.js';
import { GroundManager } from '../objects/GroundManager.js';

export async function createGameScene(app, onWin, onLose, playerColor = 0xff0000) {
    console.log('[Scene] Game scene loading...');
    try {
        app.stage.removeChildren();
        const gameContainer = new PIXI.Container();
        app.stage.addChild(gameContainer);

        const bg = new PIXI.Graphics();
        bg.beginFill(0xF5F5F5);
        bg.drawRect(0, 0, app.screen.width, app.screen.height);
        bg.endFill();
        gameContainer.addChild(bg);

        const groundManager = new GroundManager(app);
        const score = new Score();
        const scoreStyle = new PIXI.TextStyle({
            fontFamily: 'Arial', fontSize: 36, fill: 0xff0000,
            stroke: 0xffffff, strokeThickness: 4, fontWeight: 'bold'
        });
        const scoreLabel = new PIXI.Text(`SCORE: ${score.current}`, scoreStyle);
        scoreLabel.anchor.set(0.5);
        scoreLabel.position.set(app.screen.width / 2, 50);
        gameContainer.addChild(scoreLabel);

        const player = new Player(app);
        player.sprite.tint = playerColor;
        gameContainer.addChild(player.sprite);
        console.log('[Player] Initialized with color:', playerColor);

        let isSpaceHeld = false;
        const handleKeyDown = (e) => { if (e.code === 'Space') { isSpaceHeld = true; e.preventDefault(); } };
        const handleKeyUp = (e) => { if (e.code === 'Space') { player.jump(isSpaceHeld); isSpaceHeld = false; } };
        const canvas = app.view;
        canvas.addEventListener('keydown', handleKeyDown);
        canvas.addEventListener('keyup', handleKeyUp);
        canvas.tabIndex = 1;
        canvas.focus();

        let obstacleTimer = 0;
        let obstacles = [];

        const gameLoop = (delta) => {
            try {
                player.update(groundManager);
                obstacleTimer += delta;
                groundManager.update();

                if (obstacleTimer > OBSTACLE_INTERVAL / 16.67) {
                    const groundY = groundManager.getGroundYAt(app.screen.width - 50);
                    const obs = new Obstacle(app, groundY);
                    obstacles.push(obs);
                    gameContainer.addChild(obs.sprite);
                    obstacleTimer = 0;
                }

                obstacles = obstacles.filter(obs => {
                    obs.update();
                    if (obs.isOutOfScreen()) {
                        score.add();
                        scoreLabel.text = `SCORE: ${score.current}`;
                        gameContainer.removeChild(obs.sprite);
                        obs.destroy();
                        return false;
                    }
                    return true;
                });

                if (obstacles.some(obs => checkCollision(player.sprite, obs.sprite))) {
                    endGame(false);
                } else if (score.current >= WIN_SCORE) {
                    endGame(true);
                }
            } catch (error) {
                console.error('Game loop error:', error);
                endGame(false);
            }
        };

        const endGame = (won) => {
            app.ticker.remove(gameLoop);
            canvas.removeEventListener('keydown', handleKeyDown);
            canvas.removeEventListener('keyup', handleKeyUp);
            obstacles.forEach(obs => {
                gameContainer.removeChild(obs.sprite);
                obs.destroy();
            });
            app.stage.removeChild(gameContainer);
            gameContainer.destroy({ children: true });
            won ? onWin() : onLose();
        };

        app.ticker.add(gameLoop);
        console.log('[Scene] Game scene loaded successfully');

    } catch (error) {
        console.error('Game scene initialization failed:', error);
        throw error;
    }
}