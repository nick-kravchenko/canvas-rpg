import { CharacterEntity } from '../ecs/entity';
import { getPixelCoordsByCellNumber } from '../utils';
import { DIRECTION } from '../enums/direction.enum';
import { gameState } from '../game-state';
import { Npc } from '../types/npc';
import { ComponentKey } from '../enums/component-key.enum';

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

  enemyEntity.addComponent(ComponentKey.VISION, {
    visionRadiusCells: enemyData.visionRadius,
    visionRadiusPx: enemyData.visionRadiusPx,
    visibleCells: enemyData.visible,
    exploredCells: enemyData.explored,
  });

  enemyEntity.addComponent(ComponentKey.POSITION, {
    cellNumber: enemyData.position,
    coordsPx: enemyData.positionPx,
  });

  enemyEntity.addComponent(ComponentKey.MOVEMENT, {
    targetCell: enemyData.target,
    path: enemyData.path,
    speed: enemyData.speed,
  });

  enemyEntity.addComponent(ComponentKey.DIRECTION, {
    direction: enemyData.direction,
  });

  enemyEntity.addComponent(ComponentKey.NPC_ANCHOR, {
    cellNumber: enemyData.anchorPosition,
    radiusCells: enemyData.wanderingRadius,
  });

  return enemyEntity;
});
