import { GameObject } from '../entities';
import { gameState } from '../game-state';
import { getPixelCoordsByCellNumber } from '../utils';
import { DIRECTION } from '../types/direction.enum';
import { ComponentKey } from '../types/component-key.enum';
import { CharacterStateEnum } from '../types/character-state.enum';

class PlayerStorage {
  private static instance: PlayerStorage;
  public playerCharacter: GameObject;

  private constructor() {
    this.playerCharacter = new GameObject();
    this.initializePlayer();
  }

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
      speed: 4,
      targetCell: null,
      path: [],
    });

    this.playerCharacter.addComponent(ComponentKey.DIRECTION, {
      direction: DIRECTION.DOWN,
    });

    this.playerCharacter.addComponent(ComponentKey.HEALTH, {
      max: 1000,
      current: 500,
      regenPerSecond: 1,
      ticks: [],
    });

    this.playerCharacter.addComponent(ComponentKey.PLAYER_CONTROLS, {
      pressedKey: null,
      mouseOver: null,
      mouseCoords: null,
    });

    this.playerCharacter.addComponent(ComponentKey.STATE, {
      state: CharacterStateEnum.IDLE,
    });

    // this.playerCharacter.addComponent(ComponentKey.ANIMATION, {
    //   state: 0,
    //   frame: 0,
    //   time: 0,
    //   duration: 0,
    // });
  }

  public static getInstance(): PlayerStorage {
    if (!PlayerStorage.instance) {
      PlayerStorage.instance = new PlayerStorage();
    }
    return PlayerStorage.instance;
  }

  public resetPlayer() {
    this.initializePlayer();
  }
}

export const playerStorage = PlayerStorage.getInstance();
