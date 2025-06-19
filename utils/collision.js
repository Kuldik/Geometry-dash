// utils/collision.js

export function checkCollision(player, obstacle) {
  const a = player.sprite;
  const b = obstacle.sprite;

  return (
    a.x - a.width / 2 < b.x + b.width &&
    a.x + a.width / 2 > b.x &&
    a.y - a.height / 2 < b.y + b.height &&
    a.y + a.height / 2 > b.y
  );
}
