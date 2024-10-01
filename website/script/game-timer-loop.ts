import { gameState } from './game-state';
import { movementSystem, visionSystem } from './ecs/system';
import { playerCharacter } from './data/player';
import { enemies } from './data/enemies';
import { treesNew } from './data';
import { aiSystem } from './ecs/system/ai-system';

export function gameTimerLoop() {
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
   * Enemies behavior and movement
   */
  aiSystem.update(enemies, playerCharacter);

  /**
   * Update movement and vision systems
   */
  movementSystem.update([playerCharacter, ...enemies]);
  visionSystem.update([playerCharacter, ...enemies], treesNew);

  /**
   * Call gameLoop recursively in gameTickRate ms
   */
  const timeout = setTimeout(() => {
    gameTimerLoop();
    clearTimeout(timeout);
  }, gameState.gameTickRate);
}
