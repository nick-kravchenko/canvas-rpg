import { clamp } from '../utils';
import { gameState } from '../game-state';
import { GameObject } from '../entities';
import { HealthComponent } from '../components';
import { ComponentKey } from '../types/component-key.enum';

export function drawHud(
  character: GameObject,
) {
  const { w, h } = gameState;
  const health: HealthComponent = character.getComponent(ComponentKey.HEALTH);
  const {
    ctx,
    cellSize,
  } = gameState;

  const centerX: number = w * .5 - cellSize * 4;
  const centerY: number = h - cellSize * 2;

  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY,
    cellSize,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = '#333';
  ctx.fillStyle = 'hsla(0, 50%, 50%, 1)';
  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY,
    cellSize,
    (Math.PI * .5) - Math.PI * clamp(health.current / health.max, 0.3, 1),
    (Math.PI * .5) + Math.PI * clamp(health.current / health.max, 0.3, 1),
  );
  ctx.fill();
  ctx.save();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY,
    cellSize + 4,
    0,
    Math.PI * 2,
  );
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '400 18px "JetBrains Mono", sans-serif';
  ctx.fillText(`${~~health.current}`, centerX, centerY - 16);
  ctx.fillRect(centerX - cellSize * .5, centerY - 3, cellSize, 4);
  ctx.fillText(`${health.max}`, centerX, centerY + 16);
}
