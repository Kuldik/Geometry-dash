export const OBSTACLE_SPEED = 5;
export function getRandomObstacleInterval() {
    return Math.floor(Math.random() * (2000 - 900 + 1)) + 900;
}
export const WIN_SCORE = 15;

export const GROUND_SEGMENT_WIDTH = 80;
export const GROUND_BASE_Y = 550;
export const GROUND_VARIATION = 20;