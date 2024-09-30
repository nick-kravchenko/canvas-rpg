import { Character } from '../types/character';
import { getDistanceInCells } from './get-distance-in-cells';
import { getVisibleTrees, VisibleTrees } from './get-visible-trees';
import { getCanvasCoordsByCellNumber } from './get-canvas-coords-by-cell-number';
import { getLinesIntersection } from './get-lines-intersection';

function isOnLineOfSight(cellsX: number, cellSize: number, visibleTrees: VisibleTrees, centerX: number, centerY: number, cellNumber: number) {
  let [targetX, targetY]: [number, number] = getCanvasCoordsByCellNumber(cellNumber, cellsX, cellSize);

  const targetIntersections: [number, number][] = [
    getLinesIntersection(centerX, centerY, targetX + cellSize * .5, targetY + cellSize * .5, targetX, targetY, targetX + cellSize, targetY),  // Top
    getLinesIntersection(centerX, centerY, targetX + cellSize * .5, targetY + cellSize * .5, targetX, targetY + cellSize, targetX + cellSize, targetY + cellSize),  // Bottom
    getLinesIntersection(centerX, centerY, targetX + cellSize * .5, targetY + cellSize * .5, targetX, targetY, targetX, targetY + cellSize),  // Left
    getLinesIntersection(centerX, centerY, targetX + cellSize * .5, targetY + cellSize * .5, targetX + cellSize, targetY, targetX + cellSize, targetY + cellSize)  // Right
  ];

  const closestIntersectionWithTarget: [number, number] | null = targetIntersections.reduce((prev: [number, number] | null, cur: [number, number] | null) => {
    if (!cur) return prev;
    if (!prev) return cur;
    const prevDist: number = Math.hypot(centerX - prev[0], centerY - prev[1]);
    const curDist: number = Math.hypot(centerX - cur[0], centerY - cur[1]);
    return prevDist > curDist ? cur : prev;
  }, null);

  if (!closestIntersectionWithTarget) {
    return false;
  }

  for (const [treeX, treeY] of Object.values(visibleTrees).flat().map((treePosition: number) => getCanvasCoordsByCellNumber(treePosition, cellsX, cellSize))) {
    const intersections: ([number, number] | null)[] = [
      getLinesIntersection(centerX, centerY, targetX + cellSize * .5, targetY + cellSize * .5, treeX, treeY, treeX + cellSize, treeY),  // Top
      getLinesIntersection(centerX, centerY, targetX + cellSize * .5, targetY + cellSize * .5, treeX, treeY + cellSize, treeX + cellSize, treeY + cellSize),  // Bottom
      getLinesIntersection(centerX, centerY, targetX + cellSize * .5, targetY + cellSize * .5, treeX, treeY, treeX, treeY + cellSize),  // Left
      getLinesIntersection(centerX, centerY, targetX + cellSize * .5, targetY + cellSize * .5, treeX + cellSize, treeY, treeX + cellSize, treeY + cellSize)  // Right
    ];

    if (intersections.some((intersection: [number, number] | null) => {
      if (!intersection) return false;
      const treeDist = Math.hypot(intersection[0] - centerX, intersection[1] - centerY);
      const targetDist = Math.hypot(closestIntersectionWithTarget[0] - centerX, closestIntersectionWithTarget[1] - centerY);
      return treeDist < targetDist;
    })) {
      return false;  // The view is blocked by a tree
    }
  }

  return true;  // No trees are blocking the line of sight
}

export function updateCharacterVision(cells: Int8Array, blockedCells: number[], cellsX: number, cellSize: number, character: Character) {
  character.visible = [];
  let [x, y]: [number, number] = character.positionPx;
  let centerX: number = x + (cellSize / 2);
  let centerY: number = y + (cellSize / 2);
  let visibleTrees: VisibleTrees = getVisibleTrees(blockedCells, cellsX, cellSize, character.position, x, y, centerX, centerY, character.visionRadiusPx);
  for (let i: number = 0; i < cells.length; i++) {
    const distance = getDistanceInCells(cellsX, character.position, i);

    // Check if within vision radius
    if (distance < character.visionRadius) {
      // If not yet explored, mark as explored
      if (!character.explored.includes(i) && isOnLineOfSight(cellsX, cellSize, visibleTrees, centerX, centerY, i)) character.explored.push(i);

      // Check if it's within line of sight
      if (isOnLineOfSight(cellsX, cellSize, visibleTrees, centerX, centerY, i)) {
        character.visible.push(i); // Add to visible cells if it's on the line of sight
      }
    }
  }
}
