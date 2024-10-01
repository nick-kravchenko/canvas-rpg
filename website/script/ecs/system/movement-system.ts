import { CharacterEntity } from '../entity';
import { MovementComponent, PlayerControlsComponent, PositionComponent } from '../component';
import { gameState } from '../../game-state';
import { CELL_STATE } from '../../enums/cell-state.enum';
import { getNextCharacterPositionByCellNumber, getPath, getPixelCoordsByCellNumber } from '../../utils';
import { DirectionKeyCodes } from '../../enums/direction-key-codes.enum';
import { ComponentKey } from '../../enums/component-key.enum';

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

class MovementSystem {
  update(entities: CharacterEntity[]) {
    entities.forEach(entity => {
      this.moveEntity(entity);
    });
  }

  // Handle setting the target cell and calculating the path
  setTargetCell(entity: CharacterEntity, targetCell: number|null) {
    const position: PositionComponent = entity.getComponent(ComponentKey.POSITION);
    const movement: MovementComponent = entity.getComponent(ComponentKey.MOVEMENT);
    if (position && movement && targetCell !== null && position.cellNumber !== targetCell && gameState.cells[targetCell] !== CELL_STATE.BLOCKED) {
      const newPath = getPath(position.cellNumber, targetCell);
      if (newPath && newPath.length) {
        movement.path = newPath;
        movement.targetCell = targetCell;
      }
    } else {
      movement.path = [];
      movement.targetCell = targetCell;
    }
  }

  moveEntity(entity: CharacterEntity) {
    const { cellSize } = gameState;
    const position: PositionComponent = entity.getComponent(ComponentKey.POSITION);
    const movement: MovementComponent = entity.getComponent(ComponentKey.MOVEMENT);
    const playerControls: PlayerControlsComponent = entity.getComponent(ComponentKey.PLAYER_CONTROLS);

    const newCharacterPosition: number = getNextCharacterPositionByCellNumber(entity);
    const newCharacterPositionPx: [number, number] = getPixelCoordsByCellNumber(newCharacterPosition);

    const deltaX: number = Math.abs(position.coordsPx[0] - newCharacterPositionPx[0]);
    const deltaY: number = Math.abs(position.coordsPx[1] - newCharacterPositionPx[1]);

    if (deltaX > 1 || deltaY > 1) {
      position.coordsPx = [
        Math.round(position.coordsPx[0] + (newCharacterPositionPx[0] > position.coordsPx[0] ? movement.speed : newCharacterPositionPx[0] < position.coordsPx[0] ? -movement.speed : 0)),
        Math.round(position.coordsPx[1] + (newCharacterPositionPx[1] > position.coordsPx[1] ? movement.speed : newCharacterPositionPx[1] < position.coordsPx[1] ? -movement.speed : 0)),
      ];
    }

    if (deltaX < cellSize * .75 && deltaY < cellSize * .75) {
      position.cellNumber = newCharacterPosition;
      movement.path.shift(); // Move to the next cell in the path
    }

    if (DIRECTION_KEYS.includes(playerControls?.pressedKey)) {
      movement.path = []; // Clear the path if a key is pressed for manual movement
    }
  }
}

export const movementSystem: MovementSystem = new MovementSystem();
