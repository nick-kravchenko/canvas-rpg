import { Character } from '../types/character';

export function setCharacterVisionRadiusPx(cells: Int8Array, cellsX: number, cellSize: number, blockedCells: number[], character: Character, newVisionRadius: number) {
  if (newVisionRadius !== character.visionRadiusPx) {
    character.visionRadiusPx += newVisionRadius > character.visionRadiusPx ? 1 : -1;
    if (newVisionRadius !== character.visionRadiusPx) {
      setTimeout(() => {
        setCharacterVisionRadiusPx(cells, cellsX, cellSize, blockedCells, character, newVisionRadius);
      }, 200 / cellSize);
    }
  }
}
