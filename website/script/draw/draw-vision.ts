import { getPixelCoordsByCellNumber } from '../utils';
import { gameState } from '../game-state';
import { GameObject } from '../entities';
import { ComponentKey } from '../types/component-key.enum';
import { PositionComponent, VisionComponent } from '../components';
import { CELL_STATE } from '../types/cell-state.enum';

const lineCollisionsWithCircle = (line: [[number, number], [number, number]], circle: [[number, number], number]): [number, number][] => {
  const dx: number = line[1][0] - line[0][0]; // Direction vector of the line
  const dy: number = line[1][1] - line[0][1];

  const fx: number = line[0][0] - circle[0][0]; // Vector from circle center to P1
  const fy: number = line[0][1] - circle[0][1];

  const A: number = dx**2 + dy**2;
  const B: number = 2 * (fx * dx + fy * dy);
  const C_: number = (fx * fx + fy * fy) - circle[1]**2;

  const discriminant: number = B**2 - 4 * A * C_;

  if (discriminant < 0) {
    return [];
  } else {
    const t1: number = (-B - Math.sqrt(discriminant)) / (2 * A);
    const t2: number = (-B + Math.sqrt(discriminant)) / (2 * A);

    const intersectionPoints: [number, number][] = [];

    if (t1 >= 0 && t1 <= 1) {
      const intersection1: [number, number] = [
        line[0][0] + t1 * dx, // x-coordinate of intersection
        line[0][1] + t1 * dy  // y-coordinate of intersection
      ];
      intersectionPoints.push(intersection1);
    }

    // Check if t2 is within the bounds of the line segment
    if (t2 >= 0 && t2 <= 1) {
      const intersection2: [number, number] = [
        line[0][0] + t2 * dx, // x-coordinate of intersection
        line[0][1] + t2 * dy  // y-coordinate of intersection
      ];
      intersectionPoints.push(intersection2);
    }

    return intersectionPoints;
  }
}

export function drawVision(character: GameObject, color: string) {
  if (gameState.ignoreVision) return;

  const {
    ctx,
    cells,
    cellSize,
    w,
    h,
  } = gameState;

  const vision: VisionComponent = character.getComponent(ComponentKey.VISION);
  const position: PositionComponent = character.getComponent(ComponentKey.POSITION);

  const [x, y]: [number, number] = position.coordsPx;
  const centerX: number = x + ~~(cellSize * .5);
  const centerY: number = y + ~~(cellSize * .5);
  let firstPoint: [number, number];

  const visibleTrees: number[] = [];
  for (let i: number = 0; i < cells.length; i++) {
    if (cells[i] === CELL_STATE.BLOCKED && vision.visibleCells.includes(i)) {
      visibleTrees.push(i);
    }
  }

  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, h);
  ctx.lineTo(w, h);
  ctx.lineTo(w, 0);
  ctx.lineTo(~~(w * .5), 0);
  const segments: number = Math.PI * 2 * vision.visionRadiusPx;
  for (let i: number = 0; i < segments; i++) {
    const angle: number = i * Math.PI * 2 / segments;
    let x: number = centerX + Math.cos(angle) * vision.visionRadiusPx;
    let y: number = centerY + Math.sin(angle) * vision.visionRadiusPx;
    for (const treeCell of visibleTrees) {
      const [treeX, treeY]: [number, number] = getPixelCoordsByCellNumber(treeCell);
      const collisionPoints: [number, number][] = lineCollisionsWithCircle([[centerX, centerY], [x, y]], [[treeX + cellSize *.5, treeY + cellSize *.5], cellSize * .5]);
      if (collisionPoints.length) {
        const [px, py]: [number, number] = collisionPoints.pop();
        x = px;
        y = py;
      }
    }
    if (i === 0) {
      firstPoint = [x, y];
    }
    ctx.fillRect(x, y, 1, 1);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(...firstPoint);
  ctx.lineTo(~~(w * .5), 0);
  ctx.closePath();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.restore();
}
