export interface Figure {
  canvasElement: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;

  defaultFillStyle: string;
  defaultStrokeStyle: string;
  defaultTextStyle: string;

  hoverFillStyle: string;
  hoverStrokeStyle: string;
  hoverTextStyle: string;

  clickFillStyle: string;
  clickStrokeStyle: string;
  clickTextStyle: string;

  fillStyle: string;
  strokeStyle: string;
  textStyle: string;
}
