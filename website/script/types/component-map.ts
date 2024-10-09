import { ComponentKey } from './component-key.enum';
import {
  DirectionComponent,
  HealthComponent,
  MovementComponent,
  NpcAnchorComponent,
  PlayerControlsComponent,
  PositionComponent,
  VisionComponent,
} from '../components';

export interface ComponentMap {
  [ComponentKey.DIRECTION]: DirectionComponent,
  [ComponentKey.HEALTH]: HealthComponent,
  [ComponentKey.MOVEMENT]: MovementComponent,
  [ComponentKey.NPC_ANCHOR]: NpcAnchorComponent,
  [ComponentKey.PLAYER_CONTROLS]: PlayerControlsComponent,
  [ComponentKey.POSITION]: PositionComponent,
  [ComponentKey.VISION]: VisionComponent,
}
