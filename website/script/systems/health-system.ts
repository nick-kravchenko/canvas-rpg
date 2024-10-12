import { ComponentKey } from '../types/component-key.enum';
import { GameObject } from '../entities';
import { HealthComponent } from '../components';
import { clamp } from '../utils';

class HealthSystem {
  update(entities: GameObject[]) {
    for (const entity of entities) {
      const healthComponent: HealthComponent = entity.getComponent(ComponentKey.HEALTH);
      if (!healthComponent) {
        continue;
      }
      if (healthComponent.current <= 0) {
        // dead
      } else if (healthComponent.current < healthComponent.max) {
        healthComponent.current = clamp(healthComponent.current + healthComponent.regenPerSecond, 0, healthComponent.max);
      } else {
        // full hp
      }
    }
  }
}

export const healthSystem = new HealthSystem();
