import { getCanvasCoordsByCellNumber } from '../utils';

export function drawDebugGrid(ctx: CanvasRenderingContext2D,cells: Int8Array, cellsX: number, cellSize: number) {
  cells.forEach((_: number, cellNumber: number) => {
    const [x, y]: [number, number] = getCanvasCoordsByCellNumber(cellNumber, cellsX, cellSize);
    ctx.save();
    ctx.strokeStyle = '#fff';
    let path2D: Path2D = new Path2D();
    path2D.rect(x, y, cellSize, cellSize);
    ctx.stroke(path2D);
    ctx.restore();

    ctx.save();
    ctx.font = `normal ${cellSize / 3}px/${cellSize / 3}px "Tiny5", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.fillText(`${cellNumber}`, x + cellSize / 2, y + cellSize / 2, cellSize)
    ctx.restore();
  });
}
