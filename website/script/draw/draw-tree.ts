import { getPixelCoordsByCellNumber } from '../utils';
import { gameState } from '../game-state';
import { PositionComponent } from '../components';

function isOverlappingCharacter(cellNumber: number, cellsX: number, cellSize: number, treeHeight: number, positionComponent: PositionComponent): boolean {
  return treeHeight > cellSize
    && cellNumber % cellsX === positionComponent.cellNumber % cellsX
    && cellNumber > positionComponent.cellNumber
    && (Math.floor(cellNumber / cellsX) - Math.floor(positionComponent.cellNumber / cellsX)) < treeHeight / cellSize;
}

export function drawTree(treeImages: { [key: number]: HTMLImageElement }, cellNumber: number, positionComponent: PositionComponent) {
  const {
    ctx,
    cellsX,
    cellSize,
  } = gameState;

  const [x, y]: [number, number] = getPixelCoordsByCellNumber(cellNumber);
  const treeImage: HTMLImageElement = treeImages[cellNumber];
  ctx.save();
  if (isOverlappingCharacter(cellNumber, cellsX, cellSize, treeImage.height, positionComponent)) {
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
