export function getDistanceInCells(cellsX: number, position1: number, position2: number) {
  const dx: number = Math.abs(Math.floor(position1 / cellsX) - Math.floor(position2 / cellsX));
  const dy: number = Math.abs(Math.floor(position1 % cellsX) - Math.floor(position2 % cellsX));
  return Math.round(Math.hypot(dx, dy));
}
