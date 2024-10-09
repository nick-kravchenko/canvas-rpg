import { getPixelCoordsByCellNumber } from './get-pixel-coords-by-cell-number';

export interface VisibleTrees {
  topLeft: number[];
  top: number[];
  topRight: number[];
  right: number[];
  bottomRight: number[];
  bottom: number[];
  bottomLeft: number[];
  left: number[];
}

export function getVisibleTrees(
  blockedCells: Set<number>,
  cellsX: number,
  cellSize: number,
  cellNumber: number,
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  radiusPx: number): VisibleTrees {
  const visibleTrees: VisibleTrees = {
    topLeft: [],
    top: [],
    topRight: [],
    right: [],
    bottomRight: [],
    bottom: [],
    bottomLeft: [],
    left: [],
  };
  const arr = Array.from(blockedCells);
  for (let i: number = 0; i < arr.length; i++) {
    const treePosition: number = arr[i];
    const [treeX, treeY]: [number, number] = getPixelCoordsByCellNumber(treePosition);
    const isLeft: boolean = (treePosition % cellsX) < (cellNumber % cellsX);
    const isRight: boolean = (treePosition % cellsX) > (cellNumber % cellsX);
    const isTop: boolean = (treePosition < cellNumber) && (Math.floor(cellNumber / cellsX) > Math.floor(treePosition / cellsX));
    const isBottom: boolean = (treePosition > cellNumber) && (Math.floor(cellNumber / cellsX) < Math.floor(treePosition / cellsX));
    const isVerticalTop: boolean = isTop && (!isLeft && !isRight);
    const isVerticalBottom: boolean = isBottom && (!isLeft && !isRight);
    const isHorizontalLeft: boolean = isLeft && (!isTop && !isBottom);
    const isHorizontalRight: boolean = isRight && (!isTop && !isBottom);
    if (isHorizontalLeft && (treeX + cellSize) >= (centerX - radiusPx)) visibleTrees.left.push(treePosition);
    if (isHorizontalRight && (treeX) <= (centerX + radiusPx)) visibleTrees.right.push(treePosition);
    if (isVerticalTop && (treeY + cellSize) >= (centerY - radiusPx)) visibleTrees.top.push(treePosition);
    if (isVerticalBottom && (treeY) <= (centerY + radiusPx)) visibleTrees.bottom.push(treePosition);
    if (
      !isHorizontalLeft && !isVerticalTop && (isTop && isLeft)
      && Math.hypot(x - (treeX + cellSize), y - (treeY + cellSize)) < radiusPx - (cellSize / 2)
    ) visibleTrees.topLeft.push(treePosition);
    if (
      !isHorizontalLeft && !isVerticalTop && (isBottom && isLeft)
      && Math.hypot(x - (treeX + cellSize), y - treeY) < radiusPx - (cellSize / 2)
    ) visibleTrees.bottomLeft.push(treePosition);
    if (
      !isHorizontalRight && !isVerticalTop && (isTop && isRight)
      && Math.hypot((treeX) - x, y - (treeY + cellSize)) < radiusPx - (cellSize / 2)
    ) visibleTrees.topRight.push(treePosition);
    if (
      !isHorizontalRight && !isVerticalTop && (isBottom && isRight)
      && Math.hypot((treeX) - x, y - treeY) < radiusPx - (cellSize / 2)
    ) visibleTrees.bottomRight.push(treePosition);
  }

  return visibleTrees;
}
