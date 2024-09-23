import { DIRECTION } from '../enums/direction.enum';
import { DirectionKeyCodes } from '../enums/direction-key-codes.enum';

export function getDirectionByKey(pressedKey: KeyboardEvent['code']): DIRECTION {
  switch (pressedKey) {
    case DirectionKeyCodes.KeyW:
    case DirectionKeyCodes.ArrowUp:
      return DIRECTION.UP;
    case DirectionKeyCodes.KeyA:
    case DirectionKeyCodes.ArrowLeft:
      return DIRECTION.LEFT;
    case DirectionKeyCodes.KeyS:
    case DirectionKeyCodes.ArrowDown:
      return DIRECTION.DOWN;
    case DirectionKeyCodes.KeyD:
    case DirectionKeyCodes.ArrowRight:
      return DIRECTION.RIGHT;
  }
}
