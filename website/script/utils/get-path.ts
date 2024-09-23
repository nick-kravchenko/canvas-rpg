import { getNeighbors } from './get-neighbors';
import { CELL_STATE } from '../enums/cell-state.enum';
import { isCellVisited } from './get-is-cell-visited';
import { setCellVisited } from './set-cell-visited';
import { resetCells } from './reset-cells';

export function getPath(cells: Int8Array, cellsX: number, cellsY: number, paths: number[][], targetCell: number, depth?: number): any {
  return new Promise(async (resolve) => {
    if (typeof depth !== 'undefined' && depth <= 0) return resolve(paths);
    const extendedPaths: number[][] = paths.reduce((acc: number[][], path: number[]) => {
      const lastCell: number = path[path.length - 1];
      const neighbors: number[] = getNeighbors(cells, cellsX, cellsY, lastCell).filter((cell: number) => {
        return !isCellVisited(cells, cell)
          && cells[cell] !== CELL_STATE.START
          && cells[cell] !== CELL_STATE.BLOCKED;
      });
      if (!neighbors) return null;
      for (let i: number = 0; i < neighbors.length; i++) {
        setCellVisited(cells, neighbors[i]);
      }
      return [
        ...acc,
        ...neighbors.map((cell: number) => [...path, cell])
      ]
    }, []);
    const finishedPaths: number[][] = extendedPaths.filter((path: number[]) => path.some(cell => cell === targetCell));
    if (finishedPaths.length > 0) {
      resetCells(cells);
      return resolve(finishedPaths.sort((path1, path2) => path1.length - path2.length)[0]);
    }
    if (paths.every((path: number[]) => !path)) {
      return resolve(null);
    }
    return resolve(await getPath(cells, cellsX, cellsY, extendedPaths, targetCell, depth - 1));
  });
}
