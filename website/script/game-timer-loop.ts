import { gameState } from './game-state';
import { aiSystem, movementSystem, visionSystem } from './systems';
import { playerStorage } from './data/player-storage';
import { enemiesStorage } from './data/enemies-storage';
import { treesNew } from './data';

export function gameTimerLoop() {
  /**
   * Update game time
   */
  gameState.setTime(gameState.time + gameState.gameTickRate);

  /**
   * Implement day/night cycle. Updating the player's vision radius according to the time of day
   */
  const newIsNight: boolean = (gameState.time % gameState.dayNightCycle) >= gameState.dayNightCycle / 2;
  if (gameState.isNight !== newIsNight) {
    gameState.setIsNight(newIsNight);
    const newCellsVisionRadius: number = newIsNight ? gameState.nightTimeVisionRadius : gameState.dayTimeVisionRadius;
    const newPxVisionRadius: number = newCellsVisionRadius * gameState.cellSize;
    visionSystem.setCharacterVisionRadius(playerStorage.playerCharacter, newCellsVisionRadius);
    visionSystem.setCharacterVisionRadiusPx(playerStorage.playerCharacter, newPxVisionRadius);
  }

  /**
   * Enemies behavior and movement
   */
  aiSystem.update(enemiesStorage.enemies, playerStorage.playerCharacter);

  /**
   * Update movement and vision systems
   */
  movementSystem.update([playerStorage.playerCharacter, ...enemiesStorage.enemies]);
  visionSystem.update([playerStorage.playerCharacter, ...enemiesStorage.enemies], treesNew);

  /**
   * Call gameLoop recursively in gameTickRate ms
   */
  const timeout = setTimeout(() => {
    gameTimerLoop();
    clearTimeout(timeout);
  }, gameState.gameTickRate);
}
