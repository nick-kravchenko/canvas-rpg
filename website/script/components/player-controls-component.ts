import { DirectionKeyCodes } from '../types/direction-key-codes.enum';

export interface PlayerControlsComponent {
  pressedKey: DirectionKeyCodes|null;
  mouseOver: number|null;
  mouseCoords: [number, number]|null;
}
