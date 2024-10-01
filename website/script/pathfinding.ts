import {
  debounce,
  getPixelCoordsByCellNumber,
  getCellNumberByPixelCoords,
  getDirectionByKey,
  getPath,
  moveCharacter,
  setCharacterVisionRadius,
  setCharacterVisionRadiusPx,
  updateCharacterVision,
  getNeighbors,
} from './utils';
import {
  drawBackground,
  drawCharacter,
  drawClock,
  drawDebugData,
  drawDebugGrid, drawEnemy,
  drawGround, drawMinimap,
  drawPath,
  drawPointer,
  drawTree,
  drawVision,
} from './draw';
import { gameState } from './game-state';
import { CELL_STATE } from './enums/cell-state.enum';
import { DIRECTION } from './enums/direction.enum';
import { Character } from './types/character';
import { Npc } from './types/npc';
import { imagesTrees, treesNew } from './data';

(async () => {
  let fps: number;
  let requestTime: number;
  let pointerTarget: number|undefined;
  let pressedKey: string;

  const treeCells: number[] = treesNew;
  const getRandomTreeImage = (): HTMLImageElement => imagesTrees[Math.floor(Math.random() * imagesTrees.length)];
  const treeImages: { [key: number]: HTMLImageElement } = treeCells.reduce((acc, cellNumber) => ({...acc, [cellNumber]: getRandomTreeImage()}), {});

  /**
   * Map treeCells on the game field
   */
  gameState.setBlockedCells(treeCells);

  /**
   * Set canvas sizes
   */
  gameState.setCanvasSizes();

  /**
   * Create player character and enemies
   */
  const character: Character = {
    position: Math.round(((gameState.cellsX * gameState.cellsY) / 2) + gameState.cellsX / 2),
    positionPx: getPixelCoordsByCellNumber(Math.round(((gameState.cellsX * gameState.cellsY) / 2) + gameState.cellsX / 2)),
    target: 0,
    path: [],
    explored: [],
    visible: [],
    direction: DIRECTION.DOWN,
    speed: 2,
    visionRadius: gameState.dayTimeVisionRadius,
    visionRadiusPx: gameState.dayTimeVisionRadius * gameState.cellSize,
  };
  const enemies: Npc[] = [
    {
      position: 66,
      positionPx: getPixelCoordsByCellNumber(66),
      target: 0,
      path: [],
      explored: [],
      visible: [],
      direction: DIRECTION.DOWN,
      speed: 1,
      visionRadius: 5,
      visionRadiusPx: 5 * gameState.cellSize,
      anchorPosition: 66,
      wanderingRadius: 4,
    },
    {
      position: 386,
      positionPx: getPixelCoordsByCellNumber(386),
      target: 0,
      path: [],
      explored: [],
      visible: [],
      direction: DIRECTION.DOWN,
      speed: 1.33,
      visionRadius: 5,
      visionRadiusPx: 5 * gameState.cellSize,
      anchorPosition: 386,
      wanderingRadius: 4,
    },
    {
      position: 222,
      positionPx: getPixelCoordsByCellNumber(222),
      target: 0,
      path: [],
      explored: [],
      visible: [],
      direction: DIRECTION.DOWN,
      speed: 1.66,
      visionRadius: 5,
      visionRadiusPx: 5 * gameState.cellSize,
      anchorPosition: 222,
      wanderingRadius: 4,
    },
  ];

  /**
   * Forces npc to chase player.
   */
  function chasePlayer(npc: Npc, player: Character) {
    const playerNeighbors: number[] = getNeighbors(player.position).filter((cellNumber: number) => gameState.cells[cellNumber] !== CELL_STATE.BLOCKED);

    const closestNeighborPath: number[] = playerNeighbors.reduce((prevPath: number[]|null, cur: number) => {
      const newPath: number[] = getPath(npc.position, cur);
      return !prevPath || (newPath.length < prevPath.length) ?  newPath : prevPath;
    }, null);

    if (closestNeighborPath && typeof closestNeighborPath[0] === 'number' && closestNeighborPath.length) {
      npc.target = closestNeighborPath[closestNeighborPath.length  - 1];
      npc.path = closestNeighborPath.slice(1);
    }
  }

  /**
   * Check if cell is in screen bounds
   */
  const isWithinScreenBounds = (cellNumber: number) => {
    const visionRangeX: number = Math.round(gameState.cellsX * gameState.cameraDistance);
    const visionRangeY: number = Math.round(gameState.cellsY * gameState.cameraDistance);
    const inVisionVertically: boolean = Math.abs(Math.floor(cellNumber / gameState.cellsX) - Math.floor(character.position / gameState.cellsX)) - visionRangeX / gameState.cameraDistance <= visionRangeY;
    const inVisionHorizontally: boolean = Math.abs(Math.floor(cellNumber % gameState.cellsX) - Math.floor(character.position % gameState.cellsX)) - visionRangeY / gameState.cameraDistance <= visionRangeX;
    return inVisionVertically && inVisionHorizontally;
  };

  function draw(tick: number) {
    gameState.setCtxScale(character);

    drawBackground('hsla(100, 100%, 75%, .5)');

    /**
     * NOTE: Need to draw ground and another objects using separate loops to avoid ground overlapping objects
     */
    for (let cellNumber: number = 0; cellNumber < gameState.cells.length; cellNumber++) {
      if (isWithinScreenBounds(cellNumber)) drawGround(cellNumber)
    }
    for (let cellNumber: number = 0; cellNumber < gameState.cells.length; cellNumber++) {
      if (isWithinScreenBounds(cellNumber)) {
        const cellState: number = gameState.cells[cellNumber];
        if (gameState.ignoreVision || character.explored.includes(cellNumber)) {
          if (cellState === CELL_STATE.BLOCKED) drawTree(treeImages, cellNumber, character);
        }
        if (cellNumber === character.position) drawCharacter(character, tick);
        enemies.forEach((enemy: Npc) => {
          if (cellNumber === enemy.position && (gameState.ignoreVision || character.visible.includes(cellNumber))) drawEnemy(enemy, character, tick);
        });
      }
    }

    drawPath(character.path);

    let maxVisionPx: number = gameState.dayTimeVisionRadius * gameState.cellSize;
    let visiblePercent: number = character.visionRadiusPx / maxVisionPx;
    let alpha: number = .4 + (.2 / visiblePercent);
    drawVision(treeCells, character, `rgba(0, 0, 0, ${alpha})`);

    drawPointer(pointerTarget, tick);

    drawDebugGrid();

    /**
     * Resetting scale to draw unscalable elements (eg. HUD)
     */
    gameState.restoreCtxScale();

    drawClock();
    drawMinimap(gameState.cameraDistance, character);
    drawDebugData({
      FPS: fps,
      time: Math.round(gameState.time),
      isNight: gameState.isNight,
    });
  }

  function gameLoop() {
    /**
     * Update game time
     */
    gameState.setTime(gameState.time + gameState.gameTickRate);

    /**
     * Implement day/night cycle. Updating the player's vision radius according to the time of day
     */
    let newIsNight: boolean = (gameState.time % gameState.dayNightCycle) >= gameState.dayNightCycle / 2;
    if (gameState.isNight !== newIsNight) {
      gameState.setIsNight(newIsNight);
      const newCellsVisionRadius: number = newIsNight ? gameState.nightTimeVisionRadius : gameState.dayTimeVisionRadius;
      const newPxVisionRadius: number = newCellsVisionRadius * gameState.cellSize;
      setCharacterVisionRadius(character, treeCells, newCellsVisionRadius);
      setCharacterVisionRadiusPx(character, treeCells, newPxVisionRadius);
    }

    /**
     * Character movement/vision behavior
     */
    moveCharacter(character, pressedKey);
    updateCharacterVision(character, treeCells);

    /**
     * Enemies movement/vision/chase behavior
     */
    for (let enemy of enemies) {
      if (enemy.visible.includes(character.position)) chasePlayer(enemy, character);
      if (enemy.path.length) moveCharacter(enemy, null);
      if (!enemy.path.length && !enemy.visible.includes(character.position) && enemy.anchorPosition !== enemy.position) {
        enemy.target = enemy.anchorPosition;
        enemy.path = getPath(enemy.position, enemy.target);
      }
      updateCharacterVision(enemy, treeCells);
    }

    /**
     * Call gameLoop recursively in gameTickRate ms
     */
    const timeout = setTimeout(() => {
      gameLoop();
      clearTimeout(timeout);
    }, gameState.gameTickRate);
  }
  gameLoop();

  function renderLoop(tick: number) {
    if (requestTime) fps = Math.round(1000/((performance.now() - requestTime)));
    requestTime = tick;
    draw(tick);
    window.requestAnimationFrame(renderLoop);
  }
  renderLoop(0);

  /**
   * Event listeners for 'click', 'mousemove', 'wheel', 'keydown', 'keyup' and 'change' for checkboxes
   */
  (function handleControls() {
    function getCoordsByMouseEvent(event: MouseEvent): [number, number] {
      const rect: DOMRect = gameState.canvasElement.getBoundingClientRect();
      const x: number = ((((event.clientX - rect.left) / gameState.canvasElement.clientWidth) * gameState.w) - gameState.translateX) * gameState.cameraDistance;
      const y: number = ((((event.clientY - rect.top) / gameState.canvasElement.clientHeight) * gameState.h) - gameState.translateY) * gameState.cameraDistance;
      return [x, y];
    }

    gameState.canvasElement.addEventListener('click', async (e: MouseEvent) => {
      const [x, y]: [number, number] = getCoordsByMouseEvent(e);
      character.target = getCellNumberByPixelCoords(x, y);
      if (character.position !== character.target && gameState.cells[character.target] !== CELL_STATE.BLOCKED) {
        const newPath = getPath(character.position, character.target);
        if (newPath && typeof newPath[0] === 'number' && newPath.length) character.path = newPath;
      }
    });

    gameState.canvasElement.addEventListener('mousemove', async (e: MouseEvent) => {
      const [x, y]: [number, number] = getCoordsByMouseEvent(e);
      pointerTarget = getCellNumberByPixelCoords(x, y);
    });

    window.addEventListener('keydown', (event: KeyboardEvent) => {
      pressedKey = event.code;
      character.direction = getDirectionByKey(event.code);
    });

    window.addEventListener('keyup', (event: KeyboardEvent) => {
      if (pressedKey === event.code) {
        pressedKey = undefined;
        character.direction = null;
      }
    });

    const debounceChangeCameraDistance = debounce(async (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      gameState.cameraDistance += gameState.cameraDistanceStep * Math.sign(event.deltaY);
      character.path = [];
      character.target = null;
    }, 10);
    window.addEventListener('wheel', debounceChangeCameraDistance);

    const debugGridCheckbox: HTMLInputElement = document.getElementById('debugGrid') as HTMLInputElement;
    debugGridCheckbox.addEventListener('change', (event) => {
      // @ts-ignore
      gameState.setDebugGrid(event.target.checked);
    });

    const debugDataCheckbox: HTMLInputElement = document.getElementById('debugData') as HTMLInputElement;
    debugDataCheckbox.addEventListener('change', (event) => {
      // @ts-ignore
      gameState.setDebugData(event.target.checked);
    });

    const ignoreVisionCheckbox: HTMLInputElement = document.getElementById('ignoreVision') as HTMLInputElement;
    ignoreVisionCheckbox.addEventListener('change', (event) => {
      // @ts-ignore
      gameState.setIgnoreVision(event.target.checked);
    });
  })();
})();
