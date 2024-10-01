import { getCharacterImageByDirection } from '../utils';
import { gameState } from '../game-state';
import { CharacterEntity } from '../ecs/entity';
import { DirectionComponent, PositionComponent } from '../ecs/component';
import { ComponentKey } from '../enums/component-key.enum';

export function drawEntityEnemy(
  enemy: CharacterEntity,
) {
  const {
    ctx,
    cellSize,
  } = gameState;
  const position: PositionComponent = enemy.getComponent(ComponentKey.POSITION);
  const direction: DirectionComponent = enemy.getComponent(ComponentKey.DIRECTION);
  const [x, y]: [number, number] = position.coordsPx;
  ctx.drawImage(
    getCharacterImageByDirection(direction.direction),
    x + cellSize * .5 - getCharacterImageByDirection(direction.direction).width * .5,
    y + cellSize * .5 - getCharacterImageByDirection(direction.direction).height * .5,
    cellSize,
    cellSize,
  );
}
