export class CharacterEntity {
  components: Map<string, any>;

  constructor() {
    this.components = new Map<string, any>();
  }

  addComponent(name: string, component: any) {
    this.components.set(name, component);
  }

  getComponent<T>(name: string): T {
    if (!this.components.has(name)) {
      throw new Error(`Component ${name} not found`);
    }
    return this.components.get(name);
  }
}
