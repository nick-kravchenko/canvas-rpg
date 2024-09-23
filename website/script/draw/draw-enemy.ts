import { DIRECTION } from '../enums/direction.enum';
import { getCharacterImageByDirection } from '../utils';
import { Character } from '../types/character';

export function drawEnemy(
  ctx: CanvasRenderingContext2D,
  cellsX: number,
  cellSize: number,
  tick: number,
  enemy: Character,
) {
  if (enemy.path.length) {
    if (enemy.path[0] + 1 === enemy.position) {
      enemy.direction = DIRECTION.LEFT;
    } else if (enemy.path[0] - 1 === enemy.position) {
      enemy.direction = DIRECTION.RIGHT;
    } else if (enemy.path[0] + cellsX === enemy.position) {
      enemy.direction = DIRECTION.UP;
    } else if (enemy.path[0] - cellsX === enemy.position) {
      enemy.direction = DIRECTION.DOWN;
    }
  }
  const [x, y]: [number, number] = enemy.positionPx;
  const ySkew: number = Math.sin(tick / 160) * 2;
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = 'rgba(0, 0, 0, .5)';
  ctx.ellipse(x + cellSize / 2, y + cellSize, (cellSize / 2) + ySkew, 8 + ySkew/4, 0, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.drawImage(
    getCharacterImageByDirection(enemy.direction),
    x,
    y + ySkew,
    cellSize,
    cellSize,
  );
  ctx.restore();
}
