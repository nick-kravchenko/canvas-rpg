import { gameState } from '../game-state';

export function drawDebugData() {
  if (!gameState.debugData) return;

  const {
    ctx,
    cellSize,
    w,
  } = gameState;

  const scale = .4;
  const padding = cellSize * .25;
  let strings: string[] = [];
  Object.entries(gameState.debug).forEach(([key, value]) => {
    value = typeof value === 'object' ? JSON.stringify(value) : value ;
    strings.push(`${key}: ${value}`);
  })

  if (!strings.length) return;

  ctx.font = `400 ${cellSize * scale}px/${cellSize * scale}px "JetBrains Mono", sans-serif`;

  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, .5)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
  // @ts-ignore
  const tileWidth: number = strings.reduce((width: number, str) => {
    const strW: number = ctx.measureText(str).width;
    return strW > width ? strW : str;
  }, 0) + padding * 2;
  ctx.fillRect(w - tileWidth, 0, tileWidth, (strings.length * cellSize * scale) + padding * 2);
  ctx.strokeRect(w - tileWidth, 0, tileWidth, (strings.length * cellSize * scale) + padding * 2);
  ctx.restore();

  ctx.save();
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#000';
  for (let i = strings.length - 1; i >= 0; i--) {
    const str = strings[i];
    ctx.fillText(str, w - padding, ((cellSize * scale) * i) + padding);
    // ctx.strokeText(str, w, ((cellSize * scale) * i));
  }
  ctx.restore();
}
