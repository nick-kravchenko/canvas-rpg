import { getNeighbors } from './get-neighbors';
import { CELL_STATE } from '../enums/cell-state.enum';
import { gameState } from '../game-state';

function reconstructPath(startParents: Map<number, number>, endParents: Map<number, number>, meetingPoint: number): Set<number> {
  let path: Set<number> = new Set();
  let current: number = meetingPoint;

  // Traverse the path from the meeting point to the start
  while (current !== -1) {
    path.add(current);
    current = startParents.get(current);
  }

  path = new Set(Array.from(path).reverse())

  // Traverse the path from the meeting point to the end
  current = endParents.get(meetingPoint);
  while (current !== -1) {
    path.add(current);
    current = endParents.get(current);
  }

  return path;
}


const blockedPixelsCache = new Set<number>();

export function isPixelBlocked(pixel: number, blockedCells: Set<number>): boolean {
  if (blockedPixelsCache.has(pixel)) {
    return true;
  }
  const { w, cellsX, cellSize }: { w: number, cells: Int8Array, cellsX: number, cellSize: number } = gameState;
  const pixelX: number = pixel % w;
  const pixelY: number = ~~(pixel / w);
  const radius: number = cellsX * .5;
  for (let blockedCell of blockedCells) {
    const cellX: number = blockedCell % cellsX;
    const cellY: number = ~~(blockedCell / cellsX);
    const cellXPX: number = (cellX * cellSize) + radius;
    const cellYPX: number = (cellY * cellSize) + radius;
    if (Math.hypot(pixelX - cellXPX, pixelY - cellYPX) < cellSize) {
      blockedPixelsCache.add(pixel);
      return true;
    }
  }
  return false;
}

export function getPathPx(start: number, end: number, speed: number, enemies?: Set<number>): Set<number> {
  const blockedCells: Set<number> = new Set(gameState.cells.reduce((acc: number[], cellState: CELL_STATE, cellNumber: number) => {
    return cellState === CELL_STATE.BLOCKED ? acc.concat([cellNumber]) : acc;
  }, []));

  const { w, h }: { w: number, h: number } = gameState;

  const startQueue: number[] = [start];
  const startParents: Map<number, number> = new Map();
  startParents.set(start, -1);

  const endQueue: number[] = [end];
  const endParents: Map<number, number> = new Map();
  endParents.set(end, -1);

  let neighborsCalculation = 0;
  while (startQueue.length > 0 && endQueue.length > 0) {
    const currentStartCell: number = startQueue.shift();

    const beginStartNeighborsCalculation = performance.now();
    const startNeighbors: number[] = getNeighbors(w, h, currentStartCell, speed);
    neighborsCalculation += performance.now() - beginStartNeighborsCalculation;

    for (let neighbor of startNeighbors) {
      if (!startParents.has(neighbor) && !isPixelBlocked(neighbor, blockedCells)) {
        startQueue.push(neighbor);
        startParents.set(neighbor, currentStartCell);
      }

      if (endParents.has(neighbor)) {
        const begin = performance.now();
        const path = reconstructPath(startParents, endParents, neighbor);
        gameState.debug = {
          'Path reconstruction took': `${((performance.now() - begin).toFixed(2))}ms`,
          'Neighbors calculation took': `${neighborsCalculation.toFixed(2)}ms`,
        }
        return path;
      }
    }

    const currentEndCell: number = endQueue.shift();

    const beginEntNeighborsCalculation = performance.now();
    const endNeighbors: number[] = getNeighbors(w, h, currentEndCell, speed);
    neighborsCalculation += performance.now() - beginEntNeighborsCalculation;

    for (let neighbor of endNeighbors) {
      if (!endParents.has(neighbor) && !isPixelBlocked(neighbor, blockedCells)) {
        endQueue.push(neighbor);
        endParents.set(neighbor, currentEndCell);
      }

      if (startParents.has(neighbor)) {
        const begin = performance.now();
        const path = reconstructPath(startParents, endParents, neighbor);
        gameState.debug = {
          'Path reconstruction took': `${((performance.now() - begin).toFixed(2))}ms`,
          'Neighbors calculation took': `${neighborsCalculation.toFixed(2)}ms`,
        }
        return path;
      }
    }
  }
}
