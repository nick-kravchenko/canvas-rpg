import { getCanvasCoordsByCellNumber } from '../utils';
import { Character } from '../types/character';

function isOverlappingCharacter(cellNumber: number, cellsX: number, cellSize: number, treeHeight: number, character: Character): boolean {
  return treeHeight > cellSize
    && cellNumber % cellsX === character.position % cellsX
    && cellNumber > character.position
    && (Math.floor(cellNumber / cellsX) - Math.floor(character.position / cellsX)) < treeHeight / cellSize;
}

export function drawTree(ctx: CanvasRenderingContext2D, treeImages: { [key: number]: HTMLImageElement }, cellNumber: number, cellsX: number, cellSize: number, character: Character) {
  const [x, y]: [number, number] = getCanvasCoordsByCellNumber(cellNumber, cellsX, cellSize);
  const treeImage: HTMLImageElement = treeImages[cellNumber];
  ctx.save();
  if (isOverlappingCharacter(cellNumber, cellsX, cellSize, treeImage.height, character)) {
    ctx.globalAlpha = .5;
  }
  ctx.drawImage(
    treeImage,
    x + (cellSize * .5) - (treeImage.width * .5),
    y + (cellSize * .5) - (treeImage.height * .75),
    treeImage.width,
    treeImage.height,
  );
  ctx.restore();
}
