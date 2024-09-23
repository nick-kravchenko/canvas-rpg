import { DIRECTION } from '../enums/direction.enum';
import { imagesCharacter } from './images-character';

export function getCharacterImageByDirection(direction: DIRECTION): HTMLImageElement {
  switch (direction) {
    case DIRECTION.UP:
      return imagesCharacter.back;
    case DIRECTION.RIGHT:
      return imagesCharacter.right;
    case DIRECTION.LEFT:
      return imagesCharacter.left;
    case DIRECTION.DOWN:
    default:
      return imagesCharacter.front;
  }
}
