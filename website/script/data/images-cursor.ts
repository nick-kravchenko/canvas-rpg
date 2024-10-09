// @ts-expect-error
import stepsSvg from '../../images/kenney-cursor-pack/Vector/Outline/steps.svg';
const stepsCursorImg: HTMLImageElement = new Image(); stepsCursorImg.src = stepsSvg;
// @ts-expect-error
import pointer_iSvg from '../../images/kenney-cursor-pack/Vector/Outline/pointer_i.svg';
const pointerICursorImg: HTMLImageElement = new Image(); pointerICursorImg.src = pointer_iSvg;
// @ts-expect-error
import toolAxeSvg from '../../images/kenney-cursor-pack/Vector/Outline/tool_axe.svg';
const toolAxeImg: HTMLImageElement = new Image(); toolAxeImg.src = toolAxeSvg;
// @ts-expect-error
import handClosedSvg from '../../images/kenney-cursor-pack/Vector/Outline/hand_closed.svg';
const handClosedImg: HTMLImageElement = new Image(); handClosedImg.src = handClosedSvg;

export {
  stepsCursorImg,
  pointerICursorImg,
  toolAxeImg,
  handClosedImg,
}
