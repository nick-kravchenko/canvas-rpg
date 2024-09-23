// @ts-ignore
import treePng from '../../images/tree.png';
// @ts-ignore
import tree3Png from '../../images/tree3.png';
// @ts-ignore
import tree4Png from '../../images/tree4.png';
// @ts-ignore
import tree5Png from '../../images/tree5.png';

const imagesTreesPng = [
  treePng,
  // tree1Png,
  // tree2Png,
  tree3Png,
  tree4Png,
  tree5Png
];

export const imagesTrees: HTMLImageElement[] = [];
for (let i = 0; i < imagesTreesPng.length; i++) {
  imagesTrees[i] = new Image();
  imagesTrees[i].src = imagesTreesPng[i];
}
