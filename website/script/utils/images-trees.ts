// @ts-ignore
import Autumn_tree1_PNG from '../../images/trees/separately/Trees_texture_shadow_dark/Autumn_tree1.png';
// @ts-ignore
import Autumn_tree2_PNG from '../../images/trees/separately/Trees_texture_shadow_dark/Autumn_tree2.png';
// @ts-ignore
import Autumn_tree3_PNG from '../../images/trees/separately/Trees_texture_shadow_dark/Autumn_tree3.png';
// @ts-ignore
import Broken_tree1_PNG from '../../images/trees/separately/Trees_texture_shadow_dark/Broken_tree1.png';
// @ts-ignore
import Broken_tree2_PNG from '../../images/trees/separately/Trees_texture_shadow_dark/Broken_tree2.png';
// @ts-ignore
import Broken_tree3_PNG from '../../images/trees/separately/Trees_texture_shadow_dark/Broken_tree3.png';
// @ts-ignore
import Broken_tree4_PNG from '../../images/trees/separately/Trees_texture_shadow_dark/Broken_tree4.png';
// @ts-ignore
import Broken_tree5_PNG from '../../images/trees/separately/Trees_texture_shadow_dark/Broken_tree5.png';
// @ts-ignore
import Broken_tree6_PNG from '../../images/trees/separately/Trees_texture_shadow_dark/Broken_tree6.png';
// @ts-ignore
import Broken_tree7_PNG from '../../images/trees/separately/Trees_texture_shadow_dark/Broken_tree7.png';
// @ts-ignore
import Fruit_tree1_PNG from '../../images/trees/separately/Trees_texture_shadow_dark/Fruit_tree1.png';
// @ts-ignore
import Fruit_tree2_PNG from '../../images/trees/separately/Trees_texture_shadow_dark/Fruit_tree2.png';
// @ts-ignore
import Fruit_tree3_PNG from '../../images/trees/separately/Trees_texture_shadow_dark/Fruit_tree3.png';

const imagesTreesPng = [
  Autumn_tree1_PNG,
  Autumn_tree2_PNG,
  Autumn_tree3_PNG,
  Broken_tree1_PNG,
  Broken_tree2_PNG,
  Broken_tree3_PNG,
  Broken_tree4_PNG,
  Broken_tree5_PNG,
  Broken_tree6_PNG,
  Broken_tree7_PNG,
  Fruit_tree1_PNG,
  Fruit_tree2_PNG,
  Fruit_tree3_PNG,
];

export const imagesTrees: HTMLImageElement[] = [];
for (let i = 0; i < imagesTreesPng.length; i++) {
  imagesTrees[i] = new Image();
  imagesTrees[i].src = imagesTreesPng[i];
}
