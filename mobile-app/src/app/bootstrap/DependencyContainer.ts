export interface ContainerService {
  [key: string]: unknown;
}

class DependencyContainer {
  private services = new Map<string, unknown>();
  private factories = new Map<string, () => unknown>();

  register<T>(key: string, instance: T): void {
    this.services.set(key, instance);
  }

  registerFactory<T>(key: string, factory: () => T): void {
    this.factories.set(key, factory);
  }

  resolve<T>(key: string): T {
    if (this.services.has(key)) {
      return this.services.get(key) as T;
    }
    const factory = this.factories.get(key);
    if (factory) {
      const instance = factory();
      this.services.set(key, instance);
      return instance as T;
    }
    throw new Error(`Dependency not registered for key: ${key}`);
  }

  has(key: string): boolean {
    return this.services.has(key) || this.factories.has(key);
  }
}

export const container = new DependencyContainer();
export default container;
