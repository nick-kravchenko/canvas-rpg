import { CharacterEntity } from '../ecs/entity';
import { gameState } from '../game-state';
import { getPixelCoordsByCellNumber } from '../utils';
import { DIRECTION } from '../enums/direction.enum';
import { ComponentKey } from '../enums/component-key.enum';

class PlayerStorage {
  private static instance: PlayerStorage;
  public playerCharacter: CharacterEntity;

  private constructor() {
    this.playerCharacter = new CharacterEntity();
    this.initializePlayer();
  }

  // Initialize player components
  private initializePlayer() {
    this.playerCharacter.addComponent(ComponentKey.VISION, {
      visionRadiusCells: gameState.dayTimeVisionRadius,
      visionRadiusPx: gameState.dayTimeVisionRadius * gameState.cellSize,
      visibleCells: [],
      exploredCells: [],
    });

    this.playerCharacter.addComponent(ComponentKey.POSITION, {
      cellNumber: 272,
      coordsPx: getPixelCoordsByCellNumber(272),
    });

    this.playerCharacter.addComponent(ComponentKey.MOVEMENT, {
      targetCell: null,
      path: [],
      speed: 2,
    });

    this.playerCharacter.addComponent(ComponentKey.DIRECTION, {
      direction: DIRECTION.DOWN,
    });

    this.playerCharacter.addComponent(ComponentKey.PLAYER_CONTROLS, {
      pressedKey: null,
      mouseOver: null,
      mouseCoords: null,
    });
  }

  // Get the Singleton instance
  public static getInstance(): PlayerStorage {
    if (!PlayerStorage.instance) {
      PlayerStorage.instance = new PlayerStorage();
    }
    return PlayerStorage.instance;
  }

  // Optional: Method to reset the player (e.g., on game restart)
  public resetPlayer() {
    this.initializePlayer();
  }
}

// Export the singleton instance
export const playerStorage = PlayerStorage.getInstance();
