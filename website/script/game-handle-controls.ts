import { gameState } from './game-state';
import { debounce, getCellNumberByPixelCoords } from './utils';
import { movementSystem } from './systems';
import { playerStorage } from './data/player-storage';
import { enemiesStorage } from './data/enemies-storage';
import { DirectionKeyCodes } from './enums/direction-key-codes.enum';
import { ComponentKey } from './enums/component-key.enum';
import { PlayerControlsComponent } from './components';
import { CELL_STATE } from './enums/cell-state.enum';

export function gameHandleControls() {
  function getCoordsByMouseEvent(event: MouseEvent): [number, number] {
    const rect: DOMRect = gameState.canvasElement.getBoundingClientRect();
    const x: number = ((((event.clientX - rect.left) / gameState.canvasElement.clientWidth) * gameState.w) - gameState.translateX) * gameState.cameraDistance;
    const y: number = ((((event.clientY - rect.top) / gameState.canvasElement.clientHeight) * gameState.h) - gameState.translateY) * gameState.cameraDistance;
    return [x, y];
  }

  gameState.canvasElement.addEventListener('click', async (e: MouseEvent) => {
    const [x, y]: [number, number] = getCoordsByMouseEvent(e);
    const targetCell: number = getCellNumberByPixelCoords(x, y);
    const {
      cells,
    } = gameState;
    const isTree = cells[targetCell] === CELL_STATE.BLOCKED;
    const isEnemy = enemiesStorage.enemies.some(enemy => targetCell === enemy.getComponent(ComponentKey.POSITION).cellNumber);
    if (isTree) {
      // clicked on a tree
    } else if (isEnemy) {
      // clicked on an enemy
    } else {
      movementSystem.setTargetCell(playerStorage.playerCharacter, targetCell);
    }
  });

  gameState.canvasElement.addEventListener('mousemove', async (e: MouseEvent) => {
    const playerControl: PlayerControlsComponent = playerStorage.playerCharacter.getComponent(ComponentKey.PLAYER_CONTROLS);
    const [x, y]: [number, number] = getCoordsByMouseEvent(e);
    playerControl.mouseOver = getCellNumberByPixelCoords(x, y);
    playerControl.mouseCoords = [~~x, ~~y];
  });

  window.addEventListener('keydown', (event: KeyboardEvent) => {
    const playerControl: PlayerControlsComponent = playerStorage.playerCharacter.getComponent(ComponentKey.PLAYER_CONTROLS);
    playerControl.pressedKey = event.code as DirectionKeyCodes;
  });

  window.addEventListener('keyup', (event: KeyboardEvent) => {
    const playerControl: PlayerControlsComponent = playerStorage.playerCharacter.getComponent(ComponentKey.PLAYER_CONTROLS);
    if (playerControl.pressedKey === event.code) {
      playerControl.pressedKey = undefined;
    }
  });

  const debounceChangeCameraDistance = debounce(async (event: WheelEvent) => {
    event.preventDefault();
    event.stopPropagation();
    gameState.cameraDistance += gameState.cameraDistanceStep * Math.sign(event.deltaY);
    movementSystem.setTargetCell(playerStorage.playerCharacter, null);
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
}
