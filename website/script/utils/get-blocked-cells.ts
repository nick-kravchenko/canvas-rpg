import { CELL_STATE } from '../enums/cell-state.enum';

export function getBlockedCells(cells: Int8Array, blockedCells: number[]): Int8Array {
  return cells.map((cellState, i) => blockedCells.includes(i) ? CELL_STATE.BLOCKED : cellState);
}
