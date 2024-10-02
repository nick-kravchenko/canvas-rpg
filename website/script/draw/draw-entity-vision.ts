import {
  getPixelCoordsByCellNumber,
  getNeighbors,
} from '../utils';
import { gameState } from '../game-state';
import { CharacterEntity } from '../ecs/entity';
import { ComponentKey } from '../enums/component-key.enum';
import { PositionComponent, VisionComponent } from '../ecs/component';
import { CELL_STATE } from '../enums/cell-state.enum';

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

export function drawEntityVision(blockedCells: number[], character: CharacterEntity, color: string) {
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

  let [x, y]: [number, number] = position.coordsPx;
  let centerX: number = x + ~~(cellSize * .5);
  let centerY: number = y + ~~(cellSize * .5);
  let firstPoint: [number, number];

  let visibleTrees: number[] = [];
  for (let i: number = 0; i < cells.length; i++) {
    if (cells[i] === CELL_STATE.BLOCKED && vision.visibleCells.includes(i)) {
      visibleTrees.push(i);
    }
  }

  ctx.save();
  const start: number = performance.now();
  const points: [number, number][] = getNeighbors(w, h, centerX + centerY * w, vision.visionRadiusPx).map((point: number): [number, number] => {
    const x: number = point % w;
    const y: number = ~~(point / w);
    return [x, y];
  }).sort((point1: [number, number], point2: [number, number]) => {
    const p1Atan: number = Math.atan2(point1[0] - centerX, point1[1] - centerY);
    const p2Atan: number = Math.atan2(point2[0] - centerX, point2[1] - centerY);
    return p1Atan > p2Atan ? -1 : 1;
  });
  gameState.debug = {
    'Neighbors found in': `${((performance.now() - start).toFixed(2))}ms`,
  };
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, h);
  ctx.lineTo(w, h);
  ctx.lineTo(w, 0);
  ctx.lineTo(~~(w * .5), 0);
  for (let i: number = 0; i < points.length; i += 4) {
    let [x, y]: [number, number] = points[i];
    for (let treeCell of visibleTrees) {
      let [treeX, treeY]: [number, number] = getPixelCoordsByCellNumber(treeCell);
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
