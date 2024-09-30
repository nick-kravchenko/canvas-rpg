import { DIRECTION } from '../enums/direction.enum';
import { getCanvasCoordsByCellNumber, getCharacterImageByDirection } from '../utils';
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
  ctx.drawImage(
    getCharacterImageByDirection(character.direction),
    x + cellSize * .5 - getCharacterImageByDirection(character.direction).width * .5,
    y + cellSize * .5 - getCharacterImageByDirection(character.direction).height * .5,
    cellSize,
    cellSize,
  );

  // ctx.save();
  // character.explored.forEach((cellNumber: number) => {
  //   const [x, y]: [number, number] = getCanvasCoordsByCellNumber(cellNumber, cellsX, cellSize);
  //   ctx.lineWidth = cellSize * .05125;
  //   ctx.strokeStyle = '#f0f';
  //   ctx.strokeRect(x, y, cellSize, cellSize);
  // });
  // character.visible.forEach((cellNumber: number) => {
  //   const [x, y]: [number, number] = getCanvasCoordsByCellNumber(cellNumber, cellsX, cellSize);
  //   ctx.lineWidth = cellSize * .125;
  //   ctx.strokeStyle = '#0af';
  //   ctx.strokeRect(x, y, cellSize, cellSize);
  // });
  // ctx.restore();
}
