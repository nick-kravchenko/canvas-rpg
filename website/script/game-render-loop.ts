import { MovementComponent, PositionComponent, VisionComponent } from './components';
import { playerStorage } from './data/player-storage';
import { gameState } from './game-state';
import {
  drawBackground,
  drawClock,
  drawDebugData,
  drawDebugGrid,
  drawCharacter,
  drawEnemy,
  drawVision,
  drawGround, drawMinimap,
  drawPath, drawPointer,
  drawTree
} from './draw';
import { CellStateEnum } from './types/cell-state.enum';
import { enemiesStorage } from './data/enemies-storage';
import { GameObject } from './entities';
import { imagesTrees, treesNew } from './data';
import { ComponentKey } from './types/component-key.enum';

const treeCells: Set<number> = treesNew;
const getRandomTreeImage = (): HTMLImageElement => imagesTrees[Math.floor(Math.random() * imagesTrees.length)];
const treeImages: { [key: number]: HTMLImageElement } = Array.from(treeCells).reduce((acc, cellNumber) => ({...acc, [cellNumber]: getRandomTreeImage()}), {});

/**
 * Check if cell is in screen bounds
 */
const isWithinScreenBounds = (cellNumber: number) => {
  const playerCharacterPosition: PositionComponent = playerStorage.playerCharacter.getComponent(ComponentKey.POSITION);
  const visionRangeX: number = Math.round(gameState.cellsX * gameState.cameraDistance);
  const visionRangeY: number = Math.round(gameState.cellsY * gameState.cameraDistance);
  const inVisionVertically: boolean = Math.abs(Math.floor(cellNumber / gameState.cellsX) - Math.floor(playerCharacterPosition.cellNumber / gameState.cellsX)) - visionRangeX / gameState.cameraDistance <= visionRangeY;
  const inVisionHorizontally: boolean = Math.abs(Math.floor(cellNumber % gameState.cellsX) - Math.floor(playerCharacterPosition.cellNumber % gameState.cellsX)) - visionRangeY / gameState.cameraDistance <= visionRangeX;
  return inVisionVertically && inVisionHorizontally;
};

function draw(tick: number) {
  const playerCharacterPosition: PositionComponent = playerStorage.playerCharacter.getComponent(ComponentKey.POSITION);
  const playerCharacterMovement: MovementComponent = playerStorage.playerCharacter.getComponent(ComponentKey.MOVEMENT);
  const playerCharacterVision: VisionComponent = playerStorage.playerCharacter.getComponent(ComponentKey.VISION);

  gameState.frame += 1;
  gameState.debug = { FPS: ~~(gameState.frame / (performance.now() / 1000)) }
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
      const cellState: CellStateEnum = gameState.cells[cellNumber];
      if (gameState.ignoreVision || (playerCharacterVision.exploredCells.includes(cellNumber) && !playerCharacterVision.visibleCells.includes(cellNumber))) {
        if (cellState === CellStateEnum.BLOCKED) drawTree(treeImages, cellNumber, playerCharacterPosition);
      }


      enemiesStorage.enemies.forEach((enemy: GameObject) => {
        const enemyPosition: PositionComponent = enemy.getComponent(ComponentKey.POSITION);
        if (
          cellNumber === enemyPosition.cellNumber
          && (gameState.ignoreVision || playerCharacterVision.visibleCells.includes(cellNumber))
        ) drawEnemy(enemy);
      });
    }
  }

  const maxVisionPx: number = gameState.dayTimeVisionRadius * gameState.cellSize;
  const visiblePercent: number = playerCharacterVision.visionRadiusPx / maxVisionPx;
  const alpha: number = .4 + (.2 / visiblePercent);
  drawVision(playerStorage.playerCharacter, `rgba(0, 0, 0, ${alpha})`);

  for (let cellNumber: number = 0; cellNumber < gameState.cells.length; cellNumber++) {
    const cellState: CellStateEnum = gameState.cells[cellNumber];
    if (gameState.ignoreVision || playerCharacterVision.visibleCells.includes(cellNumber)) {
      if (cellState === CellStateEnum.BLOCKED) drawTree(treeImages, cellNumber, playerCharacterPosition);
      drawCharacter(playerStorage.playerCharacter);
    }
  }

  drawPointer(playerStorage.playerCharacter, tick);

  drawDebugGrid();

  /**
   * Resetting scale to draw unscalable elements (eg. HUD)
   */
  gameState.restoreCtxScale();

  drawClock();
  drawMinimap(gameState.cameraDistance, playerStorage.playerCharacter);
  drawDebugData();
}

export function gameRenderLoop(tick: number) {
  draw(tick);
  window.requestAnimationFrame(gameRenderLoop);
}
