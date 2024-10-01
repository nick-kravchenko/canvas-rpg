import { gameState } from '../game-state';

/**
 * Returns the coordinates of a cell given its cell number.
 *
 * @param {number} cellNumber - The number of the cell.
 *
 * @return {[number, number]} The coordinates of the cell in the form of [x, y].
 *   The x-coordinate represents the column number
 *   and the y-coordinate represents the row number.
 */
export function getCellCoordsByCellNumber(cellNumber: number): [number, number] {
  const {
    cellsX,
  } = gameState;

  return [
    Math.floor(cellNumber / cellsX),
    cellsX % cellNumber,
  ];
}
