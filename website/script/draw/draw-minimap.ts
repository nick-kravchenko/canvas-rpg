import { Character } from '../types/character';
import { CELL_STATE } from '../enums/cell-state.enum';

export function drawMinimap(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cells: Int8Array,
  cellsX: number,
  cellsY: number,
  cameraDistance: number,
  translateX: number,
  translateY: number,
  character: Character,
) {
  const scale = .1;
  const x: number = (w - w * scale) - 4;
  const y: number = (0) + 4;
  const width: number = w * scale;
  const height: number = h * scale;

  ctx.save();
  ctx.strokeStyle = '#6a2600';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.strokeRect(
    x,
    y,
    width,
    height,
  );
  ctx.restore();

  for (let cellNumber = 0; cellNumber < cells.length; cellNumber++) {
    ctx.save();
    const offsetX = cellNumber % cellsX;
    const offsetY = Math.floor(cellNumber / cellsX);
    if (!character.explored.includes(cellNumber)) {
      ctx.fillStyle = '#000';
    } else if (cellNumber === character.position) {
      ctx.fillStyle = '#fff';
    } else if (cells[cellNumber] === CELL_STATE.BLOCKED) {
      ctx.fillStyle = '#673600';
    } else {
      ctx.fillStyle = '#595';
    }
    ctx.fillRect(
      x + (width * offsetX / cellsX),
      y + (height * offsetY / cellsY),
      (width / cellsX) + 1,
      (height / cellsY) + 1,
    );
    ctx.restore();
  }

  ctx.save();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeRect(
    x - translateX * scale * cameraDistance,
    y - translateY * scale * cameraDistance,
    width * cameraDistance,
    height * cameraDistance,
  );
  ctx.restore();
}
