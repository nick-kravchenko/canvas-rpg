import { CharacterEntity } from '../entity';
import { movementSystem } from './movement-system';
import { MovementComponent, NpcAnchorComponent, PositionComponent, VisionComponent } from '../component';
import { ComponentKey } from '../../enums/component-key.enum';

class AiSystem {
  update(npcEntities: CharacterEntity[], playerEntity: CharacterEntity) {
    const playerPosition: PositionComponent = playerEntity.getComponent(ComponentKey.POSITION);

    npcEntities.forEach((npcEntity) => {
      const vision: VisionComponent = npcEntity.getComponent(ComponentKey.VISION);
      const movement: MovementComponent = npcEntity.getComponent(ComponentKey.MOVEMENT);
      const npcAnchor: NpcAnchorComponent = npcEntity.getComponent(ComponentKey.NPC_ANCHOR);
      const npcPosition: PositionComponent = npcEntity.getComponent(ComponentKey.POSITION);

      // If player is in sight, move to player
      if (
        vision.visibleCells.includes(playerPosition.cellNumber) &&
        playerPosition.cellNumber !== movement.targetCell
      ) {
        movementSystem.moveToEntity(npcEntity, playerEntity);
      }

      // If no path and player is not visible, return to the anchor point
      if (
        !movement.path.length &&
        !vision.visibleCells.includes(playerPosition.cellNumber) &&
        npcAnchor.cellNumber !== npcPosition.cellNumber
      ) {
        movementSystem.setTargetCell(npcEntity, npcAnchor.cellNumber);
      }
    });
  }
}

export const aiSystem = new AiSystem();
