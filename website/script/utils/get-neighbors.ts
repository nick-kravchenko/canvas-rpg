export function getNeighbors(cells: Int8Array, cellsX: number, cellsY: number, cellNumber: number, diagonal: boolean = false): number[] {
  const neighbors: number[] = [];
  // top cell
  if (cellNumber >= cellsX) neighbors.push(cellNumber - cellsX);
  // right cell
  if ((cellNumber + 1) % cellsX) neighbors.push(cellNumber + 1);
  // left cell
  if (cellNumber % cellsX) neighbors.push(cellNumber - 1);
  // bottom cell
  if (cellNumber < ((cellsX * cellsY) - cellsY)) neighbors.push(cellNumber + cellsX);

  if (diagonal) {
    // top-left
    if ((cellNumber >= cellsX) && (cellNumber % cellsX)) neighbors.push(cellNumber - cellsX - 1);
    // top-right
    if ((cellNumber >= cellsX) && (cellNumber + 1) % cellsX) neighbors.push(cellNumber - cellsX + 1);
    // bottom-left
    if ((cellNumber < ((cellsX * cellsY) - cellsY)) && (cellNumber % cellsX)) neighbors.push(cellNumber + cellsX - 1);
    // bottom-right
    if ((cellNumber < ((cellsX * cellsY) - cellsY)) && (cellNumber + 1) % cellsX) neighbors.push(cellNumber + cellsX + 1);
  }
  return neighbors.filter(cell => cell >= 0 && typeof cells[cell] !== 'undefined');
}

export function getNeighborsAsObject(cells: Int8Array, cellsX: number, cellsY: number, cellNumber: number, diagonal: boolean = false): { [key: string]: number } {
  const neighbors: { [key: string]: number } = {};
  // top cell
  if (cellNumber >= cellsX) neighbors['top'] = (cellNumber - cellsX);
  // right cell
  if ((cellNumber + 1) % cellsX) neighbors['right'] = (cellNumber + 1);
  // left cell
  if (cellNumber % cellsX) neighbors['left'] = (cellNumber - 1);
  // bottom cell
  if (cellNumber < ((cellsX * cellsY) - cellsY)) neighbors['bottom'] = (cellNumber + cellsX);

  if (diagonal) {
    // top-left
    if ((cellNumber >= cellsX) && (cellNumber % cellsX)) neighbors['topLeft'] = (cellNumber - cellsX - 1);
    // top-right
    if ((cellNumber >= cellsX) && (cellNumber + 1) % cellsX) neighbors['topRight'] = (cellNumber - cellsX + 1);
    // bottom-left
    if ((cellNumber < ((cellsX * cellsY) - cellsY)) && (cellNumber % cellsX)) neighbors['bottomLeft'] = (cellNumber + cellsX - 1);
    // bottom-right
    if ((cellNumber < ((cellsX * cellsY) - cellsY)) && (cellNumber + 1) % cellsX) neighbors['bottomRight'] = (cellNumber + cellsX + 1);
  }
  return neighbors;
}
