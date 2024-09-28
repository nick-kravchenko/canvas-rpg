import { getNextCharacterPositionByCellNumber } from './get-next-character-position-by-cell-number';
import { getCanvasCoordsByCellNumber } from './get-canvas-coords-by-cell-number';
import { DirectionKeyCodes } from '../enums/direction-key-codes.enum';
import { Character } from '../types/character';

const DIRECTION_KEYS: string[] = [
  DirectionKeyCodes.KeyW,
  DirectionKeyCodes.ArrowUp,
  DirectionKeyCodes.KeyA,
  DirectionKeyCodes.ArrowLeft,
  DirectionKeyCodes.KeyS,
  DirectionKeyCodes.ArrowDown,
  DirectionKeyCodes.KeyD,
  DirectionKeyCodes.ArrowRight,
];

export function moveCharacter(cells: Int8Array, cellsX: number, cellsY: number, cellSize: number, character: Character, pressedKey: string) {
  const newCharacterPosition: number = getNextCharacterPositionByCellNumber(cells, cellsX, cellsY, character.path, pressedKey, character.position, character.direction);
  const newCharacterPositionPx: [number, number] = getCanvasCoordsByCellNumber(newCharacterPosition, cellsX, cellSize);
  const deltaX: number = Math.abs(character.positionPx[0] - newCharacterPositionPx[0]);
  const deltaY: number = Math.abs(character.positionPx[1] - newCharacterPositionPx[1]);
  if (deltaX > 1 || deltaY > 1) {
    character.positionPx = [
      character.positionPx[0] + (newCharacterPositionPx[0] > character.positionPx[0] ? character.speed : newCharacterPositionPx[0] < character.positionPx[0] ? -character.speed : 0),
      character.positionPx[1] + (newCharacterPositionPx[1] > character.positionPx[1] ? character.speed : newCharacterPositionPx[1] < character.positionPx[1] ? -character.speed : 0),
    ];
  }
  if (deltaX < cellSize * .75 && deltaY < cellSize * .75) {
    character.position = newCharacterPosition;
    character.path.shift();
  }
  if (DIRECTION_KEYS.includes(pressedKey)) {
    character.path = [];
  }
}
