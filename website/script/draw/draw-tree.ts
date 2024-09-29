import { getCanvasCoordsByCellNumber } from '../utils';

export function drawTree(ctx: CanvasRenderingContext2D, treeImages: { [key: number]: HTMLImageElement }, cellNumber: number, cellsX: number, cellSize: number) {
  const [x, y]: [number, number] = getCanvasCoordsByCellNumber(cellNumber, cellsX, cellSize);
  const treeImage: HTMLImageElement = treeImages[cellNumber];
  ctx.save();
  ctx.drawImage(
    treeImage,
    x + (cellSize / 2) - (treeImage.width / 2),
    y + (cellSize / 2) - (treeImage.height / 2),
    treeImage.width,
    treeImage.height,
  );
  ctx.restore();
}
