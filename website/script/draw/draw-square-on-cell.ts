import { getPixelCoordsByCellNumber } from '../utils';
import { gameState } from '../game-state';

export function drawSquareOnCell(cellNumber: number, color: string) {
  const {
    ctx,
    cellSize,
  } = gameState;

  ctx.save();
  ctx.fillStyle = color;
  const [x, y] = getPixelCoordsByCellNumber(cellNumber);
  const path2D: Path2D = new Path2D();
  path2D.rect(
    x + cellSize * .125,
    y + cellSize * .125,
    cellSize * .75,
    cellSize * .75,
  );
  ctx.fill(path2D);
  ctx.restore();
}
