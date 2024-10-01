// Interpolation function with corrected formula
import { CELL_STATE } from '../enums/cell-state.enum';
import { getCellCoordsByCellNumber } from './get-cell-coords-by-cell-number';

function interpolate(a0: number, a1: number, w: number) {
  return a0 + w * (a1 - a0);
}

// Random gradient generation with a more stable and diverse output
function randomGradient(ix: number, iy: number) {
  // Seed based on grid coordinates
  const seed = ix * 374761393 + iy * 668265263;  // Large prime numbers
  const random = ((Math.sin(seed) * 43758.5453) % 1);  // Generate pseudo-random number

  // Convert to 2D gradient vector
  const angle = random * Math.PI * 2;  // Angle in radians
  return {
    x: Math.cos(angle),
    y: Math.sin(angle)
  };
}

// Dot product of the distance vector and gradient
function dotGridGradient(ix: number, iy: number, x: number, y: number) {
  const gradient = randomGradient(ix, iy);  // Get the gradient at the grid point

  const dx = x - ix;  // Compute the distance from the point to the grid point
  const dy = y - iy;

  return (dx * gradient.x + dy * gradient.y);  // Return the dot product
}

// Main Perlin noise function
export function getPerlinNoise(x: number, y: number) {
  // Determine grid cell coordinates
  const x0 = Math.floor(x);
  const x1 = x0 + 1;
  const y0 = Math.floor(y);
  const y1 = y0 + 1;

  // Determine interpolation weights
  const sx = x - x0;  // Relative x position in grid cell
  const sy = y - y0;  // Relative y position in grid cell

  // Interpolate between grid point gradients
  let n0, n1, ix0, ix1, value;

  // Interpolate in x direction for top row (y0)
  n0 = dotGridGradient(x0, y0, x, y);
  n1 = dotGridGradient(x1, y0, x, y);
  ix0 = interpolate(n0, n1, sx);

  // Interpolate in x direction for bottom row (y1)
  n0 = dotGridGradient(x0, y1, x, y);
  n1 = dotGridGradient(x1, y1, x, y);
  ix1 = interpolate(n0, n1, sx);

  // Interpolate the results along the y axis
  value = interpolate(ix0, ix1, sy);

  return value;
}

// const noiseScale = .00000000005;
// const noiseThreshold = .015;
// const noiseRandomVariety = .017;
// // @ts-ignore
// const noise: number[] = Array.from(cells).map((cellState: CELL_STATE, index: number) => {
//   const [x, y]: [number, number] = getCellCoordsByCellNumber(cellsX);
//   // Adjust scaling factor and apply Perlin noise
//   return getPerlinNoise(x * noiseScale, y * noiseScale);  // Increased scaling factor
// })
//   .reduce((acc: number[], noiseValue: number, index: number) => {
//     const randomNoise = Math.random() * noiseRandomVariety;  // Random noise to break up patterns
//     // Adjust the threshold to fine-tune tree density
//     if (noiseValue + randomNoise > noiseThreshold && index !== character.position) {  // Increased threshold for more sparse trees
//       return [...acc, index];  // Add tree at this index
//     }
//     return acc;  // No tree at this index
//   }, []);
//
// // const treeCells = noise;
