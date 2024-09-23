export function getCanvasCoordsByCellNumber(cellNumber: number, cellsX: number, cellSize: number): [number, number] {
  const x: number = (cellNumber % cellsX) * cellSize;
  const y: number = (Math.floor(cellNumber / cellsX)) * cellSize;
  return [x, y];
}
