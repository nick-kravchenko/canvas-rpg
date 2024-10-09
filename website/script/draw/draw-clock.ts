// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import characterFrontPng from '../../images/clock.png';
import { gameState } from '../game-state';

const clockImage = new Image();
clockImage.src = characterFrontPng;

export function drawClock() {
  const {
    ctx,
    cellSize,
    w,
    h,
    dayNightCycle,
    time,
  } = gameState;

  const radius = cellSize / 2;
  const halfCycle = dayNightCycle / 2;
  const timePassedSinceMidSmth = time % halfCycle;
  const angle: number = ((timePassedSinceMidSmth / halfCycle) * Math.PI);
  const isNight: boolean = (time % dayNightCycle) >= halfCycle;
  const scale = .75;

  ctx.save();
  // ctx.fillStyle = isNight ? '#000' : '#fff';
  // ctx.strokeStyle = isNight ? '#fff' : '#000';
  // ctx.lineWidth = 4;
  // ctx.beginPath();
  // ctx.moveTo(w / 2, h);
  // ctx.arc(
  //   w / 2,
  //   h,
  //   radius,
  //   Math.PI,
  //   0,
  //   false);
  // ctx.closePath();
  // ctx.fill();
  // ctx.stroke();
  ctx.drawImage(
    clockImage,
    0,
    isNight ? 0 : 33,
    cellSize,
    cellSize / 2,
    (w / 2) - (cellSize * scale),
    h - (cellSize * scale),
    cellSize * (2 * scale),
    cellSize * scale,
  );
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(w / 2, h);
  ctx.lineTo(
    w / 2 - Math.cos(angle) * radius * scale,
    h - Math.sin(angle) * radius * scale,
  );
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.strokeStyle = 'rgba(0, 0, 0, .75)';
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}
