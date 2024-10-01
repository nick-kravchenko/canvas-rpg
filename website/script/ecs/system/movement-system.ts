import { CharacterEntity } from '../entity';
import { MovementComponent, PlayerControlsComponent, PositionComponent } from '../component';
import { gameState } from '../../game-state';
import { CELL_STATE } from '../../enums/cell-state.enum';
import { getNeighbors, getNextCharacterPositionByCellNumber, getPath, getPixelCoordsByCellNumber } from '../../utils';
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

  moveEntity(movingEntity: CharacterEntity) {
    const { cellSize } = gameState;
    const position: PositionComponent = movingEntity.getComponent(ComponentKey.POSITION);
    const movement: MovementComponent = movingEntity.getComponent(ComponentKey.MOVEMENT);
    const playerControls: PlayerControlsComponent = movingEntity.getComponent(ComponentKey.PLAYER_CONTROLS);

    const newCharacterPosition: number = getNextCharacterPositionByCellNumber(movingEntity);
    const newCharacterPositionPx: [number, number] = getPixelCoordsByCellNumber(newCharacterPosition);

    const deltaX: number = newCharacterPositionPx[0] - position.coordsPx[0];
    const deltaY: number = newCharacterPositionPx[1] - position.coordsPx[1];

    if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
      const xSkew: number = Math.round(Math.sign(deltaX) * movement.speed);
      const ySkew: number = Math.round(Math.sign(deltaY) * movement.speed);
      position.coordsPx[0] += xSkew;
      position.coordsPx[1] += ySkew;
    }

    if (Math.abs(deltaX) < cellSize * .75 && Math.abs(deltaY) < cellSize * .75) {
      position.cellNumber = newCharacterPosition;
      movement.path.shift(); // Move to the next cell in the path
    }

    if (DIRECTION_KEYS.includes(playerControls?.pressedKey)) {
      movement.path = []; // Clear the path if a key is pressed for manual movement
    }
  }

  moveToEntity(movingEntity: CharacterEntity, targetEntity: CharacterEntity) {
    const movingEntityPosition: PositionComponent = movingEntity.getComponent(ComponentKey.POSITION);
    const targetEntityPosition: PositionComponent = targetEntity.getComponent(ComponentKey.POSITION);

    const playerNeighbors: number[] = getNeighbors(targetEntityPosition.cellNumber)
      .filter((cellNumber: number) => {
        return gameState.cells[cellNumber] !== CELL_STATE.BLOCKED;
      });

    const closestNeighborPath: number[] = playerNeighbors.reduce((prevPath: number[]|null, cur: number) => {
      const newPath: number[] = getPath(movingEntityPosition.cellNumber, cur);
      return !prevPath || (newPath.length < prevPath.length) ?  newPath : prevPath;
    }, null);

    const isNearPlayer: boolean = playerNeighbors.includes(movingEntityPosition.cellNumber);

    if (isNearPlayer) { return; }

    if (closestNeighborPath?.length) {
      console.log('calling 2');
      movementSystem.setTargetCell(movingEntity, closestNeighborPath[closestNeighborPath.length  - 1]);
    }
  }
}

export const movementSystem: MovementSystem = new MovementSystem();
