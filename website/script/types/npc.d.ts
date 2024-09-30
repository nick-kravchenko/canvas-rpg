import { Character } from './character';

export interface Npc extends Character {
  anchorPosition: number;
  wanderingRadius: number;
}
