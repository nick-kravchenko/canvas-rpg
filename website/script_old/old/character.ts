import { Figure } from './figure';

export class Character {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  targetX: number;
  targetY: number;
  image: HTMLImageElement;
  moveCharacterInterval: NodeJS.Timeout;
  blockedSquares: Figure[];
  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    targetX: number,
    targetY: number,
    imageSrc: string,
    blockedSquares: Figure[],
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = x + width / 2;
    this.y = y + width / 2;
    this.width = width;
    this.height = height;
    this.targetX = targetX;
    this.targetY = targetY;
    this.image = new Image();
    this.image.src = imageSrc;
    this.blockedSquares = blockedSquares;
  }
  set target([x, y]: [number, number]) {
    this.targetX = x + this.width / 2;
    this.targetY = y + this.width / 2;
    clearInterval(this.moveCharacterInterval);
    this.moveCharacterInterval = setInterval(() => {
      this.moveCharacter();
    }, 10);
  }
  moveCharacter() {
    if (typeof this.targetX === 'number' && typeof this.targetY === 'number') {
      let nextX: number = this.x;
      let nextY: number = this.y;
      if (this.targetX !== this.x) {
        nextX = this.targetX > this.x ? this.x + 1 : this.x - 1;
      }
      if (this.targetY !== this.y) {
        nextY = this.targetY > this.y ? this.y + 1 : this.y - 1;
      }
      const isBlocked = this.blockedSquares.some(({x, y}: {x: number, y: number}) => {
        return nextX === x && nextY === y;
      })
      if (!isBlocked) {
        if (this.x !== nextX) this.x = nextX;
        if (this.y !== nextY) this.y = nextY;
      }
    }
  }
  draw() {
    const isFlipped = this.x > this.targetX;
    this.ctx.save();
    if (isFlipped) {
      this.ctx.scale(-1, 1);
    }
    this.ctx.drawImage(
      this.image,
      isFlipped ? (this.x * -1) - this.width : this.x,
      this.y,
      this.width,
      this.height,
    );
    this.ctx.restore();
  }
}
