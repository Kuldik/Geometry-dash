document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('background-canvas');
    if (!canvas) {
        console.error('Background canvas not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context');
        return;
    }

    // Подстраиваем размер canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Настройки физики
    const gravity = 0.2;
    const friction = 0.9;

    function randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const colors = ['#EA7D61', '#F2D194', '#734E40', '#A67951'];

    class Ball {
        constructor(x, y, dx, dy, radius, color) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.radius = radius;
            this.color = color;
        }

        update() {
            if (this.y + this.radius + this.dy > canvas.height) {
                this.dy = -this.dy * friction;
            } else {
                this.dy += gravity;
            }

            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.dx = -this.dx;
            }

            this.x += this.dx;
            this.y += this.dy;
            this.draw();
        }

        draw() {
            ctx.beginPath();
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 20;
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 3);
            ctx.fill();
            ctx.closePath();
        }
    }

    // Инициализация шаров
    const balls = [];
    for (let i = 0; i < 60; i++) {
        const radius = randomRange(5, 20);
        const x = randomRange(radius, canvas.width - radius);
        const y = randomRange(radius, canvas.height - radius);
        const dx = randomRange(-1.5, 1.5);
        const dy = randomRange(-1.5, 1.5);
        const color = colors[Math.floor(Math.random() * colors.length)];
        balls.push(new Ball(x, y, dx, dy, radius, color));
    }

    // Анимация
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        balls.forEach(ball => ball.update());
    }

    animate();
});