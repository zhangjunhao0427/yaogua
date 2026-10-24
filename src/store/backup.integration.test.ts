import { describe, expect, it } from 'vitest';
import { castLine } from '../core/coin';
import type { Notifier, Reminder } from '../platform/notify';
import type { KeyValueStorage } from '../platform/storage';
import { makeBackup, mergeBackup, readBackup, type BackupStores } from './backup';
import { createMeihuaStore } from './meihua';
import { createRecordStore, REVIEW_AFTER_MS } from './records';

function memoryStorage() {
  const map = new Map<string, string>();
  const storage: KeyValueStorage = {
    async get<T>(key: string) {
      const raw = map.get(key);
      return raw === undefined ? null : (JSON.parse(raw) as T);
    },
    async set(key, value) {
      map.set(key, JSON.stringify(value));
      return true;
    },
    async remove(key) {
      map.delete(key);
    },
  };
  return { storage, map };
}

function fakeNotifier() {
  const scheduled: Reminder[] = [];
  const notifier: Notifier = {
    async schedule(r) {
      scheduled.push(r);
      return true;
    },
    async cancel() {},
  };
  return { notifier, scheduled };
}

/** 造一台装有若干卦记的设备 */
async function makeDevice(now: number) {
  const { storage } = memoryStorage();
  const { notifier, scheduled } = fakeNotifier();
  const coin = createRecordStore(storage, notifier);
  const meihua = createMeihuaStore(storage, notifier);

  let draft = await coin.startDraft('摇出来的那一卦', 'career', now);
  for (let i = 0; i < 6; i++) draft = await coin.addLine(draft, castLine());
  const coinRecord = await coin.finalize(draft);
  const meihuaRecord = await meihua.add(
    { question: '梅花那一卦', category: 'money', source: 'number', numbers: [3, 8, 11] },
    now,
  );

  const stores: BackupStores = { coin, meihua };
  return { coin, meihua, stores, scheduled, coinRecord, meihuaRecord };
}

describe('备份与恢复的全程', () => {
  it('导出后换一台设备恢复，两种卦记都回来', async () => {
    const now = Date.now();
    const old = await makeDevice(now);
    const backup = await makeBackup(now, old.stores);
    expect(backup.coin).toHaveLength(1);
    expect(backup.meihua).toHaveLength(1);

    // 新设备：空的
    const fresh = await makeDevice(now);
    await fresh.coin.remove(fresh.coinRecord.id);
    await fresh.meihua.remove(fresh.meihuaRecord.id);
    expect(await fresh.coin.listRecords()).toEqual([]);

    // 经过文件这一遭，确认序列化后仍读得回来
    const roundTripped = readBackup(JSON.stringify(backup));
    const result = await mergeBackup(roundTripped, fresh.stores);

    expect(result).toEqual({ added: 2, skipped: 0, unreadable: 0 });
    expect((await fresh.coin.listRecords())[0].question).toBe('摇出来的那一卦');
    expect((await fresh.meihua.list())[0].question).toBe('梅花那一卦');
  });

  it('恢复不覆盖本机已有的卦记，也不弄丢后来新摇的', async () => {
    const now = Date.now();
    const device = await makeDevice(now);
    const backup = await makeBackup(now, device.stores);

    // 本机后来又摇了一卦
    const later = await device.meihua.add(
      { question: '备份之后才摇的', category: 'recent', source: 'time', numbers: [5, 9, 14] },
      now + 1000,
    );

    const result = await mergeBackup(backup, device.stores);
    expect(result).toEqual({ added: 0, skipped: 2, unreadable: 0 });

    const questions = (await device.meihua.list()).map((r) => r.question);
    expect(questions).toContain(later.question);
    expect(questions).toContain('梅花那一卦');
  });

  it('文件里掺了坏条目时，好的照样进来，坏的只计数', async () => {
    const now = Date.now();
    const device = await makeDevice(now);
    const backup = await makeBackup(now, device.stores);
    await device.coin.remove(device.coinRecord.id);
    await device.meihua.remove(device.meihuaRecord.id);

    const dirty = {
      ...backup,
      coin: [...backup.coin, { 不是卦记: true }, null],
      meihua: [...backup.meihua, { id: '有编号但缺字段' }],
    };

    const result = await mergeBackup(dirty as never, device.stores);
    expect(result.added).toBe(2);
    expect(result.unreadable).toBe(3);
    expect(await device.coin.listRecords()).toHaveLength(1);
  });

  it('恢复回来的卦记，未到期的回访提醒重新排上', async () => {
    const now = Date.now();
    const device = await makeDevice(now);
    const backup = await makeBackup(now, device.stores);
    await device.coin.remove(device.coinRecord.id);

    const before = device.scheduled.length;
    await mergeBackup(backup, device.stores);
    const added = device.scheduled.slice(before);

    expect(added).toHaveLength(1);
    expect(added[0].at.getTime()).toBe(now + REVIEW_AFTER_MS);
  });
});
