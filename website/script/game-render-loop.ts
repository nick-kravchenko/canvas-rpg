import { MovementComponent, PositionComponent, VisionComponent } from './ecs/component';
import { playerCharacter } from './data/player';
import { gameState } from './game-state';
import { PlayerControlsComponent } from './ecs/component/player-controls-component';
import {
  drawBackground, drawClock, drawDebugData, drawDebugGrid,
  drawEntityCharacter,
  drawEntityEnemy,
  drawEntityVision,
  drawGround, drawMinimap,
  drawPath, drawPointer,
  drawTree
} from './draw';
import { CELL_STATE } from './enums/cell-state.enum';
import { enemies } from './data/enemies';
import { CharacterEntity } from './ecs/entity';
import { imagesTrees, treesNew } from './data';

const start = performance.now();
const treeCells: number[] = treesNew;
const getRandomTreeImage = (): HTMLImageElement => imagesTrees[Math.floor(Math.random() * imagesTrees.length)];
const treeImages: { [key: number]: HTMLImageElement } = treeCells.reduce((acc, cellNumber) => ({...acc, [cellNumber]: getRandomTreeImage()}), {});

/**
 * Check if cell is in screen bounds
 */
const isWithinScreenBounds = (cellNumber: number) => {
  const playerCharacterPosition: PositionComponent = playerCharacter.getComponent<PositionComponent>('position');
  const visionRangeX: number = Math.round(gameState.cellsX * gameState.cameraDistance);
  const visionRangeY: number = Math.round(gameState.cellsY * gameState.cameraDistance);
  const inVisionVertically: boolean = Math.abs(Math.floor(cellNumber / gameState.cellsX) - Math.floor(playerCharacterPosition.cellNumber / gameState.cellsX)) - visionRangeX / gameState.cameraDistance <= visionRangeY;
  const inVisionHorizontally: boolean = Math.abs(Math.floor(cellNumber % gameState.cellsX) - Math.floor(playerCharacterPosition.cellNumber % gameState.cellsX)) - visionRangeY / gameState.cameraDistance <= visionRangeX;
  return inVisionVertically && inVisionHorizontally;
};

function draw(tick: number) {
  const playerCharacterPosition: PositionComponent = playerCharacter.getComponent<PositionComponent>('position');
  const playerCharacterMovement: MovementComponent = playerCharacter.getComponent<MovementComponent>('movement');
  const playerCharacterVision: VisionComponent = playerCharacter.getComponent<VisionComponent>('vision');
  const playerCharacterControls: PlayerControlsComponent = playerCharacter.getComponent<PlayerControlsComponent>('playerControls');

  gameState.setCtxScale(playerCharacterPosition);

  drawBackground('hsla(100, 100%, 75%, .5)');

  /**
   * NOTE: Need to draw ground and another objects using separate loops to avoid ground overlapping objects
   */
  for (let cellNumber: number = 0; cellNumber < gameState.cells.length; cellNumber++) {
    if (isWithinScreenBounds(cellNumber)) drawGround(cellNumber)
  }

  drawPath(playerCharacterMovement.path);

  for (let cellNumber: number = 0; cellNumber < gameState.cells.length; cellNumber++) {
    if (isWithinScreenBounds(cellNumber)) {
      const cellState: number = gameState.cells[cellNumber];
      if (gameState.ignoreVision || playerCharacterVision.exploredCells.includes(cellNumber)) {
        if (cellState === CELL_STATE.BLOCKED) drawTree(treeImages, cellNumber, playerCharacterPosition);
      }

      if (cellNumber === playerCharacterPosition.cellNumber) drawEntityCharacter(playerCharacter);

      enemies.forEach((enemy: CharacterEntity) => {
        const enemyPosition: PositionComponent = enemy.getComponent<PositionComponent>('position');
        if (
          cellNumber === enemyPosition.cellNumber
          && (gameState.ignoreVision || playerCharacterVision.visibleCells.includes(cellNumber))
        ) drawEntityEnemy(enemy);
      });
    }
  }

  let maxVisionPx: number = gameState.dayTimeVisionRadius * gameState.cellSize;
  let visiblePercent: number = playerCharacterVision.visionRadiusPx / maxVisionPx;
  let alpha: number = .4 + (.2 / visiblePercent);
  drawEntityVision(treeCells, playerCharacter, `rgba(0, 0, 0, ${alpha})`);

  drawPointer(playerCharacterControls.mouseOver, tick);

  drawDebugGrid();

  /**
   * Resetting scale to draw unscalable elements (eg. HUD)
   */
  gameState.restoreCtxScale();

  drawClock();
  drawMinimap(gameState.cameraDistance, playerCharacter);
  drawDebugData({
    FPS: Math.round(tick / ((performance.now() - start) / 1000)),
  });
}

export function gameRenderLoop(tick: number) {
  draw(tick);
  window.requestAnimationFrame(gameRenderLoop);
}
