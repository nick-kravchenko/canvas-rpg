import { updateCharacterVision } from './update-character-vision';
import { Character } from '../types/character';

export function setCharacterVisionRadius(character: Character, blockedCells: number[], newVisionRadius: number) {
  if (newVisionRadius !== character.visionRadius) {
    character.visionRadius += newVisionRadius > character.visionRadius ? 1 : -1;
    updateCharacterVision(character, blockedCells);
    if (newVisionRadius !== character.visionRadius) {
      setTimeout(() => {
        setCharacterVisionRadius(character, blockedCells, newVisionRadius);
      }, 256);
    }
  }
}
