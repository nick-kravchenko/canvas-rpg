import { DIRECTION } from '../enums/direction.enum';
import { getCharacterImageByDirection } from '../utils';
import { Npc } from '../types/npc';
import { Character } from '../types/character';
import { gameState } from '../game-state';

export function drawEnemy(
  enemy: Npc,
  player: Character,
  tick: number,
) {
  const {
    ctx,
    cellsX,
    cellSize,
  } = gameState;
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
  ctx.drawImage(
    getCharacterImageByDirection(enemy.direction),
    x + cellSize * .5 - getCharacterImageByDirection(enemy.direction).width * .5,
    y + cellSize * .5 - getCharacterImageByDirection(enemy.direction).height * .5,
    cellSize,
    cellSize,
  );
}
