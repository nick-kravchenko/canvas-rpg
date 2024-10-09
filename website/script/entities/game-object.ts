import { ComponentMap } from '../enums/component-map';

export class GameObject {
  components: Map<string, any>;

  constructor() {
    this.components = new Map<keyof ComponentMap, any>();
  }

  addComponent<K extends keyof ComponentMap>(name: K, component: ComponentMap[K]): void {
    this.components.set(name, component);
  }

  getComponent<K extends keyof ComponentMap>(name: K): ComponentMap[K] {
    return this.components.get(name) as ComponentMap[K];
  }
}
