import { clamp, getBlockedCells, setCanvasSizeToFullScreen } from './utils';
import { CELL_STATE } from './enums/cell-state.enum';
import { PositionComponent } from './ecs/component';

class GameState {
  debugGrid: boolean = false;
  debugData: boolean = false;
  ignoreVision: boolean = false;
  private _debug: {
    [key: string]: string|number|boolean;
  } = {};
  set debug(newDebug: {
    [key: string]: any;
  }) {
    this._debug = {
      ...this._debug,
      ...newDebug,
    }
  }
  get debug(): {
    [key: string]: any;
  } {
    return this._debug;
  }

  canvasElement: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;

  /**
   * Field config
   */
  cellSize: number = 64;
  cellsX: number = 32;
  cellsY: number = 16;
  w: number = this.cellSize * this.cellsX;
  h: number = this.cellSize * this.cellsY;
  cells: Int8Array = new Int8Array(this.cellsX * this.cellsY).fill(CELL_STATE.UNVISITED);

  gameTickRate: number = 1000 / 128; // 128hz

  /**
   * Day and Night config
   */
  dayNightCycle: number = .25 * 60 * 1000; // 6 minutes
  dayTimeVisionRadius: number = 6;
  nightTimeVisionRadius: number = 4;
  isNight: boolean = false;
  time: number = 0;

  /**
   * Camera config
   */
  public cameraDistanceStep: number = .1;
  private minCameraDistance: number = .4;
  private maxCameraDistance: number = 1;
  private _cameraDistance: number = 1; // 1 = 100% = max distance
  get cameraDistance() {
    return this._cameraDistance;
  }
  set cameraDistance(distance: number) {
    this._cameraDistance = clamp(distance, this.minCameraDistance, this.maxCameraDistance);
  }
  translateX: number = 0;
  translateY: number = 0;

  constructor() {
    this.canvasElement = document.getElementById('main-canvas') as HTMLCanvasElement;
    if (!this.canvasElement) {
      throw new Error("Canvas element not found");
    }

    this.ctx = this.canvasElement.getContext('2d');
    if (!this.ctx) {
      throw new Error("Could not get canvas rendering context");
    }
    this.prefillDebugState();
  }

  setCanvasSizes(): void {
    try {
      setCanvasSizeToFullScreen(this.canvasElement);
      this.canvasElement.width = this.w;
      this.canvasElement.height = this.h;
    } catch (e) {
      console.error(e);
    }
  }

  setDebugGrid(value: boolean) { this.debugGrid = value; }
  setDebugData(value: boolean) { this.debugData = value; }
  setIgnoreVision(value: boolean) { this.ignoreVision = value; }
  setIsNight(value: boolean) { this.isNight = value; }
  setTime(time: number) { this.time = time; }
  setBlockedCells(blockedCells: number[]) {
    this.cells = getBlockedCells(gameState.cells, blockedCells)
  }
  setCtxScale(playerCharacterPosition: PositionComponent) {
    this.ctx.save();
    const scale: number = 1 / this.cameraDistance; // Calculate scaling factor based on zoom level
    // Get character's position in pixel coordinates
    const [characterX, characterY]: [number, number] = playerCharacterPosition.coordsPx;
    // Calculate the maximum and minimum allowable translations
    const maxTranslateX: number = 0;
    const maxTranslateY: number = 0;
    const minTranslateX: number = this.w - (this.w * scale); // Prevent going past the right boundary
    const minTranslateY: number = this.h - (this.h * scale); // Prevent going past the bottom boundary
    // Apply initial translation to center the camera on the character
    this.translateX = this.w / 2 - characterX * scale;
    this.translateY = this.h / 2 - characterY * scale;
    // Clamp the translation to stay within the world bounds
    this.translateX = Math.min(maxTranslateX, Math.max(minTranslateX, this.translateX));
    this.translateY = Math.min(maxTranslateY, Math.max(minTranslateY, this.translateY));
    this.ctx.translate(this.translateX, this.translateY);
    this.ctx.scale(scale, scale);
  }
  restoreCtxScale() {
    this.ctx.resetTransform();
    this.ctx.restore();
  }

  // Add more setters/getters as needed
  prefillDebugState() {
    const debugGridCheckbox: HTMLInputElement = document.getElementById('debugGrid') as HTMLInputElement;
    this.debugGrid = debugGridCheckbox.checked;
    const debugDataCheckbox: HTMLInputElement = document.getElementById('debugData') as HTMLInputElement;
    this.debugData = debugDataCheckbox.checked;
    const ignoreVisionCheckbox: HTMLInputElement = document.getElementById('ignoreVision') as HTMLInputElement;
    this.ignoreVision = ignoreVisionCheckbox.checked;
  }
}

export const gameState = new GameState();
