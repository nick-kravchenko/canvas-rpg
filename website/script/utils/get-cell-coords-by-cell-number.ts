export function getCellCoordsByCellNumber(cellsX: number, cellNumber: number): [number, number] {
  return [
    Math.floor(cellNumber / cellsX),
    cellsX % cellNumber,
  ];
}
