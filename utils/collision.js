export function checkCollision(player, obstacle) {
  if (!player || !obstacle) return false;
  if (!player.x || !player.width || !obstacle.x || !obstacle.width) return false;

  return (
    player.x - player.width / 2 < obstacle.x + obstacle.width &&
    player.x + player.width / 2 > obstacle.x &&
    player.y - player.height / 2 < obstacle.y + obstacle.height &&
    player.y + player.height / 2 > obstacle.y
  );
}
