
import { Square } from './square';
import { Character } from './character';

const squareSize = 40;
const config = {
  width: 1280,
  height: 720,
}
const canvasElement: HTMLCanvasElement = document.getElementById('main-canvas') as HTMLCanvasElement;
canvasElement.width = config.width;
canvasElement.height = config.height;
const ctx = canvasElement.getContext('2d');

const figures: Square[] = [];
for (let i = 0; i <= config.width / squareSize; i++) {
  for (let k = 0; k <= config.height / squareSize; k++) {
    figures.push(
      new Square(
        canvasElement,
        ctx,
        i*squareSize,
        k*squareSize,
        squareSize,
        squareSize,
        `rgba(255, 255, 255, 1)`,
        `rgba(0, 0, 0, 1)`,
        `rgba(0, 0, 0, 1)`,
        `rgba(255, 255, 255, 0)`,
        `rgba(255, 0, 0, 1)`,
        `rgba(0, 0, 0, 1)`,
        `rgba(255, 0, 0, 1)`,
        `rgba(255, 0, 0, 1)`,
        `rgba(0, 0, 0, 1)`,
      )
    );
  }
}
const wall: Square[] = [];
for (let i = 0; i <= config.width / squareSize; i++) {
  wall.push(
    new Square(
      canvasElement,
      ctx,
      i*squareSize,
      360,
      squareSize,
      squareSize,
      `rgba(255, 0, 0, 1)`,
      `rgba(0, 0, 0, 1)`,
      `rgba(0, 0, 0, 1)`,
      `rgba(255, 255, 255, 0)`,
      `rgba(255, 0, 0, 1)`,
      `rgba(0, 0, 0, 1)`,
      `rgba(255, 0, 0, 1)`,
      `rgba(255, 0, 0, 1)`,
      `rgba(0, 0, 0, 1)`,
    )
  );
}

const character = new Character(
  canvasElement,
  ctx,
  squareSize,
  squareSize,
  squareSize / 2,
  squareSize / 2,
  0,
  0,
  'https://art.pixilart.com/794b51ccd0c1531.gif',
  wall,
);

canvasElement.addEventListener('mousemove', (event) => {
  figures.forEach((figure) => {
    figure.isHovered(event.clientX, event.clientY);
  });
});

canvasElement.addEventListener('click', (event) => {
  figures.forEach((figure) => {
    const x = ((event.x / canvasElement.clientWidth) * config.width);
    const y = ((event.y / canvasElement.clientHeight) * config.height);
    const isClicked = figure.ctx.isPointInPath(figure.path2D, x, y);
    if (isClicked) {
      figure.onClick();
      character.target = [figure.x, figure.y];
    }
  });
});

function play(ticker: number = 0) {
  ctx.clearRect(0, 0, config.width, config.height);
  try {
    /**
     * Drawing a field.
     */
    figures.forEach(figure => {
      figure.draw();
    });
    /**
     * Drawing a wall.
     */
    wall.forEach(figure => {
      figure.draw();
    });

    /**
     * Drawing a character
     */
    character.draw();
  } catch (error) {
    console.log(error)
  }

  window.requestAnimationFrame((ticker) => {
    play(ticker);
  });
}

play();
