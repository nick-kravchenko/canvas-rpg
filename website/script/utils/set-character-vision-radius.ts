import { updateCharacterVision } from './update-character-vision';
import { Character } from '../types/character';

export function setCharacterVisionRadius(cells: Int8Array, cellsX: number, cellSize: number, blockedCells: number[], character: Character, newVisionRadius: number) {
  if (newVisionRadius !== character.visionRadius) {
    character.visionRadius += newVisionRadius > character.visionRadius ? 1 : -1;
    updateCharacterVision(cells, blockedCells, cellsX, cellSize, character);
    if (newVisionRadius !== character.visionRadius) {
      setTimeout(() => {
        setCharacterVisionRadius(cells, cellsX, cellSize, blockedCells, character, newVisionRadius);
      }, 200);
    }
  }
}
