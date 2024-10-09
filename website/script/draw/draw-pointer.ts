import { clamp, getPixelCoordsByCellNumber } from '../utils';
import { gameState } from '../game-state';
import { GameObject } from '../entities';
import { CellStateEnum } from '../types/cell-state.enum';
import { ComponentKey } from '../types/component-key.enum';
import { enemiesStorage } from '../data/enemies-storage';
import { handClosedImg, pointerICursorImg, stepsCursorImg, toolAxeImg } from '../data/images-cursor';

function enemyHovered(cellNumber: number) {
  return enemiesStorage.enemies.some((enemy) => {
    return enemy.getComponent(ComponentKey.POSITION).cellNumber === cellNumber;
  })
}

export function drawPointer(playerCharacter: GameObject, tick: number) {
  const {
    ctx,
    cells,
    cellSize,
  } = gameState;
  const {
    mouseOver,
    mouseCoords,
  } = playerCharacter.getComponent(ComponentKey.PLAYER_CONTROLS);
  const {
    visibleCells,
    exploredCells,
  } = playerCharacter.getComponent(ComponentKey.VISION);

  if (typeof mouseOver === 'number') {
    const [x, y]: [number, number] = getPixelCoordsByCellNumber(mouseOver);
    ctx.save();
    ctx.beginPath();
    // TOP LEFT
    ctx.moveTo(x, y + cellSize * .33);
    ctx.lineTo(x, y);
    ctx.lineTo(x + cellSize * .33, y);
    // TOP RIGHT
    ctx.moveTo(x + cellSize, y + cellSize * .33);
    ctx.lineTo(x + cellSize, y);
    ctx.lineTo((x + cellSize) - (cellSize * .33), y);
    // BOTTOM LEFT
    ctx.moveTo(x, (y + cellSize) - (cellSize * .33));
    ctx.lineTo(x, y + cellSize);
    ctx.lineTo(x + cellSize * .33, y + cellSize);
    // BOTTOM RIGHT
    ctx.moveTo(x + cellSize, (y + cellSize) - (cellSize * .33));
    ctx.lineTo(x + cellSize, y + cellSize);
    ctx.lineTo((x + cellSize) - (cellSize * .33), y + cellSize);
    ctx.lineCap = "round";
    const scale = (1 + Math.sin(tick / 128)) / 2;
    ctx.lineWidth = clamp(4 * scale, 2, cellSize * .125);
    ctx.strokeStyle = `rgba(255, 255, 255, .5)`;
    ctx.stroke();
    ctx.restore();
  }

  if (mouseCoords) {
    const [x, y]: [number, number] = mouseCoords;
    ctx.save();
    ctx.beginPath();
    ctx.drawImage(pointerICursorImg, x - cellSize * .125, y - cellSize * .125, cellSize * .5, cellSize * .5);
    let icon: HTMLImageElement = stepsCursorImg;
    if (exploredCells.includes(mouseOver) && cells[mouseOver] === CellStateEnum.BLOCKED) icon = toolAxeImg;
    if (visibleCells.includes(mouseOver) && enemyHovered(mouseOver)) icon = handClosedImg;
    ctx.drawImage(
      icon,
      0, 0, icon.width, icon.height,
      x + cellSize * .125, y + cellSize * .125, cellSize * .5, cellSize * .5
    );
    ctx.closePath();
    ctx.fillStyle = `rgba(255, 255, 255, .5)`;
    ctx.fill();
    ctx.restore();
  }
}
