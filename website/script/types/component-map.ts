import { ComponentKey } from './component-key.enum';
import {
  AttackComponent,
  DirectionComponent,
  HealthComponent,
  MovementComponent,
  NpcAnchorComponent,
  PlayerControlsComponent,
  PositionComponent,
  StateComponent,
  VisionComponent,
} from '../components';

export interface ComponentMap {
  [ComponentKey.ATTACK]: AttackComponent,
  [ComponentKey.DIRECTION]: DirectionComponent,
  [ComponentKey.HEALTH]: HealthComponent,
  [ComponentKey.MOVEMENT]: MovementComponent,
  [ComponentKey.NPC_ANCHOR]: NpcAnchorComponent,
  [ComponentKey.PLAYER_CONTROLS]: PlayerControlsComponent,
  [ComponentKey.POSITION]: PositionComponent,
  [ComponentKey.STATE]: StateComponent,
  [ComponentKey.VISION]: VisionComponent,
}
