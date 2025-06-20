let selectedColor = '#ff0000';
let pickr = null;

export function createStartScene(app) {
    console.log('[Scene] Start scene loaded');
    app.stage.removeChildren();

    const bg = new PIXI.Graphics()
        .beginFill(0x000000, 0.7)
        .drawRect(0, 0, app.screen.width, app.screen.height)
        .endFill();
    app.stage.addChild(bg);

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
    title.position.set(app.screen.width / 2, app.screen.height / 2 - 50);
    app.stage.addChild(title);

    const buttonText = new PIXI.Text('OR CLICK HERE', new PIXI.TextStyle({
        ...textStyle,
        fill: '#00ff00'
    }));
    buttonText.anchor.set(0.5);
    buttonText.position.set(app.screen.width / 2, app.screen.height / 2 + 50);
    buttonText.interactive = true;
    buttonText.buttonMode = true;
    app.stage.addChild(buttonText);

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
    text.position.set(app.screen.width / 2, app.screen.height / 2);
    app.stage.addChild(text);

    const spaceHandler = (e) => {
        if (e.code === 'Space') {
            console.log('[Input] Restart via space');
            window.removeEventListener('keydown', spaceHandler);
            import('./startScene.js').then(({ createStartScene }) => createStartScene(app));
        }
    };

    window.addEventListener('keydown', spaceHandler);
}

function initColorPicker() {
    const container = document.getElementById('color-picker-container');
    if (!container) return;

    container.innerHTML = '';
    console.log('[UI] Initializing Pickr');

    try {
        pickr = Pickr.create({
            el: '#color-picker-container',
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
    } catch (error) {
        console.error('[UI] Color picker error:', error);
    }
}
