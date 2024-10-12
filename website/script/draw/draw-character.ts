import { getCharacterImageByDirection } from '../utils';
import { gameState } from '../game-state';
import { GameObject } from '../entities';
import { DirectionComponent, PositionComponent } from '../components';
import { ComponentKey } from '../types/component-key.enum';

export function drawCharacter(
  character: GameObject,
) {
  const position: PositionComponent = character.getComponent(ComponentKey.POSITION);
  const direction: DirectionComponent = character.getComponent(ComponentKey.DIRECTION);
  const {
    ctx,
    cellSize,
  } = gameState;

  const [x, y]: [number, number] = position.coordsPx;
  ctx.drawImage(
    getCharacterImageByDirection(direction.direction),
    x + cellSize * .5 - getCharacterImageByDirection(direction.direction).width * .5,
    y + cellSize * .5 - getCharacterImageByDirection(direction.direction).height * .5,
    cellSize,
    cellSize,
  );
}
