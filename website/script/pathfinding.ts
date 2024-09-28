import {
  debounce,
  getCanvasCoordsByCellNumber,
  getCellByCanvasCoords,
  getCellCoordsByCellNumber,
  getBlockedCells,
  getCharacterImageByDirection,
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
  window.requestAnimationFrame((timeRes: number) => updateFps(timeRes));
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
  const dayNightCycle: number = 6 * 60 * 1000; // 6 minutes
  const dayTimeVisionRadius: number = 6;
  const nightTimeVisionRadius: number = 3;
  let isNight: boolean = false;
  let time: number = 0;
  let cameraDistance: number = .5; // 1 = 100% = max distance

  let pointerTarget: number|undefined;
  let pressedKey: string;

  let translateX = 0;
  let translateY = 0;

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
    210, 117, 24, /* top-right */
    275, 278, 281, /* right */
    338, 437, 503, /* bottom-right */
    368, 464, /* bottom */
    334, 427, 489, /* bottom-left */
    269, 266, 263, /* left */
    206, 107, 8, /* top-left */
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
      speed: 1,
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
      speed: 1.33,
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
      speed: 1.66,
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
    ctx.save();
    const scale: number = 1 / cameraDistance; // Calculate scaling factor based on zoom level
    // Get the total size of the game world
    const worldWidth: number = cellsX * cellSize;
    const worldHeight: number = cellsY * cellSize;
    // Get character's position in pixel coordinates
    const [characterX, characterY]: [number, number] = character.positionPx;
    // Calculate the maximum and minimum allowable translations
    const maxTranslateX: number = 0;
    const maxTranslateY: number = 0;
    const minTranslateX: number = w - worldWidth * scale; // Prevent going past the right boundary
    const minTranslateY: number = h - worldHeight * scale; // Prevent going past the bottom boundary
    // Apply initial translation to center the camera on the character
    translateX = w / 2 - characterX * scale;
    translateY = h / 2 - characterY * scale;
    // Clamp the translation to stay within the world bounds
    translateX = Math.min(maxTranslateX, Math.max(minTranslateX, translateX));
    translateY = Math.min(maxTranslateY, Math.max(minTranslateY, translateY));
    ctx.translate(translateX, translateY);
    ctx.scale(scale, scale);

    drawBackground(ctx, 'hsla(100, 100%, 75%, .5)', w, h);
    const inVision = (number: number) => {
      const visionRangeX: number = Math.round(cellsX * cameraDistance);
      const visionRangeY: number = Math.round(cellsY * cameraDistance);
      const inVisionVertically: boolean = Math.abs(Math.floor(number / cellsX) - Math.floor(character.position / cellsX)) - visionRangeX / cameraDistance <= visionRangeY;
      const inVisionHorizontally: boolean = Math.abs(Math.floor(number % cellsX) - Math.floor(character.position % cellsX)) - visionRangeY / cameraDistance <= visionRangeX;
      return inVisionVertically && inVisionHorizontally;
    };
    for (let cellNumber: number = 0; cellNumber < cells.length; cellNumber++) {
      if (inVision(cellNumber)) drawGround(ctx, cells, cellsX, cellsY, cellSize, cellNumber);
    }
    drawPath(ctx, character.path, cellsX, cellSize);
    for (let cellNumber: number = 0; cellNumber < cells.length; cellNumber++) {
      if (inVision(cellNumber)) {
        const cellState: number = cells[cellNumber];
        if (ignoreVision || character.explored.includes(cellNumber)) {
          if (cellState === CELL_STATE.BLOCKED) drawTree(ctx, treeImages, cellNumber, cellsX, cellSize);
        }
        if (cellNumber === character.position) drawCharacter(ctx, cellsX, cellSize, tick, character);
        enemies.forEach((enemy: Character) => {
          if (cellNumber === enemy.position) drawEnemy(ctx, cellsX, cellSize, tick, enemy);
        });
      }
    }
    if (!ignoreVision) {
      let maxVisionPx: number = dayTimeVisionRadius * cellSize;
      let visiblePercent: number = character.visionRadiusPx / maxVisionPx;
      let alpha: number = .4 + (.2 / visiblePercent);
      drawVision(ctx, w, h, treeCells, cellsX, cellSize, character, `rgba(0, 0, 0, ${alpha})`);
    }
    drawPointer(ctx, pointerTarget, cellsX, cellSize, tick);
    if (debugGrid) drawDebugGrid(ctx, cells, cellsX, cellSize);
    ctx.resetTransform();
    ctx.restore();
    if (debugData) drawDebugData(ctx, cellSize, w, { FPS: fps });
    drawClock(ctx, w, h, cellSize, dayNightCycle, time);
  }

  function frameTicker(tick: number) {
    draw(tick);
    window.requestAnimationFrame(frameTicker);
  }
  frameTicker(0);

  function gameTicker() {
    moveCharacter(cells, cellsX, cellsY, cellSize, character, pressedKey);
    enemies.forEach((enemy: Character) => {
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
      const rect: DOMRect = canvasElement.getBoundingClientRect();
      const x: number = ((((e.clientX - rect.left) / canvasElement.clientWidth) * w) - translateX) * cameraDistance;
      const y: number = ((((e.clientY - rect.top) / canvasElement.clientHeight) * h) - translateY) * cameraDistance;
      character.target = getCellByCanvasCoords(x, y, cellSize, cellsX);
      if (character.position !== character.target && cells[character.target] !== CELL_STATE.BLOCKED) {
        const newPath = await getPath(cells.map((c: number) => c), cellsX, cellsY,[[character.position]], character.target);
        if (newPath && typeof newPath[0] === 'number' && newPath.length) character.path = newPath;
      }
    });

    canvasElement.addEventListener('mousemove', async (e: MouseEvent) => {
      const rect: DOMRect = canvasElement.getBoundingClientRect();
      const x: number = ((((e.clientX - rect.left) / canvasElement.clientWidth) * w) - translateX) * cameraDistance;
      const y: number = ((((e.clientY - rect.top) / canvasElement.clientHeight) * h) - translateY) * cameraDistance;
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

    const cameraDistanceStep: number = .1;
    const minCameraDistance: number = .4;
    const maxCameraDistance: number = 1;
    const debounceChangeCameraDistance = debounce(async (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.deltaY < 0) {
        cameraDistance = Math.max(minCameraDistance, Math.round((cameraDistance - cameraDistanceStep) * 100) / 100);  // Zoom in
      } else {
        cameraDistance = Math.min(maxCameraDistance, Math.round((cameraDistance + cameraDistanceStep) * 100) / 100);  // Zoom out
      }
      if (character.target && character.position !== character.target && cells[character.target] !== CELL_STATE.BLOCKED) {
        const newPath = await getPath(cells.map((c: number) => c), cellsX, cellsY,[[character.position]], character.target);
        if (newPath && typeof newPath[0] === 'number' && newPath.length) character.path = newPath;
      }
    }, 10);

    window.addEventListener('wheel', debounceChangeCameraDistance);


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
