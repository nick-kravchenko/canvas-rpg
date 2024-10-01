import { CharacterEntity } from '../ecs/entity';
import { gameState } from '../game-state';
import { DirectionComponent, MovementComponent, PositionComponent, VisionComponent } from '../ecs/component';
import { getPixelCoordsByCellNumber } from '../utils';
import { DIRECTION } from '../enums/direction.enum';
import { PlayerControlsComponent } from '../ecs/component/player-controls-component';

export const playerCharacter: CharacterEntity = new CharacterEntity();
playerCharacter.addComponent('vision', {
  visionRadiusCells: gameState.dayTimeVisionRadius,
  visionRadiusPx: gameState.dayTimeVisionRadius * gameState.cellSize,
  visibleCells: [],
  exploredCells: [],
} as VisionComponent);
playerCharacter.addComponent('position', {
  cellNumber: 272,
  coordsPx: getPixelCoordsByCellNumber(272),
} as PositionComponent);
playerCharacter.addComponent('movement', {
  targetCell: null,
  pressedKey: null,
  path: [],
  speed: 2,
} as MovementComponent);
playerCharacter.addComponent('direction', {
  direction: DIRECTION.DOWN,
} as DirectionComponent);
playerCharacter.addComponent('playerControls', {
  pressedKey: null,
  mouseOver: null,
} as PlayerControlsComponent);
