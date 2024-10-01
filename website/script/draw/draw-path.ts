import { getPixelCoordsByCellNumber } from '../utils';
import { gameState } from '../game-state';

export function drawPath(path: number[]) {
  const {
    ctx,
    cellsX,
    cellSize,
  } = gameState;

  if (path.length > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, .7)';
    ctx.strokeStyle = 'rgba(255, 255, 255, .7)';
    ctx.lineWidth = cellSize / 8;
    path.forEach((cellNumber: number, index: number) => {
      let [x, y]: [number, number] = getPixelCoordsByCellNumber(cellNumber);
      x += cellSize / 2;
      y += cellSize / 2;
      const scale = path.length - 1 === index ? .25 : .125;
      ctx.roundRect(
        (x - (cellSize * scale)*.5),
        (y - (cellSize * scale)),
        (cellSize * scale),
        (cellSize * scale) * 2,
        2
      )
      ctx.roundRect(
        (x - (cellSize * scale)),
        (y - (cellSize * scale)*.52),
        (cellSize * scale) * 2,
        (cellSize * scale),
        2
      )
      ctx.roundRect(
        x - (cellSize * scale) * .75,
        y - (cellSize * scale) * .75,
        cellSize * (scale * 1.5),
        cellSize * (scale * 1.5),
        2
      )
    });
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}
