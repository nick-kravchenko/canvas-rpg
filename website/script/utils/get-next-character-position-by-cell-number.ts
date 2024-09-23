import { CELL_STATE } from '../enums/cell-state.enum';
import { DIRECTION } from '../enums/direction.enum';

export function getNextCharacterPositionByCellNumber(
  cells: Int8Array,
  cellsX: number,
  cellsY: number,
  path: number[],
  pressedKey: string,
  characterPosition: number,
  direction: DIRECTION
): number {
  if (path.length ) {
    return path[0];
  }
  if (pressedKey) {
    let neighbors: { [key: string]: number } = {};
    if (characterPosition >= cellsX) neighbors['top'] = (characterPosition - cellsX);
    if ((characterPosition + 1) % cellsX) neighbors['right'] = (characterPosition + 1);
    if (characterPosition % cellsX) neighbors['left'] = (characterPosition - 1);
    if (characterPosition < ((cellsX * cellsY) - cellsY)) neighbors['bottom'] = (characterPosition + cellsX);

    if (cells[neighbors.top] === CELL_STATE.BLOCKED) delete neighbors['top'];
    if (cells[neighbors.left] === CELL_STATE.BLOCKED) delete neighbors['left'];
    if (cells[neighbors.bottom] === CELL_STATE.BLOCKED) delete neighbors['bottom'];
    if (cells[neighbors.right] === CELL_STATE.BLOCKED) delete neighbors['right'];

    switch (direction) {
      case DIRECTION.UP:
        if (neighbors.top) return neighbors['top'];
        break;
      case DIRECTION.LEFT:
        if (neighbors.left) return neighbors['left'];
        break;
      case DIRECTION.DOWN:
        if (neighbors.bottom) return neighbors['bottom'];
        break;
      case DIRECTION.RIGHT:
        if (neighbors.right) return neighbors['right'];
        break;
    }
  }
  return characterPosition;
}
