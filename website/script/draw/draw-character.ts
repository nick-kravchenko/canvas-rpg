import { getCharacterImageByDirection } from '../utils';
import { gameState } from '../game-state';
import { GameObject } from '../entities';
import { DirectionComponent, HealthComponent, PositionComponent } from '../components';
import { ComponentKey } from '../enums/component-key.enum';

export function drawCharacter(
  character: GameObject,
) {
  const position: PositionComponent = character.getComponent(ComponentKey.POSITION);
  const direction: DirectionComponent = character.getComponent(ComponentKey.DIRECTION);
  const health: HealthComponent = character.getComponent(ComponentKey.HEALTH);
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

  const hpBarWidth: number = cellSize * .75;
  const hpBarMarginLeft: number = (cellSize - hpBarWidth) * .5;
  const hpBarHeight: number = cellSize * .125;
  const hpBarMarginTop: number = -2;
  const filledWidth: number = ~~(hpBarWidth * (health.current / health.max));

  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, .5)';
  ctx.strokeStyle = 'rgba(255, 255, 255, .7)';
  ctx.beginPath();
  ctx.roundRect(x + hpBarMarginLeft, y + hpBarMarginTop, hpBarWidth, hpBarHeight, 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = 'hsla(100, 50%, 50%, .75)';
  ctx.strokeStyle = 'rgba(0, 0, 0, .7)';
  ctx.beginPath();
  ctx.roundRect(x + hpBarMarginLeft +1 , y + hpBarMarginTop + 1, filledWidth - 2, hpBarHeight - 2, 1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
