import { DIRECTION } from '../types/direction.enum';
import { imagesCharacter } from '../data';

export function getCharacterImageByDirection(direction: DIRECTION): HTMLImageElement {
  switch (direction) {
    case DIRECTION.UP:
      return imagesCharacter.back;
    case DIRECTION.RIGHT:
      return imagesCharacter.right;
    case DIRECTION.LEFT:
      return imagesCharacter.left;
    case DIRECTION.DOWN:
      return imagesCharacter.front;
    default:
      return imagesCharacter.idle;
  }
}
