import { getCanvasCoordsByCellNumber } from '../utils';

export function drawPointer(ctx: CanvasRenderingContext2D, cellNumber: number, cellsX: number, cellSize: number, tick: number) {
  if (typeof cellNumber === 'number') {
    const [x, y]: [number, number] = getCanvasCoordsByCellNumber(cellNumber, cellsX, cellSize);
    ctx.save();
    ctx.beginPath();
    // TOP LEFT
    ctx.moveTo(x, y + cellSize * .25);
    ctx.lineTo(x, y);
    ctx.lineTo(x + cellSize * .25, y);
    ctx.moveTo(x, y + cellSize * .25);
    // TOP RIGHT
    ctx.moveTo(x + cellSize, y + cellSize * .25);
    ctx.lineTo(x + cellSize, y);
    ctx.lineTo((x + cellSize) - (cellSize * .25), y);
    ctx.moveTo(x + cellSize, y + cellSize * .25);
    // BOTTOM LEFT
    ctx.moveTo(x, (y + cellSize) - (cellSize * .25));
    ctx.lineTo(x, y + cellSize);
    ctx.lineTo(x + cellSize * .25, y + cellSize);
    ctx.moveTo(x, (y + cellSize) - (cellSize * .25));
    // BOTTOM RIGHT
    ctx.moveTo(x + cellSize, (y + cellSize) - (cellSize * .25));
    ctx.lineTo(x + cellSize, y + cellSize);
    ctx.lineTo((x + cellSize) - (cellSize * .25), y + cellSize);
    ctx.moveTo(x + cellSize, (y + cellSize) - (cellSize * .25));
    ctx.closePath();
    ctx.lineCap = "round";
    const scale = Math.sin(tick / 128);
    ctx.lineWidth = 4 * (scale > .5 ? scale : .5);
    ctx.strokeStyle = `rgba(255, 255, 255, .5)`;
    ctx.stroke();
    ctx.restore();
  }
}
