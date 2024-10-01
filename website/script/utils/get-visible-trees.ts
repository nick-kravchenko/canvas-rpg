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
  blockedCells: number[],
  cellsX: number,
  cellSize: number,
  cellNumber: number,
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  radiusPx: number): VisibleTrees {
  let visibleTrees: VisibleTrees = {
    topLeft: [],
    top: [],
    topRight: [],
    right: [],
    bottomRight: [],
    bottom: [],
    bottomLeft: [],
    left: [],
  };
  for (let i: number = 0; i < blockedCells.length; i++) {
    let treePosition: number = blockedCells[i];
    let [treeX, treeY]: [number, number] = getPixelCoordsByCellNumber(treePosition);
    let isLeft: boolean = (treePosition % cellsX) < (cellNumber % cellsX);
    let isRight: boolean = (treePosition % cellsX) > (cellNumber % cellsX);
    let isTop: boolean = (treePosition < cellNumber) && (Math.floor(cellNumber / cellsX) > Math.floor(treePosition / cellsX));
    let isBottom: boolean = (treePosition > cellNumber) && (Math.floor(cellNumber / cellsX) < Math.floor(treePosition / cellsX));
    let isVerticalTop: boolean = isTop && (!isLeft && !isRight);
    let isVerticalBottom: boolean = isBottom && (!isLeft && !isRight);
    let isHorizontalLeft: boolean = isLeft && (!isTop && !isBottom);
    let isHorizontalRight: boolean = isRight && (!isTop && !isBottom);
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
