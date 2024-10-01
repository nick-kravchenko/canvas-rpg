import { getCharacterImageByDirection } from '../utils';
import { gameState } from '../game-state';
import { CharacterEntity } from '../ecs/entity';
import { DirectionComponent, PositionComponent } from '../ecs/component';

export function drawEntityCharacter(
  character: CharacterEntity,
) {
  const position: PositionComponent = character.getComponent<PositionComponent>('position');
  const direction: DirectionComponent = character.getComponent<DirectionComponent>('direction');
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
