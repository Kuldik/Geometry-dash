import { GROUND_SEGMENT_WIDTH, GROUND_BASE_Y, GROUND_VARIATION } from '../utils/constants.js';

export class GroundManager {
    constructor(app) {
        this.app = app;
        this.container = new PIXI.Container();
        this.segments = [];
        this.lastY = GROUND_BASE_Y;
        this.speed = 5;

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
        const change = Math.random() < 0.3 ? (Math.random() < 0.5 ? -1 : 1) : 0;
        const delta = change * GROUND_VARIATION;

        const maxGroundTop = this.app.screen.height * 0.6; // земля не выше 60% высоты (то есть нижние 40%)
        const minGroundTop = this.app.screen.height - 50;  // минимум 50px высоты

        // первый сегмент — в самом низу
        if (this.segments.length === 0) {
            this.lastY = this.app.screen.height;
        }

        const proposedY = this.lastY + delta;
        const newY = Math.max(maxGroundTop, Math.min(minGroundTop, proposedY));
        this.lastY = newY;

        const seg = new PIXI.Graphics();
        seg.beginFill(0x4b629c);
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
                seg.destroy();
                return false;
            }
            return true;
        });

        if (lastSegment && lastSegment.x + GROUND_SEGMENT_WIDTH <= this.app.screen.width) {
            this.addSegment(lastSegment.x + GROUND_SEGMENT_WIDTH);
        }
    }

    getGroundY(x) {
        for (let seg of this.segments) {
            if (x >= seg.x && x < seg.x + GROUND_SEGMENT_WIDTH) {
                return seg.y;
            }
        }
        return GROUND_BASE_Y;
    }

    getGroundYAt(x) {
        return this.getGroundY(x);
    }

    destroy() {
        this.segments.forEach(seg => seg.destroy());
        this.container.destroy({ children: true });
    }
}
