import { GameObject } from '../entities';
import { ComponentKey } from '../types/component-key.enum';
import { CharacterStateEnum } from '../types/character-state.enum';
import { AttackComponent, DirectionComponent, HealthComponent, MovementComponent, StateComponent } from '../components';
import { DIRECTION } from '../types/direction.enum';

class StateSystem {
  update(entities: GameObject[]) {
    for (const entity of entities) {
      const stateComponent: StateComponent = entity.getComponent(ComponentKey.STATE);

      switch (stateComponent.state) {
        case CharacterStateEnum.IDLE:
          this.handleIdleState(entity);
          break;

        case CharacterStateEnum.MOVING:
          this.handleMovingState(entity);
          break;

        case CharacterStateEnum.ATTACKING:
          this.handleAttackingState(entity);
          break;

        case CharacterStateEnum.DEAD:
          this.handleDeadState(entity);
          break;

        default:
          console.log(`Unknown state: ${stateComponent.state}`);
      }
    }
  }

  // Handle each state with its own method for clarity
  handleIdleState(entity: GameObject) {
    // Perform idle behavior, like playing idle animations
    console.log(`GameObject ${entity} is idle.`);
  }

  handleMovingState(entity: GameObject) {
    // Update the entity's position using a movement system
    const movementComponent: MovementComponent = entity.getComponent(ComponentKey.MOVEMENT);
    const directionComponent: DirectionComponent = entity.getComponent(ComponentKey.DIRECTION);
    const direction: DIRECTION = directionComponent.direction;
    const speed: number = movementComponent.speed;
    //
    // // Call a movement system or directly apply movement logic
    // entity.position.x += direction.x * speed;
    // entity.position.y += direction.y * speed;

    console.log(`GameObject ${entity} is moving. In direction ${direction}. With speed ${speed}`);
  }

  handleAttackingState(entity: GameObject) {
    // Handle attack logic, such as dealing damage or triggering animations
    const attackComponent: AttackComponent = entity.getComponent(ComponentKey.ATTACK);

    // Example: Deal damage to nearby enemies
    const enemiesInRange: GameObject[] = this.getEnemiesInRange(entity, attackComponent.range);
    for (const enemy of enemiesInRange) {
      this.dealDamage(enemy, attackComponent.damage);
    }

    console.log(`GameObject ${entity} is attacking.`);
  }

  handleDeadState(entity: GameObject) {
    // Handle dead state, like playing death animations, removing the entity from play, etc.
    // entity.isActive = false; // Example: Mark the entity as inactive or start a respawn timer
    console.log(`GameObject ${entity} is dead.`);
  }

  getEnemiesInRange(entity: GameObject, range: number): GameObject[] {
    // Placeholder logic to get all enemies within a range
    // This would depend on how you're managing entities in your ECS
    console.log(entity, range);
    return [];
  }

  dealDamage(enemy: GameObject, damage: number) {
    const healthComponent: HealthComponent = enemy.getComponent(ComponentKey.HEALTH);
    healthComponent.current -= damage;
    if (healthComponent.current <= 0) {
      healthComponent.current = 0;
      enemy.getComponent(ComponentKey.STATE).state = CharacterStateEnum.DEAD;
    }
  }
}

export const stateSystem = new StateSystem();
