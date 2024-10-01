import { gameState } from './game-state';
import { gameHandleControls } from './game-handle-controls';
import { treesNew } from './data';
import { gameRenderLoop } from './game-render-loop';
import { gameTimerLoop } from './game-timer-loop';

(async () => {
  gameState.setBlockedCells(treesNew);

  gameState.setCanvasSizes();

  gameTimerLoop();

  gameRenderLoop(0);

  gameHandleControls();
})();
