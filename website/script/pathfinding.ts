import {
  debounce,
  getCellNumberByPixelCoords,
  getNeighbors,
  getPath,
  getPixelCoordsByCellNumber,
} from './utils';
import {
  drawBackground,
  drawClock,
  drawDebugData,
  drawDebugGrid,
  drawEntityCharacter,
  drawEntityEnemy,
  drawEntityVision,
  drawGround,
  drawMinimap,
  drawPath,
  drawPointer,
  drawTree,
} from './draw';
import { gameState } from './game-state';
import { CELL_STATE } from './enums/cell-state.enum';
import { DIRECTION } from './enums/direction.enum';
import { Npc } from './types/npc';
import { imagesTrees, treesNew } from './data';
import { CharacterEntity } from './ecs/entity';
import { DirectionComponent, MovementComponent, NpcAnchorComponent, PositionComponent, VisionComponent } from './ecs/component';
import { movementSystem, visionSystem } from './ecs/system';
import { PlayerControlsComponent } from './ecs/component/player-controls-component';
import { DirectionKeyCodes } from './enums/direction-key-codes.enum';

(async () => {
  let fps: number;
  let requestTime: number;
  let pointerTarget: number|undefined;

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

  const playerCharacter: CharacterEntity = new CharacterEntity();
        playerCharacter.addComponent('vision', {
          visionRadiusCells: gameState.dayTimeVisionRadius,
          visionRadiusPx: gameState.dayTimeVisionRadius * gameState.cellSize,
          visibleCells: [],
          exploredCells: [],
        } as VisionComponent);
        playerCharacter.addComponent('position', {
          cellNumber: 272,
          coordsPx: getPixelCoordsByCellNumber(272),
        } as PositionComponent);
        playerCharacter.addComponent('movement', {
          targetCell: null,
          pressedKey: null,
          path: [],
          speed: 2,
        } as MovementComponent);
        playerCharacter.addComponent('direction', {
          direction: DIRECTION.DOWN,
        } as DirectionComponent);
        playerCharacter.addComponent('playerControls', {
          pressedKey: null,
          mouseOver: null,
        } as PlayerControlsComponent);

  const enemies: CharacterEntity[] = [
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
  ].map((enemyData: Npc) => {
    const enemyEntity: CharacterEntity = new CharacterEntity();

    enemyEntity.addComponent('vision', {
      visionRadiusCells: enemyData.visionRadius,
      visionRadiusPx: enemyData.visionRadiusPx,
      visibleCells: enemyData.visible,
      exploredCells: enemyData.explored,
    } as VisionComponent);

    enemyEntity.addComponent('position', {
      cellNumber: enemyData.position,
      coordsPx: enemyData.positionPx,
    } as PositionComponent);

    enemyEntity.addComponent('movement', {
      targetCell: enemyData.target,
      pressedKey: null, // NPCs may not have key presses
      path: enemyData.path,
      speed: enemyData.speed,
    } as MovementComponent);

    enemyEntity.addComponent('direction', {
      direction: enemyData.direction,
    } as DirectionComponent);

    enemyEntity.addComponent('npcAnchor', {
      cellNumber: enemyData.anchorPosition,
      radiusCells: enemyData.wanderingRadius,
    } as NpcAnchorComponent);

    return enemyEntity;
  });

  /**
   * Forces npc to chase player.
   */
  function chasePlayer(npc: CharacterEntity, targetPosition: PositionComponent) {
    const npcPosition: PositionComponent = npc.getComponent<PositionComponent>('position');

    const playerNeighbors: number[] = getNeighbors(targetPosition.cellNumber)
      .filter((cellNumber: number) => gameState.cells[cellNumber] !== CELL_STATE.BLOCKED);

    const closestNeighborPath: number[] = playerNeighbors.reduce((prevPath: number[]|null, cur: number) => {
      const newPath: number[] = getPath(npcPosition.cellNumber, cur);
      return !prevPath || (newPath.length < prevPath.length) ?  newPath : prevPath;
    }, null);

    if (closestNeighborPath && typeof closestNeighborPath[0] === 'number' && closestNeighborPath.length) {
      movementSystem.setTargetCell(npc, closestNeighborPath[closestNeighborPath.length  - 1]);
    }
  }

  /**
   * Check if cell is in screen bounds
   */
  const isWithinScreenBounds = (cellNumber: number) => {
    const playerCharacterPosition: PositionComponent = playerCharacter.getComponent<PositionComponent>('position');
    const visionRangeX: number = Math.round(gameState.cellsX * gameState.cameraDistance);
    const visionRangeY: number = Math.round(gameState.cellsY * gameState.cameraDistance);
    const inVisionVertically: boolean = Math.abs(Math.floor(cellNumber / gameState.cellsX) - Math.floor(playerCharacterPosition.cellNumber / gameState.cellsX)) - visionRangeX / gameState.cameraDistance <= visionRangeY;
    const inVisionHorizontally: boolean = Math.abs(Math.floor(cellNumber % gameState.cellsX) - Math.floor(playerCharacterPosition.cellNumber % gameState.cellsX)) - visionRangeY / gameState.cameraDistance <= visionRangeX;
    return inVisionVertically && inVisionHorizontally;
  };

  function draw(tick: number) {
    const playerCharacterPosition: PositionComponent = playerCharacter.getComponent<PositionComponent>('position');
    const playerCharacterMovement: MovementComponent = playerCharacter.getComponent<MovementComponent>('movement');
    const playerCharacterVision: VisionComponent = playerCharacter.getComponent<VisionComponent>('vision');
    const playerCharacterControls: PlayerControlsComponent = playerCharacter.getComponent<PlayerControlsComponent>('playerControls');

    gameState.setCtxScale(playerCharacterPosition);

    drawBackground('hsla(100, 100%, 75%, .5)');

    /**
     * NOTE: Need to draw ground and another objects using separate loops to avoid ground overlapping objects
     */
    for (let cellNumber: number = 0; cellNumber < gameState.cells.length; cellNumber++) {
      if (isWithinScreenBounds(cellNumber)) drawGround(cellNumber)
    }

    drawPath(playerCharacterMovement.path);

    for (let cellNumber: number = 0; cellNumber < gameState.cells.length; cellNumber++) {
      if (isWithinScreenBounds(cellNumber)) {
        const cellState: number = gameState.cells[cellNumber];
        if (gameState.ignoreVision || playerCharacterVision.exploredCells.includes(cellNumber)) {
          if (cellState === CELL_STATE.BLOCKED) drawTree(treeImages, cellNumber, playerCharacterPosition);
        }

        if (cellNumber === playerCharacterPosition.cellNumber) drawEntityCharacter(playerCharacter);

        enemies.forEach((enemy: CharacterEntity) => {
          const enemyPosition: PositionComponent = enemy.getComponent<PositionComponent>('position');
          if (
            cellNumber === enemyPosition.cellNumber
            && (gameState.ignoreVision || playerCharacterVision.visibleCells.includes(cellNumber))
          ) drawEntityEnemy(enemy);
        });
      }
    }

    let maxVisionPx: number = gameState.dayTimeVisionRadius * gameState.cellSize;
    let visiblePercent: number = playerCharacterVision.visionRadiusPx / maxVisionPx;
    let alpha: number = .4 + (.2 / visiblePercent);
    drawEntityVision(treeCells, playerCharacter, `rgba(0, 0, 0, ${alpha})`);

    drawPointer(playerCharacterControls.mouseOver, tick);

    drawDebugGrid();

    /**
     * Resetting scale to draw unscalable elements (eg. HUD)
     */
    gameState.restoreCtxScale();

    drawClock();
    drawMinimap(gameState.cameraDistance, playerCharacter);
    drawDebugData({
      FPS: fps,
      time: Math.round(gameState.time),
      isNight: gameState.isNight,
    });
  }

  function gameLoop() {
    const playerCharacterPosition: PositionComponent = playerCharacter.getComponent<PositionComponent>('position');
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
      visionSystem.setCharacterVisionRadius(playerCharacter, newCellsVisionRadius);
      visionSystem.setCharacterVisionRadiusPx(playerCharacter, newPxVisionRadius);
    }

    /**
     * Enemies movement/vision/chase behavior
     */
    for (let enemy of enemies) {
      const enemyVision: VisionComponent = enemy.getComponent<VisionComponent>('vision');
      const enemyMovement: MovementComponent = enemy.getComponent<MovementComponent>('movement');
      const enemyNpcAnchor: NpcAnchorComponent = enemy.getComponent<NpcAnchorComponent>('npcAnchor')
      const enemyPosition: PositionComponent = enemy.getComponent<PositionComponent>('position');

      if (enemyVision.visibleCells.includes(playerCharacterPosition.cellNumber)) chasePlayer(enemy, playerCharacterPosition);
      if (
        !enemyMovement.path.length
        && !enemyVision.visibleCells.includes(playerCharacterPosition.cellNumber)
        && enemyNpcAnchor.cellNumber !== enemyPosition.cellNumber
      ) {
        movementSystem.setTargetCell(enemy, enemyNpcAnchor.cellNumber);
      }
    }

    movementSystem.update([playerCharacter, ...enemies]);
    visionSystem.update([playerCharacter, ...enemies], treeCells);

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
      const targetCell: number = getCellNumberByPixelCoords(x, y);
      movementSystem.setTargetCell(playerCharacter, targetCell);
    });

    gameState.canvasElement.addEventListener('mousemove', async (e: MouseEvent) => {
      const playerControl: PlayerControlsComponent = playerCharacter.getComponent<PlayerControlsComponent>('playerControls');
      const [x, y]: [number, number] = getCoordsByMouseEvent(e);
      playerControl.mouseOver = getCellNumberByPixelCoords(x, y);
    });

    window.addEventListener('keydown', (event: KeyboardEvent) => {
      const playerControl: PlayerControlsComponent = playerCharacter.getComponent<PlayerControlsComponent>('playerControls');
      playerControl.pressedKey = event.code as DirectionKeyCodes;
    });

    window.addEventListener('keyup', (event: KeyboardEvent) => {
      const playerControl: PlayerControlsComponent = playerCharacter.getComponent<PlayerControlsComponent>('playerControls');
      if (playerControl.pressedKey === event.code) {
        playerControl.pressedKey = undefined;
      }
    });

    const debounceChangeCameraDistance = debounce(async (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      gameState.cameraDistance += gameState.cameraDistanceStep * Math.sign(event.deltaY);
      movementSystem.setTargetCell(playerCharacter, null);
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
