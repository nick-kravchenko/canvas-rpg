import { getNeighbors } from './get-neighbors';
import { CELL_STATE } from '../types/cell-state.enum';
import { gameState } from '../game-state';

function reconstructPath(startParents: Map<number, number>, endParents: Map<number, number>, meetingPoint: number) {
  const path: number[] = [];
  let current: number = meetingPoint;
  try {
    while (current !== -1) {
      path.unshift(current);
      current = startParents.get(current);
    }
    current = endParents.get(meetingPoint);
    while (current !== -1) {
      path.push(current);
      current = endParents.get(current);
    }
  } catch (e) {
    console.error(e);
  }
  return path;
}

export function getPath(start: number, end: number, blockedCells?: number[]): number[] {
  const {
    cells,
    cellsX,
    cellsY,
  } = gameState;

  const startQueue: number[] = [start];
  const startParents: Map<number, number> = new Map();
  startParents.set(start, -1);

  const endQueue: number[] = [end];
  const endParents: Map<number, number> = new Map();
  endParents.set(end, -1);

  while (startQueue.length > 0 && endQueue.length > 0) {
    const currentStartCell: number = startQueue.shift();
    const startNeighbors: number[] = getNeighbors(cellsX, cellsY, currentStartCell, 1);
    for (const neighbor of startNeighbors) {
      if (
        !startParents.has(neighbor)
        && cells[neighbor] !== CELL_STATE.BLOCKED
        && !blockedCells.includes(neighbor)
      ) {
        startQueue.push(neighbor);
        startParents.set(neighbor, currentStartCell);
      }

      if (endParents.has(neighbor)) {
        return reconstructPath(startParents, endParents, neighbor);
      }
    }

    const currentEndCell: number = endQueue.shift();
    const endNeighbors: number[] = getNeighbors(cellsX, cellsY, currentEndCell, 1);
    for (const neighbor of endNeighbors) {
      if (
        !endParents.has(neighbor)
        && cells[neighbor] !== CELL_STATE.BLOCKED
        && !blockedCells.includes(neighbor)
      ) {
        endQueue.push(neighbor);
        endParents.set(neighbor, currentEndCell);
      }

      if (startParents.has(neighbor)) {
        return reconstructPath(startParents, endParents, neighbor);
      }
    }
  }
}
