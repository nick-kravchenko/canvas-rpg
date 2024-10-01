import { CharacterEntity } from '../ecs/entity';
import { gameState } from '../game-state';
import { getPixelCoordsByCellNumber } from '../utils';
import { DIRECTION } from '../enums/direction.enum';
import { ComponentKey } from '../enums/component-key.enum';

export const playerCharacter: CharacterEntity = new CharacterEntity();
playerCharacter.addComponent(ComponentKey.VISION, {
  visionRadiusCells: gameState.dayTimeVisionRadius,
  visionRadiusPx: gameState.dayTimeVisionRadius * gameState.cellSize,
  visibleCells: [],
  exploredCells: [],
});
playerCharacter.addComponent(ComponentKey.POSITION, {
  cellNumber: 272,
  coordsPx: getPixelCoordsByCellNumber(272),
});
playerCharacter.addComponent(ComponentKey.MOVEMENT, {
  targetCell: null,
  path: [],
  speed: 2,
});
playerCharacter.addComponent(ComponentKey.DIRECTION, {
  direction: DIRECTION.DOWN,
});
playerCharacter.addComponent(ComponentKey.PLAYER_CONTROLS, {
  pressedKey: null,
  mouseOver: null,
});
