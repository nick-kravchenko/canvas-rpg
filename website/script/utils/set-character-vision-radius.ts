import { Character } from '../types/character';

export function setCharacterVisionRadius(character: Character, newVisionRadius: number) {
  if (newVisionRadius !== character.visionRadius) {
    character.visionRadius += newVisionRadius > character.visionRadius ? 1 : -1;
    if (newVisionRadius !== character.visionRadius) {
      setTimeout(() => {
        setCharacterVisionRadius(character, newVisionRadius);
      }, 256);
    }
  }
}
