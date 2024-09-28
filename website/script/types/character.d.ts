import { DIRECTION } from '../enums/direction.enum';

export interface Character {
  position: number;
  positionPx: [number, number];
  target: number;
  path: number[];
  explored: number[];
  visible: number[];
  direction: DIRECTION;
  speed: number;
  visionRadius: number;
  visionRadiusPx: number;
}
