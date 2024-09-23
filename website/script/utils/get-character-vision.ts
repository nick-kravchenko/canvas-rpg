import { CELL_STATE } from '../enums/cell-state.enum';

function isWithinBounds(cells: Int8Array, cellNumber: number): boolean {
  return cellNumber >= 0 && cellNumber < cells.length;
}

export function getCharacterVision(cells: Int8Array, cellsX: number, characterPosition: number, ) {
  const visible = [];
  let checking = characterPosition;
  while ((checking + 1) % cellsX !== 0 && isWithinBounds(cells, checking) && cells[checking] !== CELL_STATE.BLOCKED) {
    visible.push(checking);
    checking -= 1;
  }
  checking = characterPosition;
  while ((checking - 1) % cellsX !== cellsX - 1 && isWithinBounds(cells, checking) && cells[checking] !== CELL_STATE.BLOCKED) {
    visible.push(checking);
    checking += 1;
  }
  checking = characterPosition;
  while (checking >= 0 && isWithinBounds(cells, checking) && cells[checking] !== CELL_STATE.BLOCKED) {
    visible.push(checking);
    checking -= cellsX
  }
  checking = characterPosition;
  while (checking < cells.length && isWithinBounds(cells, checking) && cells[checking] !== CELL_STATE.BLOCKED) {
    visible.push(checking);
    checking += cellsX;
  }
  checking = characterPosition;
  while (checking % cellsX !== 0 && checking >= cellsX && isWithinBounds(cells, checking) && cells[checking] !== CELL_STATE.BLOCKED) {
    visible.push(checking);
    checking -= (cellsX + 1);
  }
  checking = characterPosition;
  while (checking % cellsX !== cellsX - 1 && checking >= cellsX && isWithinBounds(cells, checking) && cells[checking] !== CELL_STATE.BLOCKED) {
    visible.push(checking);
    checking -= (cellsX - 1);
  }
  checking = characterPosition;
  while (checking % cellsX !== 0 && checking + cellsX < cells.length && isWithinBounds(cells, checking) && cells[checking] !== CELL_STATE.BLOCKED) {
    visible.push(checking);
    checking += (cellsX - 1);
  }
  checking = characterPosition;
  while (checking % cellsX !== cellsX - 1 && checking + cellsX < cells.length && isWithinBounds(cells, checking) && cells[checking] !== CELL_STATE.BLOCKED) {
    visible.push(checking);
    checking += (cellsX + 1);
  }
  return visible;
}
