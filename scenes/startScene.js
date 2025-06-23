let selectedColor = '#ff0000';
let pickr = null;

export function createStartScene(app) {
    console.log('[Scene] Start scene loaded');
    app.stage.removeChildren();

    const bg = createGradientBackground(app);
    app.stage.addChild(bg);

    const bestScore = localStorage.getItem('bestScore') || 0;

    const textStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center'
    });

    const title = new PIXI.Text('Press SPACE to start', textStyle);
    title.anchor.set(0.5);
    title.position.set(app.screen.width / 2, app.screen.height / 2 - 80);
    app.stage.addChild(title);

    const buttonText = new PIXI.Text('OR CLICK HERE', new PIXI.TextStyle({
        ...textStyle,
        fill: '#00ff00'
    }));
    buttonText.anchor.set(0.5);
    buttonText.position.set(app.screen.width / 2, app.screen.height / 2);
    buttonText.interactive = true;
    buttonText.buttonMode = true;
    app.stage.addChild(buttonText);

    const bestScoreText = new PIXI.Text(`🏆 BEST SCORE: ${bestScore}`, new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 28,
        fill: '#ffff00',
        stroke: '#000000',
        strokeThickness: 3
    }));
    bestScoreText.anchor.set(0.5);
    bestScoreText.position.set(app.screen.width / 2, app.screen.height / 2 + 80);
    app.stage.addChild(bestScoreText);

    const startGame = () => {
        console.log('[Input] Starting game');
        console.log('[Input] Selected color:', selectedColor);

        window.removeEventListener('keydown', handleKeyDown);
        buttonText.off('pointerdown', startGame);

        if (pickr) {
            pickr.destroyAndRemove();
            pickr = null;
        }

        import('./gameScene.js')
            .then(({ createGameScene }) => {
                createGameScene(app,
                    () => showEndScene(app, '🏆 Victory! Press SPACE to restart'),
                    () => showEndScene(app, '💀 Game Over. Press SPACE to try again'),
                    parseInt(selectedColor.replace('#', '0x'), 16)
                );
            })
            .catch(err => {
                console.error('[Error] Failed to load gameScene:', err);
            });
        hideColorPickerUI();
    };

    const handleKeyDown = (e) => {
        if (e.code === 'Space') {
            console.log('[Input] Space pressed');
            e.preventDefault();
            startGame();
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    buttonText.on('pointerdown', startGame);

    app.view.tabIndex = 1;
    app.view.focus();
    app.view.style.outline = 'none';

    initColorPicker();
}

function showEndScene(app, message) {
    console.log('[Scene] Showing end screen:', message);
    app.stage.removeChildren();

    const bg = createGradientBackground(app);
    app.stage.addChild(bg);

    const textStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center'
    });

    const text = new PIXI.Text(message, textStyle);
    text.anchor.set(0.5);
    text.position.set(app.screen.width / 2, app.screen.height / 2 - 40);
    app.stage.addChild(text);

    const bestScore = localStorage.getItem('bestScore') || 0;
    const currentScore = localStorage.getItem('lastScore') || 0;

    const scoreText = new PIXI.Text(`🎯 Score: ${currentScore} 🏆 Best: ${bestScore}`, new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 28,
        fill: '#ffff00',
        stroke: '#000000',
        strokeThickness: 3
    }));
    scoreText.anchor.set(0.5);
    scoreText.position.set(app.screen.width / 2, app.screen.height / 2 + 20);
    app.stage.addChild(scoreText);

    const spaceHandler = (e) => {
        if (e.code === 'Space') {
            console.log('[Input] Restart via space');
            window.removeEventListener('keydown', spaceHandler);
            import('./startScene.js').then(({ createStartScene }) => createStartScene(app));
        }
    };

    window.addEventListener('keydown', spaceHandler);
    hideColorPickerUI();
}

function initColorPicker() {
    const container = document.getElementById('color-picker-container');
    if (!container || window.Pickr === undefined) {
        console.warn('[UI] Pickr not available');
        return;
    }

    container.innerHTML = '';

    // 👉 Оборачиваем всё в отдельный блок
    const wrapper = document.createElement('div');
    wrapper.id = 'color-picker-ui';

    const label = document.createElement('p');
    label.textContent = 'You can change your icon color here';
    wrapper.appendChild(label);

    const button = document.createElement('button');
    button.id = 'pickr-button';
    button.textContent = '🎨 Select Color';
    button.style.width = '160px';
    button.style.height = '40px';
    button.style.marginBottom = '10px';
    wrapper.appendChild(button);

    container.appendChild(wrapper);

    pickr = window.Pickr.create({
        el: '#pickr-button',
        theme: 'monolith',
        default: selectedColor,
        swatches: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
        components: {
            preview: true,
            opacity: false,
            hue: true,
            interaction: { input: true, save: true }
        }
    });

    pickr.on('save', (color) => {
        if (color) {
            selectedColor = color.toHEXA().toString();
            console.log('[UI] Color selected:', selectedColor);
            pickr.hide();
        }
    });
}


function createGradientBackground(app) {
    const canvas = document.createElement('canvas');
    canvas.width = app.screen.width;
    canvas.height = app.screen.height;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, app.screen.width, app.screen.height);
    gradient.addColorStop(0, '#4e54c8');
    gradient.addColorStop(1, '#8f94fb');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = PIXI.Texture.from(canvas);
    return new PIXI.Sprite(texture);
}

function showColorPickerUI() {
    const pickerUI = document.getElementById('color-picker-ui');
    if (pickerUI) pickerUI.style.display = 'block';
}

function hideColorPickerUI() {
    const pickerUI = document.getElementById('color-picker-ui');
    if (pickerUI) pickerUI.style.display = 'none';
}

setTimeout(showColorPickerUI, 100);