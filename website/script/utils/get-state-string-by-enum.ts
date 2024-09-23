import { CELL_STATE } from '../enums/cell-state.enum';

export function getStateStringByEnum(state: CELL_STATE): string {
  switch (state) {
    case CELL_STATE.START:
      return 'start';
    case CELL_STATE.FINISH:
      return 'finish';
    case CELL_STATE.BLOCKED:
      return 'blocked';
    case CELL_STATE.UNVISITED:
      return 'unvisited';
    case CELL_STATE.VISITED:
      return 'visited';
  }
}
