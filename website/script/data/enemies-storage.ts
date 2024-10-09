import { GameObject } from '../entities';
import { getPixelCoordsByCellNumber } from '../utils';
import { DIRECTION } from '../enums/direction.enum';
import { gameState } from '../game-state';
import { ComponentKey } from '../enums/component-key.enum';

class EnemiesStorage {
  private static instance: EnemiesStorage;
  public enemies: GameObject[];

  private constructor() {
    this.enemies = this.initializeEnemies();
  }

  // Initialize enemies data and map to CharacterEntities
  private initializeEnemies(): GameObject[] {
    const npcData: any[] = [
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
    ];

    // Map each NPC to a CharacterEntity
    return npcData.map((enemyData: any, index: number ) => {
      const enemyEntity: GameObject = new GameObject();

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
        speed: enemyData.speed,
        targetCell: enemyData.target,
        path: enemyData.path,
      });

      enemyEntity.addComponent(ComponentKey.DIRECTION, {
        direction: enemyData.direction,
      });

      enemyEntity.addComponent(ComponentKey.HEALTH, {
        max: 100,
        current: 100 - (10 * index),
        regenPerSecond: 1,
      });

      enemyEntity.addComponent(ComponentKey.NPC_ANCHOR, {
        cellNumber: enemyData.anchorPosition,
        radiusCells: enemyData.wanderingRadius,
      });

      return enemyEntity;
    });
  }

  // Access Singleton instance
  public static getInstance(): EnemiesStorage {
    if (!EnemiesStorage.instance) {
      EnemiesStorage.instance = new EnemiesStorage();
    }
    return EnemiesStorage.instance;
  }

  // Optional: You can add update or reset methods to modify the enemies during gameplay.
  public resetEnemies() {
    this.enemies = this.initializeEnemies();
  }
}

// Export the singleton instance
export const enemiesStorage = EnemiesStorage.getInstance();
