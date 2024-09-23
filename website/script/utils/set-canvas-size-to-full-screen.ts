function throttle(mainFunction: Function, delay: number) {
  let timerFlag: any = null; // Variable to keep track of the timer

  // Returning a throttled version
  return (...args: any) => {
    if (timerFlag === null) { // If there is no timer currently running
      mainFunction(...args); // Execute the main function
      timerFlag = setTimeout(() => { // Set a timer to clear the timerFlag after the specified delay
        timerFlag = null; // Clear the timerFlag to allow the main function to be executed again
      }, delay);
    }
  };
}

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
  window.addEventListener('resize', (event) => {
    throttle(() => {
      setCanvas(canvasElement);
    }, 1000)
  })
}
