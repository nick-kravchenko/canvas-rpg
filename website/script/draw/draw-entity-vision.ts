import { getPixelCoordsByCellNumber, getLinesIntersection, getVisibleTrees } from '../utils';
import { VisibleTrees } from '../utils/get-visible-trees';
import { gameState } from '../game-state';
import { CharacterEntity } from '../ecs/entity';
import { ComponentKey } from '../enums/component-key.enum';
import { PositionComponent, VisionComponent } from '../ecs/component';

export function drawEntityVision(blockedCells: number[], character: CharacterEntity, color: string) {
  if (gameState.ignoreVision) return;

  const {
    ctx,
    cellsX,
    cellSize,
    w,
    h,
  } = gameState;

  const vision: VisionComponent = character.getComponent(ComponentKey.VISION);
  const position: PositionComponent = character.getComponent(ComponentKey.POSITION);

  let segments: number = 1.875 * vision.visionRadiusPx;
  let [x, y]: [number, number] = position.coordsPx;
  let centerX: number = x + (cellSize / 2);
  let centerY: number = y + (cellSize / 2);
  let firstPoint: [number, number];

  let visibleTrees: VisibleTrees = getVisibleTrees(blockedCells, cellsX, cellSize, position.cellNumber, x, y, centerX, centerY, vision.visionRadiusPx);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, h);
  ctx.lineTo(w, h);
  ctx.lineTo(w, h / 2);
  for (let i: number = 0; i <= segments; i++) {
    const angle: number = (i / segments) * 2 * Math.PI;
    const x: number = centerX + Math.cos(angle) * vision.visionRadiusPx;
    const y: number = centerY + Math.sin(angle) * vision.visionRadiusPx;
    const intersections: [number, number][] = [];
    visibleTrees.topLeft.forEach((treePosition) => {
      const [treeX, treeY]: [number, number] = getPixelCoordsByCellNumber(treePosition);
      let i: [number, number] = getLinesIntersection(
        centerX, centerY, x, y,
        treeX, treeY, treeX + cellSize, treeY,
      );
      if (i !== null) intersections.push(i);
      i = getLinesIntersection(
        centerX, centerY, x, y,
        treeX, treeY, treeX, treeY + cellSize,
      );
      if (i !== null) intersections.push(i);
    });
    visibleTrees.top.forEach((treePosition) => {
      const [treeX, treeY]: [number, number] = getPixelCoordsByCellNumber(treePosition);
      const i: [number, number] = getLinesIntersection(
        centerX, centerY, x, y,
        treeX, treeY, treeX + cellSize, treeY,
      );
      if (i !== null) intersections.push(i);
    });
    visibleTrees.topRight.forEach((treePosition) => {
      const [treeX, treeY]: [number, number] = getPixelCoordsByCellNumber(treePosition);
      let i: [number, number] = getLinesIntersection(
        centerX, centerY, x, y,
        treeX, treeY, treeX + cellSize, treeY,
      );
      if (i !== null) intersections.push(i);
      i = getLinesIntersection(
        centerX, centerY, x, y,
        treeX + cellSize, treeY, treeX + cellSize, treeY + cellSize,
      );
      if (i !== null) intersections.push(i);
    });
    visibleTrees.right.forEach((treePosition) => {
      const [treeX, treeY]: [number, number] = getPixelCoordsByCellNumber(treePosition);
      const i: [number, number] = getLinesIntersection(
        centerX, centerY, x, y,
        treeX + cellSize, treeY, treeX + cellSize, treeY + cellSize,
      );
      if (i !== null) intersections.push(i);
    });
    visibleTrees.bottomRight.forEach((treePosition) => {
      const [treeX, treeY]: [number, number] = getPixelCoordsByCellNumber(treePosition);
      let i: [number, number] = getLinesIntersection(
        centerX, centerY, x, y,
        treeX, treeY + cellSize, treeX + cellSize, treeY + cellSize,
      );
      if (i !== null) intersections.push(i);
      i = getLinesIntersection(
        centerX, centerY, x, y,
        treeX + cellSize, treeY, treeX + cellSize, treeY + cellSize,
      );
      if (i !== null) intersections.push(i);
    });
    visibleTrees.bottom.forEach((treePosition) => {
      const [treeX, treeY]: [number, number] = getPixelCoordsByCellNumber(treePosition);
      const i: [number, number] = getLinesIntersection(
        centerX, centerY, x, y,
        treeX, treeY + cellSize, treeX + cellSize, treeY + cellSize,
      );
      if (i !== null) intersections.push(i);
    });
    visibleTrees.bottomLeft.forEach((treePosition) => {
      const [treeX, treeY]: [number, number] = getPixelCoordsByCellNumber(treePosition);
      let i: [number, number] = getLinesIntersection(
        centerX, centerY, x, y,
        treeX, treeY + cellSize, treeX + cellSize, treeY + cellSize,
      );
      if (i !== null) intersections.push(i);
      i = getLinesIntersection(
        centerX, centerY, x, y,
        treeX, treeY, treeX, treeY + cellSize,
      );
      if (i !== null) intersections.push(i);
    });
    visibleTrees.left.forEach((treePosition) => {
      const [treeX, treeY]: [number, number] = getPixelCoordsByCellNumber(treePosition);
      const i: [number, number] = getLinesIntersection(
        centerX, centerY, x, y,
        treeX, treeY, treeX, treeY + cellSize,
      );
      if (i !== null) intersections.push(i);
    });

    const shortestRadius: number = intersections.reduce((radius, currentIntersection: [number, number]) => {
      const newRadius = Math.hypot(currentIntersection[0] - x, currentIntersection[1] - y);
      return newRadius > radius ? newRadius : radius;
    }, 0);
    const newRadius = shortestRadius === vision.visionRadiusPx ? vision.visionRadiusPx : vision.visionRadiusPx - shortestRadius;
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
