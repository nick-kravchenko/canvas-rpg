// @ts-expect-error @typescript-eslint/cannot-find-module
import groundImagePng from '../../images/ground2.png';
import { getPixelCoordsByCellNumber } from '../utils';
import { CELL_STATE } from '../enums/cell-state.enum';
import { getNeighborsAsObject } from '../utils/get-neighbors';
import { gameState } from '../game-state';

const groundImage = new Image();
groundImage.src = groundImagePng;

export function drawGround(cellNumber: number) {
  const {
    ctx,
    cells,
    cellSize,
  } = gameState;

  const [dx, dy]: [number, number] = getPixelCoordsByCellNumber(cellNumber);
  const neighbors: { [key: string]: number } = getNeighborsAsObject(cellNumber, true);
  function isBlocked(cellNumber: number): boolean {
    return cells[cellNumber] === CELL_STATE.BLOCKED;
  }
  if (!isBlocked(cellNumber) && Object.values(neighbors).every(neighbor => cells[neighbor] !== CELL_STATE.BLOCKED)) {
    ctx.drawImage(groundImage, 0, cellSize, cellSize, cellSize, dx, dy, cellSize, cellSize);
    return;
  } else if (isBlocked(cellNumber)) {
    ctx.drawImage(groundImage, cellSize, cellSize, cellSize, cellSize, dx, dy, cellSize, cellSize);
    return;
  }

  // cell center
  if (!isBlocked(cellNumber)) {
    ctx.drawImage(groundImage, cellSize * .25, cellSize * .25, cellSize * .5, cellSize * .5, dx + cellSize * .25, dy + cellSize * .25, cellSize * .5, cellSize * .5);
  }

  // sides (with blocked neighbors)
  if (isBlocked(neighbors.top)) {
    ctx.drawImage(groundImage, cellSize * .25, 0, cellSize * .5, cellSize * .25, dx + cellSize * .25, dy, cellSize * .5, cellSize * .25);
  }
  if (isBlocked(neighbors.bottom)) {
    ctx.drawImage(groundImage, cellSize * .25, cellSize * .75, cellSize * .5, cellSize * .25, dx + cellSize * .25, dy + cellSize * .75, cellSize * .5, cellSize * .25);
  }
  if (isBlocked(neighbors.left)) {
    ctx.drawImage(groundImage, 0, cellSize * .25, cellSize * .25, cellSize * .5, dx, dy + cellSize * .25, cellSize * .25, cellSize * .5);
  }
  if (isBlocked(neighbors.right)) {
    ctx.drawImage(groundImage, cellSize * .75, cellSize * .25, cellSize * .25, cellSize * .5, dx + cellSize * .75, dy + cellSize * .25, cellSize * .25, cellSize * .5);
  }

  // top corners
  if (isBlocked(neighbors.top) && isBlocked(neighbors.left)) {
    ctx.drawImage(groundImage, 0, 0, cellSize * .25, cellSize * .25, dx, dy, cellSize * .25, cellSize * .25);
  }
  if (isBlocked(neighbors.top) && isBlocked(neighbors.right)) {
    ctx.drawImage(groundImage, cellSize * .75, 0, cellSize * .25, cellSize * .25, dx + cellSize * .75, dy, cellSize * .25, cellSize * .25);
  }
  if (isBlocked(neighbors.top) && !isBlocked(neighbors.left)) {
    ctx.drawImage(groundImage, cellSize * .25, 0, cellSize * .25, cellSize * .25, dx, dy, cellSize * .25, cellSize * .25);
  }
  if (isBlocked(neighbors.top) && !isBlocked(neighbors.right)) {
    ctx.drawImage(groundImage, cellSize * .25, 0, cellSize * .25, cellSize * .25, dx + cellSize * .75, dy, cellSize * .25, cellSize * .25);
  }
  if (!isBlocked(neighbors.top) && isBlocked(neighbors.left)) {
    ctx.drawImage(groundImage, 0, cellSize * .25, cellSize * .25, cellSize * .25, dx, dy, cellSize * .25, cellSize * .25);
  }
  if (!isBlocked(neighbors.top) && isBlocked(neighbors.right)) {
    ctx.drawImage(groundImage, cellSize * .75, cellSize * .25, cellSize * .25, cellSize * .25, dx + cellSize * .75, dy, cellSize * .25, cellSize * .25);
  }
  if (!isBlocked(neighbors.top) && !isBlocked(neighbors.left) && isBlocked(neighbors.topLeft)) {
    ctx.drawImage(groundImage, cellSize * 1.75, cellSize * .75, cellSize * .25, cellSize * .25, dx, dy, cellSize * .25, cellSize * .25);
  }
  if (!isBlocked(neighbors.top) && !isBlocked(neighbors.right) && isBlocked(neighbors.topRight)) {
    ctx.drawImage(groundImage, cellSize, cellSize * .75, cellSize * .25, cellSize * .25, dx + cellSize * .75, dy, cellSize * .25, cellSize * .25);
  }
  if (!isBlocked(neighbors.top) && !isBlocked(neighbors.left) && !isBlocked(neighbors.topLeft)) {
    ctx.drawImage(groundImage, 0, cellSize, cellSize * .25, cellSize * .25, dx, dy, cellSize * .25, cellSize * .25);
  }
  if (!isBlocked(neighbors.top) && !isBlocked(neighbors.right) && !isBlocked(neighbors.topRight)) {
    ctx.drawImage(groundImage, cellSize * .75, cellSize, cellSize * .25, cellSize * .25, dx + cellSize * .75, dy, cellSize * .25, cellSize * .25);
  }

  // bottom corners
  if (isBlocked(neighbors.bottom) && isBlocked(neighbors.left)) {
    ctx.drawImage(groundImage, 0, cellSize * .75, cellSize * .25, cellSize * .25, dx, dy + cellSize * .75, cellSize * .25, cellSize * .25);
  }
  if (isBlocked(neighbors.bottom) && isBlocked(neighbors.right)) {
    ctx.drawImage(groundImage, cellSize * .75, cellSize * .75, cellSize * .25, cellSize * .25, dx + cellSize * .75, dy + cellSize * .75, cellSize * .25, cellSize * .25);
  }
  if (isBlocked(neighbors.bottom) && !isBlocked(neighbors.left)) {
    ctx.drawImage(groundImage, cellSize * .25, cellSize * .75, cellSize * .25, cellSize * .25, dx, dy + cellSize * .75, cellSize * .25, cellSize * .25);
  }
  if (isBlocked(neighbors.bottom) && !isBlocked(neighbors.right)) {
    ctx.drawImage(groundImage, cellSize * .25, cellSize * .75, cellSize * .25, cellSize * .25, dx + cellSize * .75, dy + cellSize * .75, cellSize * .25, cellSize * .25);
  }
  if (!isBlocked(neighbors.bottom) && isBlocked(neighbors.left)) {
    ctx.drawImage(groundImage, 0, cellSize * .25, cellSize * .25, cellSize * .25, dx, dy + cellSize * .75, cellSize * .25, cellSize * .25);
  }
  if (!isBlocked(neighbors.bottom) && isBlocked(neighbors.right)) {
    ctx.drawImage(groundImage, cellSize * .75, cellSize * .25, cellSize * .25, cellSize * .25, dx + cellSize * .75, dy + cellSize * .75, cellSize * .25, cellSize * .25);
  }
  if (!isBlocked(neighbors.bottom) && !isBlocked(neighbors.left) && isBlocked(neighbors.bottomLeft)) {
    ctx.drawImage(groundImage, cellSize * 1.75, 0, cellSize * .25, cellSize * .25, dx, dy + cellSize * .75, cellSize * .25, cellSize * .25);
  }
  if (!isBlocked(neighbors.bottom) && !isBlocked(neighbors.right) && isBlocked(neighbors.bottomRight)) {
    ctx.drawImage(groundImage, cellSize, 0, cellSize * .25, cellSize * .25, dx + cellSize * .75, dy + cellSize * .75, cellSize * .25, cellSize * .25);
  }
  if (!isBlocked(neighbors.bottom) && !isBlocked(neighbors.left) && !isBlocked(neighbors.bottomLeft)) {
    ctx.drawImage(groundImage, 0, cellSize * 1.75, cellSize * .25, cellSize * .25, dx, dy + cellSize * .75, cellSize * .25, cellSize * .25);
  }
  if (!isBlocked(neighbors.bottom) && !isBlocked(neighbors.right) && !isBlocked(neighbors.bottomRight)) {
    ctx.drawImage(groundImage, cellSize * .75, cellSize * 1.75, cellSize * .25, cellSize * .25, dx + cellSize * .75, dy + cellSize * .75, cellSize * .25, cellSize * .25);
  }

  // sides (with unblocked neighbors)
  if (!isBlocked(cellNumber) && !isBlocked(neighbors.top)) {
    ctx.drawImage(groundImage, cellSize * .25, cellSize, cellSize * .5, cellSize * .25, dx + cellSize * .25, dy, cellSize * .5, cellSize * .25);
  }
  if (!isBlocked(cellNumber) && !isBlocked(neighbors.bottom)) {
    ctx.drawImage(groundImage, cellSize * .25, cellSize * 1.75, cellSize * .5, cellSize * .25, dx + cellSize * .25, dy + cellSize * .75, cellSize * .5, cellSize * .25);
  }
  if (!isBlocked(cellNumber) && !isBlocked(neighbors.left)) {
    ctx.drawImage(groundImage, 0, cellSize * 1.25, cellSize * .25, cellSize * .5, dx, dy + cellSize * .25, cellSize * .25, cellSize * .5);
  }
  if (!isBlocked(cellNumber) && !isBlocked(neighbors.right)) {
    ctx.drawImage(groundImage, cellSize * .75, cellSize * 1.25, cellSize * .25, cellSize * .5, dx + cellSize * .75, dy + cellSize * .25, cellSize * .25, cellSize * .5);
  }
}
