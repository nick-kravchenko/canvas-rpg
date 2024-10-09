import { GameObject } from '../entities';
import { PositionComponent, VisionComponent } from '../components';
import { gameState } from '../game-state';
import { getVisibleTrees, VisibleTrees } from '../utils/get-visible-trees';
import { getDistanceInCells, getLinesIntersection, getPixelCoordsByCellNumber } from '../utils';
import { ComponentKey } from '../types/component-key.enum';

class VisionSystem {
  update(entities: GameObject[], blockedCells: Set<number>) {
    entities.forEach((entity: GameObject) => {
      const vision: VisionComponent = entity.getComponent(ComponentKey.VISION);
      const position: PositionComponent = entity.getComponent(ComponentKey.POSITION);

      this.updateVisionCells(vision, position, blockedCells);
    });
  }

  updateVisionCells(vision: VisionComponent, position: PositionComponent, blockedCells: Set<number>) {
    const { cells, cellsX, cellSize } = gameState;

    vision.visibleCells = [];
    const [x, y]: [number, number] = position.coordsPx;
    const centerX: number = x + (cellSize / 2);
    const centerY: number = y + (cellSize / 2);
    const visibleTrees: VisibleTrees = getVisibleTrees(blockedCells, cellsX, cellSize, position.cellNumber, x, y, centerX, centerY, vision.visionRadiusPx);

    for (let i: number = 0; i < cells.length; i++) {
      const distance: number = getDistanceInCells(position.cellNumber, i);

      // Check if within vision radius
      if (distance < vision.visionRadiusCells) {
        // If not yet explored, mark as explored
        if (!vision.exploredCells.includes(i) && this.isOnLineOfSight(visibleTrees, centerX, centerY, i)) {
          vision.exploredCells.push(i);
        }

        // Check if it's within line of sight
        if (this.isOnLineOfSight(visibleTrees, centerX, centerY, i)) {
          vision.visibleCells.push(i); // Add to visible cells if it's on the line of sight
        }
      }
    }
  }

  isOnLineOfSight(visibleTrees: VisibleTrees, centerX: number, centerY: number, cellNumber: number): boolean {
    const { cellSize } = gameState;
    const [targetX, targetY]: [number, number] = getPixelCoordsByCellNumber(cellNumber);

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

    for (const [treeX, treeY] of Object.values(visibleTrees).flat().map((treePosition: number) => getPixelCoordsByCellNumber(treePosition))) {
      const intersections: ([number, number] | null)[] = [
        getLinesIntersection(centerX, centerY, targetX + cellSize * .5, targetY + cellSize * .5, treeX, treeY, treeX + cellSize, treeY),  // Top
        getLinesIntersection(centerX, centerY, targetX + cellSize * .5, targetY + cellSize * .5, treeX, treeY + cellSize, treeX + cellSize, treeY + cellSize),  // Bottom
        getLinesIntersection(centerX, centerY, targetX + cellSize * .5, targetY + cellSize * .5, treeX, treeY, treeX, treeY + cellSize),  // Left
        getLinesIntersection(centerX, centerY, targetX + cellSize * .5, targetY + cellSize * .5, treeX + cellSize, treeY, treeX + cellSize, treeY + cellSize)  // Right
      ];

      if (intersections.some((intersection: [number, number] | null) => {
        if (!intersection) return false;
        const treeDist: number = Math.hypot(intersection[0] - centerX, intersection[1] - centerY);
        const targetDist: number = Math.hypot(closestIntersectionWithTarget[0] - centerX, closestIntersectionWithTarget[1] - centerY);
        return treeDist < targetDist;
      })) {
        return false;  // The view is blocked by a tree
      }
    }

    return true;  // No trees are blocking the line of sight
  }

  setCharacterVisionRadius(character: GameObject, newVisionRadius: number) {
    const vision: VisionComponent = character.getComponent(ComponentKey.VISION);
    if (newVisionRadius !== vision.visionRadiusCells) {
      vision.visionRadiusCells += newVisionRadius > vision.visionRadiusCells ? 1 : -1;
      if (newVisionRadius !== vision.visionRadiusCells) {
        setTimeout(() => {
          this.setCharacterVisionRadius(character, newVisionRadius);
        }, 256);
      }
    }
  }

  setCharacterVisionRadiusPx(character: GameObject, newVisionRadius: number) {
    const vision: VisionComponent = character.getComponent(ComponentKey.VISION);
    if (newVisionRadius !== vision.visionRadiusPx) {
      vision.visionRadiusPx += newVisionRadius > vision.visionRadiusPx ? 1 : -1;
      if (newVisionRadius !== vision.visionRadiusPx) {
        setTimeout(() => {
          this.setCharacterVisionRadiusPx(character, newVisionRadius);
        }, 256 / gameState.cellSize);
      }
    }
  }
}
export const visionSystem: VisionSystem = new VisionSystem();
