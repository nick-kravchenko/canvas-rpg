import { getCanvasCoordsByCellNumber } from '../utils';

export function drawTree(ctx: CanvasRenderingContext2D, treeImages: { [key: number]: HTMLImageElement }, cellNumber: number, cellsX: number, cellSize: number) {
  const [x, y]: [number, number] = getCanvasCoordsByCellNumber(cellNumber, cellsX, cellSize);
  const treeImage: HTMLImageElement = treeImages[cellNumber];
  ctx.save();
  ctx.drawImage(
    treeImage,
    x,
    y,
    cellSize,
    cellSize,
  );
  ctx.restore();
}
