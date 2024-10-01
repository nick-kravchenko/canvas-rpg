import { CharacterEntity } from '../ecs/entity';
import { getPixelCoordsByCellNumber } from '../utils';
import { DIRECTION } from '../enums/direction.enum';
import { gameState } from '../game-state';
import { Npc } from '../types/npc';
import {
  DirectionComponent,
  MovementComponent,
  NpcAnchorComponent,
  PositionComponent,
  VisionComponent
} from '../ecs/component';

export const enemies: CharacterEntity[] = [
  {
    position: 66,
    positionPx: getPixelCoordsByCellNumber(66),
    target: 0,
    path: [],
    explored: [],
    visible: [],
    direction: DIRECTION.DOWN,
    speed: 1,
    visionRadius: 5,
    visionRadiusPx: 5 * gameState.cellSize,
    anchorPosition: 66,
    wanderingRadius: 4,
  },
  {
    position: 386,
    positionPx: getPixelCoordsByCellNumber(386),
    target: 0,
    path: [],
    explored: [],
    visible: [],
    direction: DIRECTION.DOWN,
    speed: 1.33,
    visionRadius: 5,
    visionRadiusPx: 5 * gameState.cellSize,
    anchorPosition: 386,
    wanderingRadius: 4,
  },
  {
    position: 222,
    positionPx: getPixelCoordsByCellNumber(222),
    target: 0,
    path: [],
    explored: [],
    visible: [],
    direction: DIRECTION.DOWN,
    speed: 1.66,
    visionRadius: 5,
    visionRadiusPx: 5 * gameState.cellSize,
    anchorPosition: 222,
    wanderingRadius: 4,
  },
].map((enemyData: Npc) => {
  const enemyEntity: CharacterEntity = new CharacterEntity();

  enemyEntity.addComponent('vision', {
    visionRadiusCells: enemyData.visionRadius,
    visionRadiusPx: enemyData.visionRadiusPx,
    visibleCells: enemyData.visible,
    exploredCells: enemyData.explored,
  } as VisionComponent);

  enemyEntity.addComponent('position', {
    cellNumber: enemyData.position,
    coordsPx: enemyData.positionPx,
  } as PositionComponent);

  enemyEntity.addComponent('movement', {
    targetCell: enemyData.target,
    pressedKey: null, // NPCs may not have key presses
    path: enemyData.path,
    speed: enemyData.speed,
  } as MovementComponent);

  enemyEntity.addComponent('direction', {
    direction: enemyData.direction,
  } as DirectionComponent);

  enemyEntity.addComponent('npcAnchor', {
    cellNumber: enemyData.anchorPosition,
    radiusCells: enemyData.wanderingRadius,
  } as NpcAnchorComponent);

  return enemyEntity;
});
