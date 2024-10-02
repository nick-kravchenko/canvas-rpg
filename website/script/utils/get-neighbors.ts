import { gameState } from '../game-state';
import { clamp } from './clamp';

class PixelSet {
  w: number;
  h: number;
  private _points: Set<number> = new Set();
  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
  }
  get points(): number[] {
    return Array.from(this._points);
  };
  addPoint(point: [number, number]) {
    const x: number = clamp(point[0], 0, this.w);
    const y: number = clamp(point[1], 0, this.h);
    this._points.add(y * this.w + x);
  }
}

export function getNeighbors(w: number, h: number, cellNumber: number, radius: number): number[] {
  const px: number = cellNumber % w;
  const py: number = ~~(cellNumber / w);
  const pixelSet: PixelSet = new PixelSet(w, h);
  for (let dx: number = 0; dx < radius; dx++) {
    let dy: number = Math.ceil(Math.sqrt(radius**2 - dx**2));
    pixelSet.addPoint([px + dx, py + dy]);
    pixelSet.addPoint([px + dx, py - dy]);
    pixelSet.addPoint([px - dx, py + dy]);
    pixelSet.addPoint([px - dx, py - dy]);
    pixelSet.addPoint([px + dy, py + dx]);
    pixelSet.addPoint([px + dy, py - dx]);
    pixelSet.addPoint([px - dy, py + dx]);
    pixelSet.addPoint([px - dy, py - dx]);
  }
  return pixelSet.points;
}

export function getNeighborsAsObject(cellNumber: number, diagonal: boolean = false): { [key: string]: number } {
  const {
    cellsX,
    cellsY,
  } = gameState;

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
