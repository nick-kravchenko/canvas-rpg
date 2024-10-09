import { CellStateEnum } from '../types/cell-state.enum';
import { gameState } from '../game-state';
import { GameObject } from '../entities';
import { MovementComponent, PlayerControlsComponent, PositionComponent } from '../components';
import { DirectionKeyCodes } from '../types/direction-key-codes.enum';
import { ComponentKey } from '../types/component-key.enum';

export function getNextCharacterPositionByCellNumber(character: GameObject): number {
  const { cells, cellsX, cellsY} = gameState;
  const position: PositionComponent = character.getComponent(ComponentKey.POSITION);
  const movement: MovementComponent = character.getComponent(ComponentKey.MOVEMENT);
  const playerControls: PlayerControlsComponent = character.getComponent(ComponentKey.PLAYER_CONTROLS);

  if (movement.path.length) {
    return movement.path.find((cellNumber: number) => cellNumber !== position.cellNumber) || movement.path[0];
  }
  if (playerControls && playerControls.pressedKey) {
    const neighbors: { [key: string]: number } = {};
    if (position.cellNumber >= cellsX) neighbors['top'] = (position.cellNumber - cellsX);
    if ((position.cellNumber + 1) % cellsX) neighbors['right'] = (position.cellNumber + 1);
    if (position.cellNumber % cellsX) neighbors['left'] = (position.cellNumber - 1);
    if (position.cellNumber < ((cellsX * cellsY) - cellsY)) neighbors['bottom'] = (position.cellNumber + cellsX);

    if (cells[neighbors.top] === CellStateEnum.BLOCKED) delete neighbors['top'];
    if (cells[neighbors.left] === CellStateEnum.BLOCKED) delete neighbors['left'];
    if (cells[neighbors.bottom] === CellStateEnum.BLOCKED) delete neighbors['bottom'];
    if (cells[neighbors.right] === CellStateEnum.BLOCKED) delete neighbors['right'];

    switch (playerControls.pressedKey) {
      case DirectionKeyCodes.KeyW:
      case DirectionKeyCodes.ArrowUp:
        if (neighbors.top) return neighbors['top'];
        break;
      case DirectionKeyCodes.KeyA:
      case DirectionKeyCodes.ArrowLeft:
        if (neighbors.left) return neighbors['left'];
        break;
      case DirectionKeyCodes.KeyS:
      case DirectionKeyCodes.ArrowDown:
        if (neighbors.bottom) return neighbors['bottom'];
        break;
      case DirectionKeyCodes.KeyD:
      case DirectionKeyCodes.ArrowRight:
        if (neighbors.right) return neighbors['right'];
        break;
    }
  }
  return position.cellNumber;
}
