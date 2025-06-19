📁 /game-project
├── 📄 index.html          // HTML-обертка с двумя canvas: фоновый и Pixi
├── 📄 style.css           // Стили
├── 📄 main.js             // Инициализация Pixi и переключение сцен
├── 📁 canvas-background   // Фоновая логика (гравитационные шары)
│   └── background.js
├── 📁 scenes
│   ├── startScene.js      // Экран старта и выбор цвета
│   ├── gameScene.js       // Основная сцена игры
│   ├── winScene.js        // Экран победы
│   └── loseScene.js       // Экран поражения
├── 📁 objects
│   ├── player.js          // Игрок (квадрат), прыжок, вращение
│   └── obstacle.js        // Препятствия (шипы)
├── 📁 utils
│   ├── collision.js       // Проверка столкновений
│   ├── score.js           // Счёт и хранение в localStorage
│   └── constants.js       // Размеры, скорость, цвета и т.п.
└── 📁 lib
    └── pickr.min.js       // Color Picker