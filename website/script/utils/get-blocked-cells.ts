import { CELL_STATE } from '../types/cell-state.enum';

export function getBlockedCells(cells: Int8Array, blockedCells: Set<number>): Int8Array {
  return cells.map((cellState, i) => blockedCells.has(i) ? CELL_STATE.BLOCKED : cellState);
}
