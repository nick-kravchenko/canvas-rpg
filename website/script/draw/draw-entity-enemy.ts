import { getCharacterImageByDirection } from '../utils';
import { gameState } from '../game-state';
import { CharacterEntity } from '../ecs/entity';
import { DirectionComponent, PositionComponent } from '../ecs/component';

export function drawEntityEnemy(
  enemy: CharacterEntity,
) {
  const {
    ctx,
    cellSize,
  } = gameState;
  const position: PositionComponent = enemy.getComponent<PositionComponent>('position');
  const direction: DirectionComponent = enemy.getComponent<DirectionComponent>('direction');
  const [x, y]: [number, number] = position.coordsPx;
  ctx.drawImage(
    getCharacterImageByDirection(direction.direction),
    x + cellSize * .5 - getCharacterImageByDirection(direction.direction).width * .5,
    y + cellSize * .5 - getCharacterImageByDirection(direction.direction).height * .5,
    cellSize,
    cellSize,
  );
}
