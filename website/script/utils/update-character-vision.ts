import { Character } from '../types/character';

export function updateCharacterVision(cells: Int8Array, cellsX: number, character: Character) {
  function calculateDistance(position1: number, position2: number) {
    const dx: number = Math.abs(Math.floor(position1 / cellsX) - Math.floor(position2 / cellsX));
    const dy: number = Math.abs(Math.floor(position1 % cellsX) - Math.floor(position2 % cellsX));
    return Math.round(Math.sqrt(dx**2 + dy**2));
  }
  character.visible = [];
  for (let i: number = 0; i < cells.length; i++) {
    if (!character.explored.includes(i) && calculateDistance(character.position, i) < character.visionRadius) {
      character.explored.push(i);
    }
    if (calculateDistance(character.position, i) < character.visionRadius) {
      character.visible.push(i);
    }
  }
}
