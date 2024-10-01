import { gameState } from '../game-state';

/**
 * Returns the top-left pixel coordinates of the cell corresponding to a given cell number.
 *
 * @param {number} cellNumber - The cell number for which to obtain pixel coordinates.
 * @return {[number, number]} - An array representing the pixel coordinates as [x, y].
 */
export function getPixelCoordsByCellNumber(cellNumber: number): [number, number] {
  const {
    cellsX,
    cellSize,
  } = gameState;

  const x: number = (cellNumber % cellsX) * cellSize;
  const y: number = (Math.floor(cellNumber / cellsX)) * cellSize;
  return [x, y];
}
