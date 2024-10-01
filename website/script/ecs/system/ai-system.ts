import { CharacterEntity } from '../entity';
import { MovementComponent, NpcAnchorComponent, PositionComponent, VisionComponent } from '../component';
import { getNeighbors, getPath } from '../../utils';
import { gameState } from '../../game-state';
import { CELL_STATE } from '../../enums/cell-state.enum';
import { movementSystem } from './movement-system';

class AiSystem {
  chasePlayer(npc: CharacterEntity, targetPosition: PositionComponent) {
    const npcPosition: PositionComponent = npc.getComponent<PositionComponent>('position');

    const playerNeighbors: number[] = getNeighbors(targetPosition.cellNumber)
      .filter((cellNumber: number) => {
        return gameState.cells[cellNumber] !== CELL_STATE.BLOCKED;
      });

    const closestNeighborPath: number[] = playerNeighbors.reduce((prevPath: number[]|null, cur: number) => {
      const newPath: number[] = getPath(npcPosition.cellNumber, cur);
      return !prevPath || (newPath.length < prevPath.length) ?  newPath : prevPath;
    }, null);

    const isNearPlayer: boolean = playerNeighbors.includes(npcPosition.cellNumber);

    if (isNearPlayer) { return; }

    if (closestNeighborPath?.length) {
      movementSystem.setTargetCell(npc, closestNeighborPath[closestNeighborPath.length  - 1]);
    }
  }

  update(npcEntities: CharacterEntity[], playerCharacter: CharacterEntity) {
    const playerPosition: PositionComponent = playerCharacter.getComponent<PositionComponent>('position');

    npcEntities.forEach((npc) => {
      const vision: VisionComponent = npc.getComponent<VisionComponent>('vision');
      const movement: MovementComponent = npc.getComponent<MovementComponent>('movement');
      const npcAnchor: NpcAnchorComponent = npc.getComponent<NpcAnchorComponent>('npcAnchor');
      const npcPosition: PositionComponent = npc.getComponent<PositionComponent>('position');

      // If player is in sight, chase the player
      if (
        vision.visibleCells.includes(playerPosition.cellNumber) &&
        playerPosition.cellNumber !== movement.targetCell
      ) {
        this.chasePlayer(npc, playerPosition);
      }

      // If no path and player is not visible, return to the anchor point
      if (
        !movement.path.length &&
        !vision.visibleCells.includes(playerPosition.cellNumber) &&
        npcAnchor.cellNumber !== npcPosition.cellNumber
      ) {
        movementSystem.setTargetCell(npc, npcAnchor.cellNumber);
      }
    });
  }
}

export const aiSystem = new AiSystem();
