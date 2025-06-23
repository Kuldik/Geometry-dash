import { Score } from '../utils/score.js';
import { Player } from '../objects/player.js';
import { Obstacle } from '../objects/obstacle.js';
import { checkCollision } from '../utils/collision.js';
import { getRandomObstacleInterval, WIN_SCORE } from '../utils/constants.js';
import { GroundManager } from '../objects/GroundManager.js';

export async function createGameScene(app, onWin, onLose, playerColor = 0xff0000) {
    console.log('[Scene] Game scene loading...');
    try {
        app.stage.removeChildren();
        const gameContainer = new PIXI.Container();
        app.stage.addChild(gameContainer);
        app.gameContainer = gameContainer;

        // 🕵️️🎥 Video background
        const video = document.createElement('video');
        video.src = 'video/loop.mp4';
        video.loop = true;
        video.muted = true;
        video.autoplay = true;
        video.playsInline = true;
        video.style.display = 'none';
        document.body.appendChild(video);
        await video.play();

        const videoTexture = PIXI.Texture.from(video);
        const videoSprite = new PIXI.Sprite(videoTexture);
        videoSprite.width = app.screen.width;
        videoSprite.height = app.screen.height;
        gameContainer.addChild(videoSprite);

        // 🎵 Audio setup
        const winSound = new Audio('sounds/yippeeeeeeeeeeeeee.mp3');
        const failSound = new Audio('sounds/spongebob-fail.mp3');
        const coinSound = new Audio('sounds/coin.mp3');
        const deathSound = new Audio('sounds/death.mp3');
        winSound.volume = 0.7;
        failSound.volume = 0.7;
        coinSound.volume = 0.3;
        deathSound.volume = 1;

        // 🎵 Фоновая музыка
        const backgroundMusic = new Audio('sounds/Pizza.mp3');
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.3;
        backgroundMusic.play();

        const groundManager = new GroundManager(app);

        const score = new Score();
        const scoreStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 0xff0000,
            stroke: 0xffffff,
            strokeThickness: 4,
            fontWeight: 'bold'
        });
        const scoreLabel = new PIXI.Text(`SCORE: ${score.current}`, scoreStyle);
        scoreLabel.anchor.set(0.5);
        scoreLabel.position.set(app.screen.width / 2, 50);
        gameContainer.addChild(scoreLabel);

        const player = new Player(app);
        player.sprite.tint = playerColor;
        gameContainer.addChild(player.sprite);

        let isSpaceHeld = false;
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                isSpaceHeld = true;
                e.preventDefault();
            }
        };
        const handleKeyUp = (e) => {
            if (e.code === 'Space') {
                player.jump(isSpaceHeld);
                isSpaceHeld = false;
            }
        };

        const canvas = app.view;
        canvas.addEventListener('keydown', handleKeyDown);
        canvas.addEventListener('keyup', handleKeyUp);
        canvas.tabIndex = 1;
        canvas.focus();

        let obstacleTimer = 0;
        let obstacles = [];
        let nextObstacleInterval = getRandomObstacleInterval();

        const gameLoop = (delta) => {
            try {
                player.update(groundManager);
                obstacleTimer += delta;
                groundManager.update();

                if (obstacleTimer > nextObstacleInterval / 16.67) {
                    const obs = new Obstacle(app, groundManager);
                    obstacles.push(obs);
                    gameContainer.addChild(obs.sprite);
                    obstacleTimer = 0;
                    nextObstacleInterval = getRandomObstacleInterval();
                }

                obstacles = obstacles.filter(obs => {
                    obs.update();
                    if (obs.isOutOfScreen()) {
                        score.add();
                        scoreLabel.text = `SCORE: ${score.current}`;
                        coinSound.currentTime = 0;
                        coinSound.play();

                        gameContainer.removeChild(obs.sprite);
                        obs.destroy();
                        return false;
                    }
                    return true;
                });

                if (obstacles.some(obs => checkCollision(player.sprite, obs.sprite))) {
                    deathSound.currentTime = 0;
                    deathSound.play();
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
            gsap.killTweensOf(player.sprite);

            obstacles.forEach(obs => {
                gameContainer.removeChild(obs.sprite);
                obs.destroy();
            });

            app.stage.removeChild(gameContainer);
            gameContainer.destroy({ children: true });

            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;

            // 💾 Сохраняем текущий результат
            localStorage.setItem('lastScore', score.current);
            const best = parseInt(localStorage.getItem('bestScore') || '0', 10);
            if (score.current > best) {
                localStorage.setItem('bestScore', score.current);
            }

            if (won) {
                winSound.currentTime = 0;
                winSound.play();
                onWin();
            } else {
                failSound.currentTime = 0;
                failSound.play();
                onLose();
            }
        };



        app.ticker.add(gameLoop);
        console.log('[Scene] Game scene loaded successfully');

    } catch (error) {
        console.error('Game scene initialization failed:', error);
        throw error;
    }
}
