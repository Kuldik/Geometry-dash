export class Score {
    constructor() {
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
    }

    add() {
        this.score++;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
        }
    }

    get current() {
        return this.score;
    }

    reset() {
        this.score = 0;
    }
}