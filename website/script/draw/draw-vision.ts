import { getCanvasCoordsByCellNumber } from '../utils';
import { Character } from '../types/character';

function findIntersection(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): [number, number]|null {
  const denom: number = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (denom === 0) return null;
  const t: number = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u: number = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    const intersectX: number = x1 + t * (x2 - x1);
    const intersectY: number = y1 + t * (y2 - y1);
    return [intersectX, intersectY];
  }
  return null;
}

export function drawVision(ctx: CanvasRenderingContext2D, w: number, h: number, blockedCells: number[], cellsX: number, cellSize: number, character: Character, color: string) {
  let segments: number = 1.875 * character.visionRadiusPx;
  let [x, y]: [number, number] = character.positionPx;
  let centerX: number = x + (cellSize / 2);
  let centerY: number = y + (cellSize / 2);
  let firstPoint: [number, number];

  let visibleTrees: {
    topLeft: number[];
    top: number[];
    topRight: number[];
    right: number[];
    bottomRight: number[];
    bottom: number[];
    bottomLeft: number[];
    left: number[];
  } = {
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
    let [treeX, treeY]: [number, number] = getCanvasCoordsByCellNumber(treePosition, cellsX, cellSize);
    let isLeft: boolean = (treePosition % cellsX) < (character.position % cellsX);
    let isRight: boolean = (treePosition % cellsX) > (character.position % cellsX);
    let isTop: boolean = (treePosition < character.position) && (Math.floor(character.position / cellsX) > Math.floor(treePosition / cellsX));
    let isBottom: boolean = (treePosition > character.position) && (Math.floor(character.position / cellsX) < Math.floor(treePosition / cellsX));
    let isVerticalTop: boolean = isTop && (!isLeft && !isRight);
    let isVerticalBottom: boolean = isBottom && (!isLeft && !isRight);
    let isHorizontalLeft: boolean = isLeft && (!isTop && !isBottom);
    let isHorizontalRight: boolean = isRight && (!isTop && !isBottom);
    if (isHorizontalLeft && (treeX + cellSize) >= (centerX - character.visionRadiusPx)) visibleTrees.left.push(treePosition);
    if (isHorizontalRight && (treeX) <= (centerX + character.visionRadiusPx)) visibleTrees.right.push(treePosition);
    if (isVerticalTop && (treeY + cellSize) >= (centerY - character.visionRadiusPx)) visibleTrees.top.push(treePosition);
    if (isVerticalBottom && (treeY) <= (centerY + character.visionRadiusPx)) visibleTrees.bottom.push(treePosition);
    if (
      !isHorizontalLeft && !isVerticalTop && (isTop && isLeft)
      && Math.sqrt((x - (treeX + cellSize))**2 + (y - (treeY + cellSize))**2) < character.visionRadiusPx - (cellSize / 2)
    ) visibleTrees.topLeft.push(treePosition);
    if (
      !isHorizontalLeft && !isVerticalTop && (isBottom && isLeft)
      && Math.sqrt((x - (treeX + cellSize))**2 + (y - treeY)**2) < character.visionRadiusPx - (cellSize / 2)
    ) visibleTrees.bottomLeft.push(treePosition);
    if (
      !isHorizontalRight && !isVerticalTop && (isTop && isRight)
      && Math.sqrt(((treeX) - x)**2 + (y - (treeY + cellSize))**2) < character.visionRadiusPx - (cellSize / 2)
    ) visibleTrees.topRight.push(treePosition);
    if (
      !isHorizontalRight && !isVerticalTop && (isBottom && isRight)
      && Math.sqrt(((treeX) - x)**2 + (y - treeY)**2) < character.visionRadiusPx - (cellSize / 2)
    ) visibleTrees.bottomRight.push(treePosition);
  }

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, h);
  ctx.lineTo(w, h);
  ctx.lineTo(w, h / 2);
  for (let i: number = 0; i <= segments; i++) {
    const angle: number = (i / segments) * 2 * Math.PI;
    const x: number = centerX + Math.cos(angle) * character.visionRadiusPx;
    const y: number = centerY + Math.sin(angle) * character.visionRadiusPx;
    const intersections: [number, number][] = [];
    visibleTrees.topLeft.forEach((treePosition) => {
      const [treeX, treeY]: [number, number] = getCanvasCoordsByCellNumber(treePosition, cellsX, cellSize);
      let i: [number, number] = findIntersection(
        centerX, centerY, x, y,
        treeX, treeY, treeX + cellSize, treeY,
      );
      if (i !== null) intersections.push(i);
      i = findIntersection(
        centerX, centerY, x, y,
        treeX, treeY, treeX, treeY + cellSize,
      );
      if (i !== null) intersections.push(i);
    });
    visibleTrees.top.forEach((treePosition) => {
      const [treeX, treeY]: [number, number] = getCanvasCoordsByCellNumber(treePosition, cellsX, cellSize);
      const i: [number, number] = findIntersection(
        centerX, centerY, x, y,
        treeX, treeY, treeX + cellSize, treeY,
      );
      if (i !== null) intersections.push(i);
    });
    visibleTrees.topRight.forEach((treePosition) => {
      const [treeX, treeY]: [number, number] = getCanvasCoordsByCellNumber(treePosition, cellsX, cellSize);
      let i: [number, number] = findIntersection(
        centerX, centerY, x, y,
        treeX, treeY, treeX + cellSize, treeY,
      );
      if (i !== null) intersections.push(i);
      i = findIntersection(
        centerX, centerY, x, y,
        treeX + cellSize, treeY, treeX + cellSize, treeY + cellSize,
      );
      if (i !== null) intersections.push(i);
    });
    visibleTrees.right.forEach((treePosition) => {
      const [treeX, treeY]: [number, number] = getCanvasCoordsByCellNumber(treePosition, cellsX, cellSize);
      const i: [number, number] = findIntersection(
        centerX, centerY, x, y,
        treeX + cellSize, treeY, treeX + cellSize, treeY + cellSize,
      );
      if (i !== null) intersections.push(i);
    });
    visibleTrees.bottomRight.forEach((treePosition) => {
      const [treeX, treeY]: [number, number] = getCanvasCoordsByCellNumber(treePosition, cellsX, cellSize);
      let i: [number, number] = findIntersection(
        centerX, centerY, x, y,
        treeX, treeY + cellSize, treeX + cellSize, treeY + cellSize,
      );
      if (i !== null) intersections.push(i);
      i = findIntersection(
        centerX, centerY, x, y,
        treeX + cellSize, treeY, treeX + cellSize, treeY + cellSize,
      );
      if (i !== null) intersections.push(i);
    });
    visibleTrees.bottom.forEach((treePosition) => {
      const [treeX, treeY]: [number, number] = getCanvasCoordsByCellNumber(treePosition, cellsX, cellSize);
      const i: [number, number] = findIntersection(
        centerX, centerY, x, y,
        treeX, treeY + cellSize, treeX + cellSize, treeY + cellSize,
      );
      if (i !== null) intersections.push(i);
    });
    visibleTrees.bottomLeft.forEach((treePosition) => {
      const [treeX, treeY]: [number, number] = getCanvasCoordsByCellNumber(treePosition, cellsX, cellSize);
      let i: [number, number] = findIntersection(
        centerX, centerY, x, y,
        treeX, treeY + cellSize, treeX + cellSize, treeY + cellSize,
      );
      if (i !== null) intersections.push(i);
      i = findIntersection(
        centerX, centerY, x, y,
        treeX, treeY, treeX, treeY + cellSize,
      );
      if (i !== null) intersections.push(i);
    });
    visibleTrees.left.forEach((treePosition) => {
      const [treeX, treeY]: [number, number] = getCanvasCoordsByCellNumber(treePosition, cellsX, cellSize);
      const i: [number, number] = findIntersection(
        centerX, centerY, x, y,
        treeX, treeY, treeX, treeY + cellSize,
      );
      if (i !== null) intersections.push(i);
    });

    const shortestRadius: number = intersections.reduce((radius, currentIntersection: [number, number]) => {
      const newRadius = Math.sqrt(Math.abs(currentIntersection[0] - x)**2 + Math.abs(currentIntersection[1] - y)**2);
      return newRadius > radius ? newRadius : radius;
    }, 0);
    const newRadius = shortestRadius === character.visionRadiusPx ? character.visionRadiusPx : character.visionRadiusPx - shortestRadius;
    if (i === 0) {
      firstPoint = [centerX + Math.cos(angle) * newRadius, centerY + Math.sin(angle) * newRadius];
      ctx.lineTo(centerX + Math.cos(angle) * newRadius, centerY + Math.sin(angle) * newRadius);
    } else {
      ctx.lineTo(centerX + Math.cos(angle) * newRadius, centerY + Math.sin(angle) * newRadius);
    }
  }
  ctx.lineTo(...firstPoint);
  ctx.lineTo(w, h / 2);
  ctx.lineTo(w, 0);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}
