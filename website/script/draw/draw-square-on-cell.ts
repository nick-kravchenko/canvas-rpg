import { getPixelCoordsByCellNumber } from '../utils';

export function drawSquareOnCell(ctx: CanvasRenderingContext2D, cellNumber: number, cellsX: number, cellSize: number, color: string) {
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
