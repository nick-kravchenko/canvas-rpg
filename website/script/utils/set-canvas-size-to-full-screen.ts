import { debounce } from './debounce';

function setCanvas(canvasElement: HTMLCanvasElement) {
  const canvasWidth = canvasElement.width;
  const canvasHeight = canvasElement.height;
  const canvasDimension = canvasWidth / canvasHeight;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const screenDimension = screenWidth / screenHeight;
  if (screenDimension > canvasDimension) {
    canvasElement.style.width = 'auto';
    canvasElement.style.height = screenHeight + 'px';
  } else {
    canvasElement.style.width = screenWidth + 'px';
    canvasElement.style.height = 'auto';
  }
}

export function setCanvasSizeToFullScreen(canvasElement: HTMLCanvasElement) {
  setCanvas(canvasElement);
  const debouncedResize = debounce(() => {
    setCanvas(canvasElement);
  }, 200);
  window.addEventListener('resize', debouncedResize);
}
