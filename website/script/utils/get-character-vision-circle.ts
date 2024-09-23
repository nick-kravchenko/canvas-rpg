// Bresenham's Line Algorithm to trace a line between two points
import { CELL_STATE } from '../enums/cell-state.enum';

function bresenhamLine(x0: number, y0: number, x1: number, y1: number): { x: number, y: number }[] {
  let points = [];
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let sx = (x0 < x1) ? 1 : -1;
  let sy = (y0 < y1) ? 1 : -1;
  let err = dx - dy;

  while (true) {
    points.push({ x: x0, y: y0 });  // Add the current point
    if (x0 === x1 && y0 === y1) break;  // Stop when the end point is reached
    let e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 < dx) { err += dx; y0 += sy; }
  }
  return points;
}

export function getCharacterVisionCircle(
  characterPosition: number,
  cells: Int8Array,
  cellsX: number,
  visionRadius: number
): number[] {
  let visibleCells: number[] = [];

  // Helper function to calculate the 2D distance between two cells
  function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  // Helper function to convert 1D index to 2D coordinates
  function indexToCoordinates(index: number): { x: number; y: number } {
    const x = index % cellsX;
    const y = Math.floor(index / cellsX);
    return { x, y };
  }

  // Convert character position to 2D coordinates
  const { x: charX, y: charY } = indexToCoordinates(characterPosition);

  // Iterate through every cell in the grid
  for (let i = 0; i < cells.length; i++) {
    const { x: cellX, y: cellY } = indexToCoordinates(i);

    // Calculate the distance from the character's position to the current cell
    const distance = calculateDistance(charX, charY, cellX, cellY);

    // Check if the cell is within the vision radius
    if (distance <= visionRadius) {
      // Use Bresenham's Line Algorithm to trace a line from the character to the target cell
      const line = bresenhamLine(charX, charY, cellX, cellY);

      let blocked = false;
      for (const point of line) {
        const cellIndex = point.y * cellsX + point.x;

        if (cells[cellIndex] === CELL_STATE.BLOCKED) {
          blocked = true;
          break;  // Stop if the line is blocked by a tree
        }
      }

      if (!blocked) {
        visibleCells.push(i);  // Only add the cell if no trees block the line of sight
      }
    }
  }

  return visibleCells;
}

export function getCharacterVisionCircleTrees(
  characterPosition: number,
  cellsX: number,
  visionRadius: number,
  trees: number[],
): number[] {
  let visibleCells: number[] = [];

  // Helper function to calculate the 2D distance between two cells
  function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  // Helper function to convert 1D index to 2D coordinates
  function indexToCoordinates(index: number): { x: number; y: number } {
    const x = index % cellsX;
    const y = Math.floor(index / cellsX);
    return { x, y };
  }

  // Convert character position to 2D coordinates
  const { x: charX, y: charY } = indexToCoordinates(characterPosition);

  // Check each tree to see if it's within the vision radius
  for (let i = 0; i < trees.length; i++) {
    const treeIndex = trees[i];
    const { x: treeX, y: treeY } = indexToCoordinates(treeIndex);

    // Calculate the distance from the character to the tree
    const distance = calculateDistance(charX, charY, treeX, treeY);

    // If the tree is within the vision radius, add it to the visible cells array
    if (distance <= visionRadius) {
      visibleCells.push(treeIndex);
    }
  }

  // Add other logic here to calculate visibility in all directions (left, right, up, down, etc.)

  return visibleCells;
}
