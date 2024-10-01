import { CharacterEntity } from './ecs/entity';
import { MovementComponent, NpcAnchorComponent, PositionComponent, VisionComponent } from './ecs/component';
import { getNeighbors, getPath } from './utils';
import { gameState } from './game-state';
import { CELL_STATE } from './enums/cell-state.enum';
import { movementSystem, visionSystem } from './ecs/system';
import { playerCharacter } from './data/player';
import { enemies } from './data/enemies';
import { treesNew } from './data';

const treeCells: number[] = treesNew;

/**
 * Forces npc to chase player.
 */
function chasePlayer(npc: CharacterEntity, targetPosition: PositionComponent) {
  const npcPosition: PositionComponent = npc.getComponent<PositionComponent>('position');

  const playerNeighbors: number[] = getNeighbors(targetPosition.cellNumber)
    .filter((cellNumber: number) => gameState.cells[cellNumber] !== CELL_STATE.BLOCKED);

  const closestNeighborPath: number[] = playerNeighbors.reduce((prevPath: number[]|null, cur: number) => {
    const newPath: number[] = getPath(npcPosition.cellNumber, cur);
    return !prevPath || (newPath.length < prevPath.length) ?  newPath : prevPath;
  }, null);

  if (closestNeighborPath && typeof closestNeighborPath[0] === 'number' && closestNeighborPath.length) {
    movementSystem.setTargetCell(npc, closestNeighborPath[closestNeighborPath.length  - 1]);
  }
}

export function gameTimerLoop() {
  const playerCharacterPosition: PositionComponent = playerCharacter.getComponent<PositionComponent>('position');
  /**
   * Update game time
   */
  gameState.setTime(gameState.time + gameState.gameTickRate);

  /**
   * Implement day/night cycle. Updating the player's vision radius according to the time of day
   */
  let newIsNight: boolean = (gameState.time % gameState.dayNightCycle) >= gameState.dayNightCycle / 2;
  if (gameState.isNight !== newIsNight) {
    gameState.setIsNight(newIsNight);
    const newCellsVisionRadius: number = newIsNight ? gameState.nightTimeVisionRadius : gameState.dayTimeVisionRadius;
    const newPxVisionRadius: number = newCellsVisionRadius * gameState.cellSize;
    visionSystem.setCharacterVisionRadius(playerCharacter, newCellsVisionRadius);
    visionSystem.setCharacterVisionRadiusPx(playerCharacter, newPxVisionRadius);
  }

  /**
   * Enemies movement/vision/chase behavior
   */
  for (let enemy of enemies) {
    const enemyVision: VisionComponent = enemy.getComponent<VisionComponent>('vision');
    const enemyMovement: MovementComponent = enemy.getComponent<MovementComponent>('movement');
    const enemyNpcAnchor: NpcAnchorComponent = enemy.getComponent<NpcAnchorComponent>('npcAnchor')
    const enemyPosition: PositionComponent = enemy.getComponent<PositionComponent>('position');

    if (enemyVision.visibleCells.includes(playerCharacterPosition.cellNumber)) chasePlayer(enemy, playerCharacterPosition);
    if (
      !enemyMovement.path.length
      && !enemyVision.visibleCells.includes(playerCharacterPosition.cellNumber)
      && enemyNpcAnchor.cellNumber !== enemyPosition.cellNumber
    ) {
      movementSystem.setTargetCell(enemy, enemyNpcAnchor.cellNumber);
    }
  }

  movementSystem.update([playerCharacter, ...enemies]);
  visionSystem.update([playerCharacter, ...enemies], treeCells);

  /**
   * Call gameLoop recursively in gameTickRate ms
   */
  const timeout = setTimeout(() => {
    gameTimerLoop();
    clearTimeout(timeout);
  }, gameState.gameTickRate);
}
