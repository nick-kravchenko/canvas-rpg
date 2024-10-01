import { gameState } from './game-state';
import { debounce, getCellNumberByPixelCoords } from './utils';
import { movementSystem } from './ecs/system';
import { playerCharacter } from './data/player';
import { PlayerControlsComponent } from './ecs/component/player-controls-component';
import { DirectionKeyCodes } from './enums/direction-key-codes.enum';

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
}
