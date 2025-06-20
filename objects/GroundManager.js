import { GROUND_SEGMENT_WIDTH, GROUND_BASE_Y, GROUND_VARIATION } from '../utils/constants.js';

export class GroundManager {
    constructor(app) {
        this.app = app;
        this.container = new PIXI.Container();
        this.segments = [];
        this.lastY = GROUND_BASE_Y;
        this.speed = 4;

        app.stage.addChild(this.container);
        this.generateInitialSegments();
    }

    generateInitialSegments() {
        const count = Math.ceil(this.app.screen.width / GROUND_SEGMENT_WIDTH) + 2;
        for (let i = 0; i < count; i++) {
            this.addSegment(i * GROUND_SEGMENT_WIDTH);
        }
    }

    addSegment(x) {
        const delta = Math.floor(Math.random() * 3 - 1) * GROUND_VARIATION;
        const newY = Math.max(200, Math.min(this.app.screen.height - 50, this.lastY + delta));
        this.lastY = newY;

        const seg = new PIXI.Graphics();
        seg.beginFill(0xAAAAAA);
        seg.drawRect(0, 0, GROUND_SEGMENT_WIDTH, this.app.screen.height - newY);
        seg.endFill();
        seg.x = x;
        seg.y = newY;

        this.container.addChild(seg);
        this.segments.push(seg);
    }

    update() {
        let lastSegment = this.segments[this.segments.length - 1];

        this.segments.forEach(seg => seg.x -= this.speed);

        this.segments = this.segments.filter(seg => {
            if (seg.x + GROUND_SEGMENT_WIDTH < 0) {
                this.container.removeChild(seg);
                return false;
            }
            return true;
        });

        if (lastSegment && lastSegment.x + GROUND_SEGMENT_WIDTH <= this.app.screen.width) {
            this.addSegment(lastSegment.x + GROUND_SEGMENT_WIDTH);
        }
    }

    getGroundYAt(x) {
        for (let seg of this.segments) {
            if (x >= seg.x && x < seg.x + GROUND_SEGMENT_WIDTH) {
                return seg.y;
            }
        }
        return GROUND_BASE_Y;
    }

    destroy() {
        this.segments.forEach(seg => seg.destroy());
        this.container.destroy({ children: true });
    }
}