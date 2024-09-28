import { DIRECTION } from '../enums/direction.enum';
import { getCharacterImageByDirection } from '../utils';
import { Character } from '../types/character';

export function drawCharacter(
  ctx: CanvasRenderingContext2D,
  cellsX: number,
  cellSize: number,
  tick: number,
  character: Character,
) {
  if (character.path.length) {
    if (character.path[0] + 1 === character.position) {
      character.direction = DIRECTION.LEFT;
    } else if (character.path[0] - 1 === character.position) {
      character.direction = DIRECTION.RIGHT;
    } else if (character.path[0] + cellsX === character.position) {
      character.direction = DIRECTION.UP;
    } else if (character.path[0] - cellsX === character.position) {
      character.direction = DIRECTION.DOWN;
    }
  }
  const [x, y]: [number, number] = character.positionPx;
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = 'rgba(0, 0, 0, .5)';
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.filter = 'brightness(2.4)';
  ctx.drawImage(
    getCharacterImageByDirection(character.direction),
    x,
    y,
    cellSize,
    cellSize,
  );
  ctx.restore();
}
