import { CELL_STATE } from '../enums/cell-state.enum';
import { gameState } from '../game-state';
import { CharacterEntity } from '../ecs/entity';
import { MovementComponent, PositionComponent } from '../ecs/component';
import { PlayerControlsComponent } from '../ecs/component/player-controls-component';
import { DirectionKeyCodes } from '../enums/direction-key-codes.enum';

export function getNextCharacterPositionByCellNumber(character: CharacterEntity): number {
  const { cells, cellsX, cellsY} = gameState;
  const position: PositionComponent = character.getComponent<PositionComponent>('position');
  const movement: MovementComponent = character.getComponent<MovementComponent>('movement');
  const playerControls: PlayerControlsComponent = character.getComponent<PlayerControlsComponent>('playerControls');

  if (movement.path.length) {
    return movement.path.find((cellNumber: number) => cellNumber !== position.cellNumber) || movement.path[0];
  }
  if (playerControls && playerControls.pressedKey) {
    let neighbors: { [key: string]: number } = {};
    if (position.cellNumber >= cellsX) neighbors['top'] = (position.cellNumber - cellsX);
    if ((position.cellNumber + 1) % cellsX) neighbors['right'] = (position.cellNumber + 1);
    if (position.cellNumber % cellsX) neighbors['left'] = (position.cellNumber - 1);
    if (position.cellNumber < ((cellsX * cellsY) - cellsY)) neighbors['bottom'] = (position.cellNumber + cellsX);

    if (cells[neighbors.top] === CELL_STATE.BLOCKED) delete neighbors['top'];
    if (cells[neighbors.left] === CELL_STATE.BLOCKED) delete neighbors['left'];
    if (cells[neighbors.bottom] === CELL_STATE.BLOCKED) delete neighbors['bottom'];
    if (cells[neighbors.right] === CELL_STATE.BLOCKED) delete neighbors['right'];

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
