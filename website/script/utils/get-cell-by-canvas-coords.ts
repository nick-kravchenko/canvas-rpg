export function getCellByCanvasCoords(x: number, y: number, cellSize: number, cellsX: number): number {
  return Math.floor(y / cellSize) * cellsX + Math.floor(x / cellSize);
}
