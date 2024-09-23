import {
  getCanvasCoordsByCellNumber,
  getCellByCanvasCoords,
  getCellCoordsByCellNumber,
  getBlockedCells,
  getCharacterImageByDirection,
  getCharacterVision,
  getCharacterVisionCircle,
  getCharacterVisionCircleTrees,
  getDirectionByKey,
  getNeighbors,
  getNextCharacterPositionByCellNumber,
  getPath,
  getPerlinNoise,
  getStateStringByEnum,
  imagesCharacter,
  imagesTrees,
  moveCharacter,
  setCanvasSizeToFullScreen,
  setCellVisited,
  setCharacterVisionRadius,
  setCharacterVisionRadiusPx,
  updateCharacterVision,
} from './utils';
import {
  drawBackground,
  drawCharacter,
  drawClock,
  drawDebugData,
  drawDebugGrid, drawEnemy,
  drawGround,
  drawPath,
  drawPointer,
  drawTree,
  drawVision,
} from './draw';

import { CELL_STATE } from './enums/cell-state.enum';
import { DIRECTION } from './enums/direction.enum';
import { Character } from './types/character';

let debugGrid: boolean = false;
let debugData: boolean = true;
let ignoreVision: boolean = false;

let fps: number;
let requestTime: number;
function updateFps(time: number) {
  if (requestTime) {
    fps = Math.round(1000/((performance.now() - requestTime)));
  }
  requestTime = time;
  window.requestAnimationFrame((timeRes) => updateFps(timeRes));
}
updateFps(0);

(async () => {
  const canvasElement: HTMLCanvasElement = document.getElementById('main-canvas') as HTMLCanvasElement;
        setCanvasSizeToFullScreen(canvasElement);
  const ctx: CanvasRenderingContext2D = canvasElement.getContext('2d');
  const cellSize: number = 64;
  const cellsX: number = 32;
  const cellsY: number = 16;
  const w: number = cellSize * cellsX;
  const h: number = cellSize * cellsY;
  canvasElement.width = w;
  canvasElement.height = h;

  const gameTickRate: number = 1000 / 128; // 128hz
  const dayNightCycle: number = .25 * 60 * 1000; // 24 minutes
  const dayTimeVisionRadius: number = 6;
  const nightTimeVisionRadius: number = 3;
  let isNight: boolean = false;
  let time: number = 0;

  let pointerTarget: number|undefined;
  let pressedKey: string;

  const character: Character = {
    position: Math.round(((cellsX * cellsY) / 2) + cellsX / 2),
    positionPx: getCanvasCoordsByCellNumber(Math.round(((cellsX * cellsY) / 2) + cellsX / 2), cellsX, cellSize),
    target: 0,
    path: [],
    explored: [],
    direction: DIRECTION.DOWN,
    speed: 2,
    visionRadius: dayTimeVisionRadius,
    visionRadiusPx: dayTimeVisionRadius * cellSize,
  };

  let cells: Int8Array;
      cells = new Int8Array(cellsX * cellsY).fill(CELL_STATE.UNVISITED);

  const treeCells: number[] = [
    176, 80, 16, /* top */
    210, 117, 24, /* tr */
    275, 278, 281, /* right */
    338, 437, 503, /* rb */
    368, 464, /* bottom */
    334, 427, 489, /* bl */
    269, 266, 263, /* left */
    206, 107, 8, /* lt */

    // 237, 301, 243, 307, 175, 177, 367, 369
  ];
  function getRandomTreeImage(): HTMLImageElement {
    return imagesTrees[Math.floor(Math.random() * imagesTrees.length)];
  }

  const treeImages: { [key: number]: HTMLImageElement } = treeCells.reduce((acc, cellNumber) => {
    return {
      ...acc,
      [cellNumber]: getRandomTreeImage(),
    }
  }, {});

  cells = getBlockedCells(cells, treeCells);

  setInterval(() => {
    time += 100;
  }, 100);

  setInterval(() => {
    let newIsNight: boolean = (time % dayNightCycle) >= dayNightCycle / 2;
    if (isNight !== newIsNight) {
      isNight = newIsNight;
      if (isNight) {
        setCharacterVisionRadius(cells, cellsX, cellSize, treeCells, character, nightTimeVisionRadius);
        setCharacterVisionRadiusPx(cells, cellsX, cellSize, treeCells, character, nightTimeVisionRadius * cellSize);
      } else {
        setCharacterVisionRadius(cells, cellsX, cellSize, treeCells, character, dayTimeVisionRadius);
        setCharacterVisionRadiusPx(cells, cellsX, cellSize, treeCells, character, dayTimeVisionRadius * cellSize);
      }
    }
  }, 200 / cellSize);

  const enemies: Character[] = [
    {
      position: Math.round(((cellsX * cellsY) / 2) + cellsX / 2) + cellsX,
      positionPx: getCanvasCoordsByCellNumber(Math.round(((cellsX * cellsY) / 2) + cellsX / 2) + cellsX, cellsX, cellSize),
      target: 0,
      path: [],
      explored: [],
      direction: DIRECTION.DOWN,
      speed: 2,
      visionRadius: dayTimeVisionRadius,
      visionRadiusPx: dayTimeVisionRadius * cellSize,
    },
    {
      position: Math.round(((cellsX * cellsY) / 2) + cellsX / 2) + cellsX,
      positionPx: getCanvasCoordsByCellNumber(Math.round(((cellsX * cellsY) / 2) + cellsX / 2) + cellsX, cellsX, cellSize),
      target: 0,
      path: [],
      explored: [],
      direction: DIRECTION.DOWN,
      speed: 2,
      visionRadius: dayTimeVisionRadius,
      visionRadiusPx: dayTimeVisionRadius * cellSize,
    },
    {
      position: Math.round(((cellsX * cellsY) / 2) + cellsX / 2) + cellsX,
      positionPx: getCanvasCoordsByCellNumber(Math.round(((cellsX * cellsY) / 2) + cellsX / 2) + cellsX, cellsX, cellSize),
      target: 0,
      path: [],
      explored: [],
      direction: DIRECTION.DOWN,
      speed: 2,
      visionRadius: dayTimeVisionRadius,
      visionRadiusPx: dayTimeVisionRadius * cellSize,
    },
  ]

  function getRandomUnblockedCell(cells: Int8Array, blockedCells: number[]) {
    const unblockedCells: number[] = Array.from(cells).reduce((acc: number[], cellState: CELL_STATE, index: number) => {
      return !blockedCells.includes(index) ? [...acc, index] : acc;
    }, []);
    return unblockedCells[Math.floor(Math.random() * unblockedCells.length)];
  }
  async function setRandomPathForCharacter(cells: Int8Array, blockedCells: number[], character: Character) {
    character.target = getRandomUnblockedCell(cells, blockedCells);
    const newPath = await getPath(cells.map(c => c), cellsX, cellsY,[[character.position]], character.target);
    if (newPath && typeof newPath[0] === 'number' && newPath.length) character.path = newPath;
  }

  function draw(tick: number) {
    drawBackground(ctx, 'hsla(100, 100%, 75%, .5)', w, h);
    for (let cellNumber = 0; cellNumber < cells.length; cellNumber++) {
      drawGround(ctx, cells, cellsX, cellsY, cellSize, cellNumber);
    }
    drawPath(ctx, character.path, cellsX, cellSize);
    for (let cellNumber = 0; cellNumber < cells.length; cellNumber++) {
      const cellState = cells[cellNumber];
      if (ignoreVision || character.explored.includes(cellNumber)) {
        if (cellState === CELL_STATE.BLOCKED) drawTree(ctx, treeImages, cellNumber, cellsX, cellSize);
      }
      if (cellNumber === character.position) drawCharacter(ctx, cellsX, cellSize, tick, character);
      enemies.forEach(enemy => {
        if (cellNumber === enemy.position) drawEnemy(ctx, cellsX, cellSize, tick, enemy);
      });
    }
    drawClock(ctx, w, h, cellSize, dayNightCycle, time);
    if (!ignoreVision) {
      let maxVisionPx = dayTimeVisionRadius * cellSize;
      let visiblePercent = character.visionRadiusPx / maxVisionPx;
      let alpha = .4 + (.2 / visiblePercent);
      drawVision(ctx, w, h, treeCells, cellsX, cellSize, character, `rgba(0, 0, 0, ${alpha})`);
    }
    drawPointer(ctx, pointerTarget, cellsX, cellSize, tick);
    if (debugGrid) drawDebugGrid(ctx, cells, cellsX, cellSize);
    if (debugData) drawDebugData(ctx, cellSize, w, { FPS: fps });
  }

  function frameTicker(tick: number) {
    draw(tick);
    window.requestAnimationFrame(frameTicker);
  }
  frameTicker(0);

  // memory leaking shit ??? // mb fixed
  function gameTicker() {
    moveCharacter(cells, cellsX, cellsY, cellSize, character, pressedKey);
    enemies.forEach(enemy => {
      if (!enemy.path.length) {
        setRandomPathForCharacter(cells, treeCells, enemy);
      } else {
        moveCharacter(cells, cellsX, cellsY, cellSize, enemy, '');
      }
    });
    updateCharacterVision(cells, cellsX, character);
    const timeout = setTimeout(() => {
      gameTicker();
      clearTimeout(timeout);
    }, gameTickRate);
  }
  gameTicker();

  (() => {
    canvasElement.addEventListener('click', async (e: MouseEvent) => {
      const rect = canvasElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / canvasElement.clientWidth) * w;
      const y = ((e.clientY - rect.top) / canvasElement.clientHeight) * h;
      character.target = getCellByCanvasCoords(x, y, cellSize, cellsX);
      if (character.position !== character.target && cells[character.target] !== CELL_STATE.BLOCKED) {
        const newPath = await getPath(cells.map(c => c), cellsX, cellsY,[[character.position]], character.target);
        if (newPath && typeof newPath[0] === 'number' && newPath.length) character.path = newPath;
      }
    });

    canvasElement.addEventListener('mousemove', async (e: MouseEvent) => {
      const rect = canvasElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / canvasElement.clientWidth) * w;
      const y = ((e.clientY - rect.top) / canvasElement.clientHeight) * h;
      pointerTarget = getCellByCanvasCoords(x, y, cellSize, cellsX);
    });

    window.addEventListener('keydown', (event: KeyboardEvent) => {
      character.direction = getDirectionByKey(event.code);
      pressedKey = event.code;
    });

    window.addEventListener('keyup', (event: KeyboardEvent) => {
      if (pressedKey === event.code) {
        pressedKey = undefined;
      }
    });

    const debugGridCheckbox: HTMLInputElement = document.getElementById('debugGrid') as HTMLInputElement;
    debugGridCheckbox.addEventListener('change', (event) => {
      // @ts-ignore
      debugGrid = event.target.checked;
    });

    const debugDataCheckbox: HTMLInputElement = document.getElementById('debugData') as HTMLInputElement;
    debugDataCheckbox.addEventListener('change', (event) => {
      // @ts-ignore
      debugData = event.target.checked;
    });

    const ignoreVisionCheckbox: HTMLInputElement = document.getElementById('ignoreVision') as HTMLInputElement;
    ignoreVisionCheckbox.addEventListener('change', (event) => {
      // @ts-ignore
      ignoreVision = event.target.checked;
    });
  })();
})();
