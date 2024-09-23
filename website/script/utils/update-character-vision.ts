import { Character } from '../types/character';

// fuck chat-gpt
// export function updateCharacterVision(cells: Int8Array, cellsX: number, blockedCells: number[], character: Character): void {
//   getCharacterVisionCircle(character.position, cells, cellsX, character.visionRadius).forEach((cellNumber) => {
//     if (!character.explored.includes(cellNumber)) character.explored.push(cellNumber);
//   });
//   getCharacterVisionCircleTrees(character.position, cellsX, character.visionRadius, blockedCells).forEach((cellNumber) => {
//     if (!character.explored.includes(cellNumber)) character.explored.push(cellNumber);
//   });
// }

export function updateCharacterVision(cells: Int8Array, cellsX: number, character: Character) {
  const isGood = (number: number) => {
    return (Math.abs(Math.floor(number / cellsX) - Math.floor(character.position / cellsX)) < character.visionRadius)
      && (Math.abs(Math.floor(number % cellsX) - Math.floor(character.position % cellsX)) < character.visionRadius)
  }
  for (let i: number = 0; i < cells.length; i++) {
    if (isGood(i) && !character.explored.includes(i)) {
      character.explored.push(i);
    }
  }
}
