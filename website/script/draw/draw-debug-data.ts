import { gameState } from '../game-state';

export function drawDebugData(data: { [key: string]: number|string|boolean }) {
  if (!gameState.debugData) return;

  const {
    ctx,
    cellSize,
    w,
  } = gameState;

  const scale = .5;
  let strings: string[] = [];
  Object.entries(data).forEach(([key, value]) => {
    strings.push(`${key}: ${value}`);
  })
  ctx.save();
  ctx.font = `bold ${cellSize * scale}px/${cellSize * scale}px "Tiny5", sans-serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#000';
  for (let i = strings.length - 1; i >= 0; i--) {
    const str = strings[i];
    ctx.fillText(str, w, ((cellSize * scale) * i));
    // ctx.strokeText(str, w, ((cellSize * scale) * i));
  }
  ctx.restore();
}
