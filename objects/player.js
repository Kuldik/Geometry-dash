export class Player {
    constructor(app) {
        this.app = app;

        const texture = PIXI.Texture.from('img/dash.png');
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.width = 60;
        this.sprite.height = 60;

        this.sprite.x = 100;
        this.sprite.y = app.screen.height - 100;
        this.app.stage.addChild(this.sprite);

        this.velocityY = 0;
        this.gravity = 0.5;
        this.jumpForce = -10;
        this.isJumping = false;
        this.rotationAngle = 0;

        this.jumpSound = new Audio('sounds/mario-jump.mp3');
    }

    jump(isSpaceHeld) {
        if (!this.isJumping) {
            const force = isSpaceHeld ? this.jumpForce * 1.5 : this.jumpForce;
            this.velocityY = force;
            this.isJumping = true;

            this.rotationAngle += Math.PI / 2;
            gsap.to(this.sprite, {
                rotation: this.rotationAngle,
                duration: 0.3,
                ease: "power1.out"
            });

            this.jumpSound.currentTime = 0;
            this.jumpSound.volume = 0.1;
            this.jumpSound.play();
        }

        if (!this.isJumping && this.sprite && !this.sprite.destroyed) {
            const force = isSpaceHeld ? this.jumpForce * 1.5 : this.jumpForce;
            this.velocityY = force;
            this.isJumping = true;

            this.rotationAngle += Math.PI / 2;
            gsap.to(this.sprite, {
                rotation: this.rotationAngle,
                duration: 0.3,
                ease: "power1.out"
            });
        }
    }

    update(groundManager) {
        this.velocityY += this.gravity;
        this.sprite.y += this.velocityY;

        const groundY = groundManager.getGroundY(this.sprite.x);
        const bottomY = this.sprite.y + this.sprite.height / 2;

        if (bottomY >= groundY) {
            this.sprite.y = groundY - this.sprite.height / 2 - 2; // слегка приподнят
            this.velocityY = 0;
            this.isJumping = false;
        }
    }
}
