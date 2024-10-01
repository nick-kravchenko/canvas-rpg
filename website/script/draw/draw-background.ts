import { gameState } from '../game-state';

export function drawBackground(color: string,) {
  const {
    ctx,
    w,
    h,
  } = gameState;

  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}
