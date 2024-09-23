export function drawBackground(ctx: CanvasRenderingContext2D, color: string, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}
