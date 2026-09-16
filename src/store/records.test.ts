import { describe, expect, it } from 'vitest';
import { castLine } from '../core/coin';
import type { Line } from '../core/types';
import type { Notifier, Reminder } from '../platform/notify';
import type { KeyValueStorage } from '../platform/storage';
import { createRecordStore, isReviewDue, REVIEW_AFTER_MS, reminderIdOf } from './records';

function memoryStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
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
  return { storage, map, failNextWrites: () => (failWrites = true) };
}

function fakeNotifier() {
  const scheduled: Reminder[] = [];
  const cancelled: number[] = [];
  const notifier: Notifier = {
    async schedule(r) {
      scheduled.push(r);
      return true;
    },
    async cancel(id) {
      cancelled.push(id);
    },
  };
  return { notifier, scheduled, cancelled };
}

const sixLines = (): Line[] => Array.from({ length: 6 }, () => castLine());

async function castFull(store: ReturnType<typeof createRecordStore>, question = '我该如何准备这次面试', now = 1_000) {
  let draft = await store.startDraft(question, 'career', now);
  for (const line of sixLines()) draft = await store.addLine(draft, line);
  return store.finalize(draft);
}

describe('卦记存储', () => {
  it('问题确认后锁定，再次立问返回原卦', async () => {
    const store = createRecordStore(memoryStorage().storage, fakeNotifier().notifier);
    const first = await store.startDraft('我该如何面对变动', 'recent');
    const second = await store.startDraft('换一个问题', null);
    expect(second).toEqual(first);
  });

  it('每一爻立即保存，重新载入后进度仍在', async () => {
    const { storage } = memoryStorage();
    const store = createRecordStore(storage, fakeNotifier().notifier);
    const draft = await store.startDraft('问', null);
    await store.addLine(draft, castLine());
    await store.addLine((await store.loadDraft())!, castLine());

    const reopened = createRecordStore(storage, fakeNotifier().notifier);
    expect((await reopened.loadDraft())?.lines).toHaveLength(2);
  });

  it('六爻成卦后存为卦记、清除进度，并预约七日回访', async () => {
    const { notifier, scheduled } = fakeNotifier();
    const store = createRecordStore(memoryStorage().storage, notifier);
    const record = await castFull(store);

    expect(await store.loadDraft()).toBeNull();
    expect(await store.listRecords()).toEqual([record]);
    expect(scheduled).toEqual([
      expect.objectContaining({ id: reminderIdOf(record.id), at: new Date(record.createdAt + REVIEW_AFTER_MS) }),
    ]);
  });

  it('不足六爻不能成卦，满六爻不能再加', async () => {
    const store = createRecordStore(memoryStorage().storage, fakeNotifier().notifier);
    let draft = await store.startDraft('问', null);
    await expect(store.finalize(draft)).rejects.toThrow();
    for (const line of sixLines()) draft = await store.addLine(draft, line);
    await expect(store.addLine(draft, castLine())).rejects.toThrow();
  });

  it('重复成卦不产生重复卦记', async () => {
    const store = createRecordStore(memoryStorage().storage, fakeNotifier().notifier);
    let draft = await store.startDraft('问', null);
    for (const line of sixLines()) draft = await store.addLine(draft, line);
    await store.finalize(draft);
    await store.finalize(draft);
    expect(await store.listRecords()).toHaveLength(1);
  });

  it('回访：七日内不到期，到期后可记录，记录后取消提醒', async () => {
    const { notifier, cancelled } = fakeNotifier();
    const store = createRecordStore(memoryStorage().storage, notifier);
    const record = await castFull(store, '问', 0);

    expect(isReviewDue(record, REVIEW_AFTER_MS - 1)).toBe(false);
    expect(isReviewDue(record, REVIEW_AFTER_MS)).toBe(true);

    const reviewed = await store.saveReview(record.id, 'partial', '  一半如此  ', REVIEW_AFTER_MS);
    expect(reviewed?.review).toEqual({ outcome: 'partial', note: '一半如此', at: REVIEW_AFTER_MS });
    expect(isReviewDue(reviewed!, REVIEW_AFTER_MS * 2)).toBe(false);
    expect((await store.getRecord(record.id))?.review?.outcome).toBe('partial');
    expect(cancelled).toEqual([reminderIdOf(record.id)]);
  });

  it('本地数据损坏时不崩溃，丢弃无效条目', async () => {
    const { storage } = memoryStorage({
      'draft.v1': '{"id":1}',
      'records.v1': '[{"id":"x","question":"q","category":null,"createdAt":1,"lines":[]}]',
    });
    const store = createRecordStore(storage, fakeNotifier().notifier);
    expect(await store.loadDraft()).toBeNull();
    expect(await store.listRecords()).toEqual([]);
  });

  it('写入失败时退回内存，本次使用不中断', async () => {
    const mem = memoryStorage();
    mem.failNextWrites();
    const store = createRecordStore(mem.storage, fakeNotifier().notifier);
    const record = await castFull(store);
    expect(await store.getRecord(record.id)).toEqual(record);
  });
});
