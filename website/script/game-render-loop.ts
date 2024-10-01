import { MovementComponent, PlayerControlsComponent, PositionComponent, VisionComponent } from './ecs/component';
import { playerStorage } from './data/player-storage';
import { gameState } from './game-state';
import {
  drawBackground,
  drawClock,
  drawDebugData,
  drawDebugGrid,
  drawEntityCharacter,
  drawEntityEnemy,
  drawEntityVision,
  drawGround, drawMinimap,
  drawPath, drawPointer,
  drawTree
} from './draw';
import { CELL_STATE } from './enums/cell-state.enum';
import { enemiesStorage } from './data/enemies-storage';
import { CharacterEntity } from './ecs/entity';
import { imagesTrees, treesNew } from './data';
import { ComponentKey } from './enums/component-key.enum';

const start = performance.now();
const treeCells: number[] = treesNew;
const getRandomTreeImage = (): HTMLImageElement => imagesTrees[Math.floor(Math.random() * imagesTrees.length)];
const treeImages: { [key: number]: HTMLImageElement } = treeCells.reduce((acc, cellNumber) => ({...acc, [cellNumber]: getRandomTreeImage()}), {});

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
  const playerCharacterControls: PlayerControlsComponent = playerStorage.playerCharacter.getComponent(ComponentKey.PLAYER_CONTROLS);

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
      const cellState: CELL_STATE = gameState.cells[cellNumber];
      if (gameState.ignoreVision || playerCharacterVision.exploredCells.includes(cellNumber)) {
        if (cellState === CELL_STATE.BLOCKED) drawTree(treeImages, cellNumber, playerCharacterPosition);
      }

      if (cellNumber === playerCharacterPosition.cellNumber) drawEntityCharacter(playerStorage.playerCharacter);

      enemiesStorage.enemies.forEach((enemy: CharacterEntity) => {
        const enemyPosition: PositionComponent = enemy.getComponent(ComponentKey.POSITION);
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
  drawEntityVision(treeCells, playerStorage.playerCharacter, `rgba(0, 0, 0, ${alpha})`);

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
