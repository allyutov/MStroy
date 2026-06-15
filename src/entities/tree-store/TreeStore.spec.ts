import { describe, expect, it, beforeEach } from 'vitest';
import { TreeStore } from './TreeStore';

type Item = {
  id: string | number;
  parent: string | number | null;
  label: string;
};

describe('TreeStore', () => {
  let store: TreeStore<Item>;

  const items: Item[] = [
    { id: 1, parent: null, label: 'Айтем 1' },
    { id: '91064cee', parent: 1, label: 'Айтем 2' },
    { id: 3, parent: 1, label: 'Айтем 3' },
    { id: 4, parent: '91064cee', label: 'Айтем 4' },
    { id: 5, parent: '91064cee', label: 'Айтем 5' },
    { id: 6, parent: '91064cee', label: 'Айтем 6' },
    { id: 7, parent: 4, label: 'Айтем 7' },
    { id: 8, parent: 4, label: 'Айтем 8' },
  ];

  beforeEach(() => {
    store = new TreeStore(items);
  });

  describe('getAll', () => {
    it('returns all items', () => {
      expect(store.getAll()).toEqual(items);
    });

    it('returns copy of items array', () => {
      const result = store.getAll();

      result.pop();

      expect(store.getAll()).toHaveLength(8);
    });
  });

  describe('getItem', () => {
    it('returns item by id', () => {
      expect(store.getItem(1)).toEqual(items[0]);
    });

    it('returns undefined for unknown id', () => {
      expect(store.getItem('unknown')).toBeUndefined();
    });
  });

  describe('getChildren', () => {
    it('returns direct children', () => {
      const children = store.getChildren(1);

      expect(children.map(item => item.id)).toEqual([
        '91064cee',
        3,
      ]);
    });

    it('returns empty array when no children', () => {
      expect(store.getChildren(8)).toEqual([]);
    });

    it('returns copy of children array', () => {
      const children = store.getChildren(1);

      children.pop();

      expect(store.getChildren(1)).toHaveLength(2);
    });
  });

  describe('getAllParents', () => {
    it('returns chain from current item to root', () => {
      const result = store.getAllParents(7);

      expect(result.map(item => item.id)).toEqual([
        7,
        4,
        '91064cee',
        1,
      ]);
    });
  });

  describe('getAllChildren', () => {
    it('returns all descendants', () => {
      const result = store.getAllChildren('91064cee');

      expect(
        result.map(item => item.id).sort(),
      ).toEqual([4, 5, 6, 7, 8].sort());
    });

    it('returns empty array for leaf node', () => {
      expect(store.getAllChildren(8)).toEqual([]);
    });
  });

  describe('addItem', () => {
    it('adds new item', () => {
      store.addItem({
        id: 100,
        parent: 1,
        label: 'Новый',
      });

      expect(store.getItem(100)).toEqual({
        id: 100,
        parent: 1,
        label: 'Новый',
      });

      expect(
        store.getChildren(1).some(
          item => item.id === 100,
        ),
      ).toBe(true);
    });

    it('throws if item already exists', () => {
      expect(() =>
        store.addItem({
          id: 1,
          parent: null,
          label: 'Дубликат',
        }),
      ).toThrow();
    });
  });

  describe('updateItem', () => {
    it('updates existing item', () => {
      store.updateItem({
        id: 3,
        parent: 1,
        label: 'Обновленный айтем',
      });

      expect(store.getItem(3)?.label).toBe(
        'Обновленный айтем',
      );
    });

    it('throws if item does not exist', () => {
      expect(() =>
        store.updateItem({
          id: 999,
          parent: null,
          label: 'Unknown',
        }),
      ).toThrow();
    });
  });

  describe('removeItem', () => {
    it('removes item and all descendants', () => {
      store.removeItem('91064cee');

      expect(store.getItem('91064cee')).toBeUndefined();
      expect(store.getItem(4)).toBeUndefined();
      expect(store.getItem(5)).toBeUndefined();
      expect(store.getItem(6)).toBeUndefined();
      expect(store.getItem(7)).toBeUndefined();
      expect(store.getItem(8)).toBeUndefined();

      expect(store.getItem(1)).toBeDefined();
      expect(store.getItem(3)).toBeDefined();
    });

    it('does nothing for unknown id', () => {
      expect(() =>
        store.removeItem('unknown'),
      ).not.toThrow();
    });
  });
});
