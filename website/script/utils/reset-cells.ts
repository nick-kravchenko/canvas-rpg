import { CELL_STATE } from '../enums/cell-state.enum';

export function resetCells(cells: Int8Array) {
  cells.forEach((cellState: CELL_STATE, i: number) => {
    switch (cellState) {
      case CELL_STATE.START:
      case CELL_STATE.FINISH:
      case CELL_STATE.VISITED:
      case CELL_STATE.UNVISITED:
        cells[i] = CELL_STATE.UNVISITED;
        break;
      case CELL_STATE.BLOCKED:
        cells[i] = CELL_STATE.BLOCKED;
        break;
    }
  })
}
