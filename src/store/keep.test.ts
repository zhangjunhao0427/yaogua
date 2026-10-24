import { describe, expect, it } from 'vitest';
import type { KeyValueStorage } from '../platform/storage';
import { keepSlot } from './keep';

interface Item {
  id: string;
}

const isItem = (x: unknown): x is Item =>
  typeof x === 'object' && x !== null && typeof (x as Item).id === 'string';

function memoryStorage(initial: Record<string, unknown> = {}) {
  const map = new Map(Object.entries(initial).map(([k, v]) => [k, JSON.stringify(v)]));
  let failWrites = false;
  const storage: KeyValueStorage = {
    async get<T>(key: string) {
      const raw = map.get(key);
      return raw === undefined ? null : (JSON.parse(raw) as T);
    },
    async set(key, value) {
      if (failWrites) return false;
      map.set(key, JSON.stringify(value));
      return true;
    },
    async remove(key) {
      map.delete(key);
    },
  };
  const rawOf = (key: string) => JSON.parse(map.get(key) ?? 'null');
  return { storage, rawOf, failNextWrites: () => (failWrites = true) };
}

describe('认不出来的条目', () => {
  it('读取时与认得的分开，不混进结果', async () => {
    const { storage } = memoryStorage({ k: [{ id: 'a' }, { nope: 1 }, { id: 'b' }] });
    const slot = keepSlot(storage, 'k', isItem);
    const kept = await slot.read();
    expect(kept.known).toEqual([{ id: 'a' }, { id: 'b' }]);
    expect(kept.foreign).toEqual([{ nope: 1 }]);
  });

  it('写入时原样留着，不会被下一次保存抹掉', async () => {
    const { storage, rawOf } = memoryStorage({ k: [{ id: 'a' }, { future: '来自新版本' }] });
    const slot = keepSlot(storage, 'k', isItem);

    // 删掉唯一认得的条目，认不出来的那条仍要在
    await slot.write([]);
    expect(rawOf('k')).toEqual([{ future: '来自新版本' }]);

    // 再写入新条目，仍然并存
    await slot.write([{ id: 'c' }]);
    expect(rawOf('k')).toEqual([{ id: 'c' }, { future: '来自新版本' }]);
    expect((await slot.read()).known).toEqual([{ id: 'c' }]);
  });

  it('存的不是数组时当作空，不抛错', async () => {
    const { storage } = memoryStorage({ k: { 坏掉的: true } });
    const kept = await keepSlot(storage, 'k', isItem).read();
    expect(kept.known).toEqual([]);
    expect(kept.foreign).toEqual([]);
  });

  it('写入失败时退回内存，本次使用不中断', async () => {
    const mem = memoryStorage({ k: [{ id: 'a' }] });
    const slot = keepSlot(mem.storage, 'k', isItem);
    await slot.read();
    mem.failNextWrites();
    await slot.write([{ id: 'a' }, { id: 'b' }]);
    expect((await slot.read()).known).toEqual([{ id: 'a' }, { id: 'b' }]);
  });
});
