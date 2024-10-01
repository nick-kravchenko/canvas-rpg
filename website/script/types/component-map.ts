import { ComponentKey } from '../enums/component-key.enum';
import {
  DirectionComponent,
  MovementComponent,
  NpcAnchorComponent,
  PlayerControlsComponent,
  PositionComponent,
  VisionComponent
} from '../ecs/component';

export interface ComponentMap {
  [ComponentKey.VISION]: VisionComponent,
  [ComponentKey.POSITION]: PositionComponent,
  [ComponentKey.MOVEMENT]: MovementComponent,
  [ComponentKey.DIRECTION]: DirectionComponent,
  [ComponentKey.PLAYER_CONTROLS]: PlayerControlsComponent,
  [ComponentKey.NPC_ANCHOR]: NpcAnchorComponent,
}
