import { CELL_STATE } from '../enums/cell-state.enum';

export function isCellVisited(cells: Int8Array, cellNumber: number): boolean {
  return cells[cellNumber] === CELL_STATE.VISITED;
}
