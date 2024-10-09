export type Point = [number, number];
export type Line = [Point, Point];
export class Rectangle {
  position: Point;
  width: number;
  height: number;
  constructor(position: Point, width: number, height: number) {
    this.position = position;
    this.width = width;
    this.height = height;
  }
}
export class Circle {
  center: Point;
  radius: number;
  constructor(point: Point, radius: number) {
    this.center = point;
    this.radius = radius;
  }
}