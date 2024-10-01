import { DirectionKeyCodes } from '../../enums/direction-key-codes.enum';

export interface PlayerControlsComponent {
  pressedKey: DirectionKeyCodes|null;
  mouseOver: number|null;
}
