import { ComponentKey } from '../types/component-key.enum';
import { GameObject } from '../entities';
import { gameState } from '../game-state';
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
        const tickRate: number = gameState.gameTickRate;
        const tickAmount: number = healthComponent.regenPerSecond / tickRate;
        healthComponent.current = clamp(healthComponent.current + tickAmount, 0, healthComponent.max);
      } else {
        // full hp
      }
    }
  }
}

export const healthSystem = new HealthSystem();
