import { gameState } from '../game-state';

/**
 * Returns the cell number based on the given pixel coordinates.
 *
 * @param {number} x - The x-coordinate of the pixel.
 * @param {number} y - The y-coordinate of the pixel.
 * @returns {number} The cell number.
 */
export function getCellNumberByPixelCoords(x: number, y: number): number {
  const {
    cellsX,
    cellSize,
  } = gameState;

  return Math.floor(y / cellSize) * cellsX + Math.floor(x / cellSize);
}
