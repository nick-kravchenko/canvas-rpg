import { Figure } from './figure';

export class Square implements Figure {
  canvasElement: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  defaultFillStyle: string = `rgba(255, 255, 255, 0)`;
  defaultStrokeStyle: string = `rgba(0, 0, 0, .07)`;
  defaultTextStyle: string;
  hoverFillStyle: string;
  hoverStrokeStyle: string = `rgba(255, 0, 0, 1)`;
  hoverTextStyle: string;
  clickFillStyle: string = `rgba(255, 0, 0, 1)`;
  clickStrokeStyle: string;
  clickTextStyle: string;
  fillStyle: string = this.defaultFillStyle;
  strokeStyle: string = this.defaultStrokeStyle;
  textStyle: string;

  path2D: Path2D;

  constructor(
    canvasElement: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    defaultFillStyle: string,
    defaultStrokeStyle: string,
    defaultTextStyle: string,
    hoverFillStyle: string,
    hoverStrokeStyle: string,
    hoverTextStyle: string,
    clickFillStyle: string,
    clickStrokeStyle: string,
    clickTextStyle: string,
  ) {
    this.canvasElement = canvasElement;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.defaultFillStyle = defaultFillStyle;
    this.defaultStrokeStyle = defaultStrokeStyle;
    this.defaultTextStyle = defaultTextStyle;
    this.hoverFillStyle = hoverFillStyle;
    this.hoverStrokeStyle = hoverStrokeStyle;
    this.hoverTextStyle = hoverTextStyle;
    this.clickFillStyle = clickFillStyle;
    this.clickStrokeStyle = clickStrokeStyle;
    this.clickTextStyle = clickTextStyle;
    this.fillStyle = defaultFillStyle;
    this.strokeStyle = defaultStrokeStyle;
    this.textStyle = defaultTextStyle;
    this.path2D = new Path2D();
    this.path2D.rect(this.x, this.y, this.width, this.height);
  }

  draw() {
    this.ctx.save();
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.stroke(this.path2D);
    this.ctx.fill(this.path2D);
    this.ctx.fillStyle = `#000`;
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`${this.x} ${this.y}`, this.x + this.width / 2, this.y + this.height / 2);
    this.ctx.restore();
  }

  isHovered(x: number, y: number) {
    x = ((x / this.canvasElement.clientWidth) * this.canvasElement.width);
    y = ((y / this.canvasElement.clientHeight) * this.canvasElement.height);
    const isHovered = this.ctx.isPointInPath(this.path2D, x, y);
    if (isHovered) {
      this.onMouseIn();
    } else {
      this.onMouseOut();
    }
  }
  onMouseIn() {
    if (this.strokeStyle !== this.hoverStrokeStyle) {
      this.strokeStyle = this.hoverStrokeStyle;
    }
  }
  onMouseOut() {
    if (this.strokeStyle !== this.defaultStrokeStyle) {
      this.strokeStyle = this.defaultStrokeStyle;
    }
  }
  onClick() {
    if (this.fillStyle !== this.clickFillStyle) {
      this.fillStyle = this.clickFillStyle;
      setTimeout(() => {
        this.fillStyle = this.defaultFillStyle;
      }, 500);
    }
  }
}
