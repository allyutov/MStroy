import type { TreeItem, TreeId } from './types.ts';

export class TreeStore<T extends TreeItem> {
  private items: T[];
  private itemMap: Map<TreeId, T>;
  private childrenMap: Map<TreeId | null, T[]>;

  constructor(items: T[]) {
    this.items = [...items];
    this.itemMap = new Map();
    this.childrenMap = new Map();

    this.buildIndexes();
  }

  getAll(): T[] {
    return [...this.items];
  }

  getChildren(id: TreeId): T[] {
    return [...(this.childrenMap.get(id) ?? [])];
  }

  getItem(id: TreeId): T | undefined {
    return this.itemMap.get(id);
  }

  getAllParents(id: TreeId): T[] {
    const result: T[] = [];

    let current = this.itemMap.get(id);

    while (current) {
      result.push(current);

      current = current.parent === null ? undefined : this.itemMap.get(current.parent);
    }

    return result;
  }

  getAllChildren(id: TreeId): T[] {
    const result: T[] = [];

    const stack = [...(this.childrenMap.get(id) ?? [])];

    while (stack.length) {
      const current = stack.pop()!;

      result.push(current);

      stack.push(...(this.childrenMap.get(current.id) ?? []));
    }

    return result;
  }

  addItem(item: T): void {
    if (this.itemMap.has(item.id)) {
      throw new Error(`Item ${item.id} already exists`);
    }

    this.items.push(item);

    this.itemMap.set(item.id, item);

    if (!this.childrenMap.has(item.parent)) {
      this.childrenMap.set(item.parent, []);
    }

    this.childrenMap.get(item.parent)!.push(item);
  }

  removeItem(id: TreeId): void {
    const root = this.itemMap.get(id);

    if (!root) {
      return;
    }

    const idsToDelete = new Set<TreeId>([id, ...this.getAllChildren(id).map((item) => item.id)]);

    this.items = this.items.filter((item) => !idsToDelete.has(item.id));

    this.buildIndexes();
  }

  updateItem(item: T): void {
    const existing = this.itemMap.get(item.id);

    if (!existing) {
      throw new Error(`Item ${item.id} not found`);
    }

    const index = this.items.findIndex((current) => current.id === item.id);

    this.items[index] = item;

    this.buildIndexes();
  }

  private buildIndexes(): void {
    this.itemMap.clear();
    this.childrenMap.clear();

    for (const item of this.items) {
      this.itemMap.set(item.id, item);

      if (!this.childrenMap.has(item.parent)) {
        this.childrenMap.set(item.parent, []);
      }

      this.childrenMap.get(item.parent)!.push(item);
    }
  }
}
