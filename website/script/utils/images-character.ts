// @ts-ignore
import characterFrontPng from '../../images/char-front.png';
// @ts-ignore
import characterBackPng from '../../images/char-back.png';
// @ts-ignore
import characterLeftPng from '../../images/char-left.png';
// @ts-ignore
import characterRightPng from '../../images/char-right.png';

export const imagesCharacter = {
  front: new Image(),
  back: new Image(),
  left: new Image(),
  right: new Image(),
};
imagesCharacter.front.src = characterFrontPng;
imagesCharacter.back.src = characterBackPng;
imagesCharacter.left.src = characterLeftPng;
imagesCharacter.right.src = characterRightPng;
