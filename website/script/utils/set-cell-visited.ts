import { CELL_STATE } from '../enums/cell-state.enum';

export function setCellVisited(cells: Int8Array, cellNumber: number) {
  cells[cellNumber] = cells[cellNumber] === CELL_STATE.UNVISITED ? CELL_STATE.VISITED : cells[cellNumber];
}
