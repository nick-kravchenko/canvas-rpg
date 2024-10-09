import { CellStateEnum } from '../types/cell-state.enum';

export function getStateStringByEnum(state: CellStateEnum): string {
  switch (state) {
    case CellStateEnum.START:
      return 'start';
    case CellStateEnum.FINISH:
      return 'finish';
    case CellStateEnum.BLOCKED:
      return 'blocked';
    case CellStateEnum.UNVISITED:
      return 'unvisited';
    case CellStateEnum.VISITED:
      return 'visited';
  }
}
