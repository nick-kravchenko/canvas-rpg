import { Character } from '../types/character';
import { gameState } from '../game-state';

export function setCharacterVisionRadiusPx(character: Character, newVisionRadius: number) {
  const {
    cellSize,
  } = gameState;

  if (newVisionRadius !== character.visionRadiusPx) {
    character.visionRadiusPx += newVisionRadius > character.visionRadiusPx ? 1 : -1;
    if (newVisionRadius !== character.visionRadiusPx) {
      setTimeout(() => {
        setCharacterVisionRadiusPx(character, newVisionRadius);
      }, 256 / cellSize);
    }
  }
}
