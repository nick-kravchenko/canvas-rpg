import { CELL_STATE } from '../enums/cell-state.enum';
import { DIRECTION } from '../enums/direction.enum';
import { gameState } from '../game-state';
import { Character } from '../types/character';

export function getNextCharacterPositionByCellNumber(character: Character, pressedKey: string): number {
  const {
    cells,
    cellsX,
    cellsY,
  } = gameState;
  const {
    path,
    position,
    direction,
  } = character;

  if (path.length ) {
    return path[0];
  }
  if (pressedKey) {
    let neighbors: { [key: string]: number } = {};
    if (position >= cellsX) neighbors['top'] = (position - cellsX);
    if ((position + 1) % cellsX) neighbors['right'] = (position + 1);
    if (position % cellsX) neighbors['left'] = (position - 1);
    if (position < ((cellsX * cellsY) - cellsY)) neighbors['bottom'] = (position + cellsX);

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
  return position;
}
