// utils/score.js

export class Score {
  constructor() {
    this.score = 0;
    this.best = parseInt(localStorage.getItem('best-score')) || 0;
  }

  add() {
    this.score++;
    if (this.score > this.best) {
      this.best = this.score;
      localStorage.setItem('best-score', this.best);
    }
  }

  reset() {
    this.score = 0;
  }

  get current() {
    return this.score;
  }

  get high() {
    return this.best;
  }
}
