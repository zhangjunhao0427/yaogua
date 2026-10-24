import { castFromNumbers, type MeihuaCast } from '../core/meihua';
import { CATEGORY_IDS, type Category } from '../data/guide';
import { notifier as platformNotifier, type Notifier } from '../platform/notify';
import { storage as platformStorage, type KeyValueStorage } from '../platform/storage';
import { keepSlot } from './keep';
import { newId, reminderIdOf, REVIEW_AFTER_MS, type Outcome, type Review } from './records';

export type MeihuaSource = 'time' | 'number';

export interface MeihuaRecord {
  readonly id: string;
  readonly question: string;
  readonly category: Category | null;
  readonly createdAt: number;
  readonly source: MeihuaSource;
  /** 上卦数、下卦数、动爻数；由它们可完整还原卦 */
  readonly numbers: readonly [number, number, number];
  /** 时间起卦时记下的农历时刻，仅供显示 */
  readonly lunar?: string;
  readonly review?: Review;
}

const KEY = 'meihua.v1';

export const castOfRecord = (record: MeihuaRecord): MeihuaCast =>
  castFromNumbers(record.numbers[0], record.numbers[1], record.numbers[2]);

export const reviewDueAt = (record: MeihuaRecord): number => record.createdAt + REVIEW_AFTER_MS;

export const isReviewDue = (record: MeihuaRecord, now = Date.now()): boolean =>
  !record.review && now >= reviewDueAt(record);

const isObject = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null;

function isRecord(x: unknown): x is MeihuaRecord {
  if (!isObject(x)) return false;
  const numbers = x.numbers;
  return (
    typeof x.id === 'string' &&
    typeof x.question === 'string' &&
    typeof x.createdAt === 'number' &&
    (x.source === 'time' || x.source === 'number') &&
    Array.isArray(numbers) &&
    numbers.length === 3 &&
    numbers.every((n) => Number.isInteger(n) && (n as number) >= 0) &&
    (x.category === null || CATEGORY_IDS.includes(x.category as Category))
  );
}

export function createMeihuaStore(storage: KeyValueStorage, notifier: Notifier) {
  // 认不出来的条目原样留着，详见 keep.ts
  const slot = keepSlot<MeihuaRecord>(storage, KEY, isRecord);
  const read = async (): Promise<MeihuaRecord[]> => (await slot.read()).known;
  const write = (records: MeihuaRecord[]): Promise<void> => slot.write(records);

  return {
    async add(input: Omit<MeihuaRecord, 'id' | 'createdAt'>, now = Date.now()): Promise<MeihuaRecord> {
      const record: MeihuaRecord = { ...input, question: input.question.trim(), id: newId(), createdAt: now };
      await write([record, ...(await read())]);
      await notifier.schedule({
        id: reminderIdOf(record.id),
        at: new Date(reviewDueAt(record)),
        title: '七日回访',
        body: `「${record.question}」这一卦，应验了吗？`,
      });
      return record;
    },

    async list(): Promise<MeihuaRecord[]> {
      return [...(await read())].sort((a, b) => b.createdAt - a.createdAt);
    },

    async get(id: string): Promise<MeihuaRecord | null> {
      return (await read()).find((r) => r.id === id) ?? null;
    },

    /** 从备份里放回一条。已存在的不覆盖，回访未到期的重新排上提醒 */
    async restore(raw: unknown): Promise<boolean> {
      if (!isRecord(raw)) return false;
      const existing = await read();
      if (existing.some((r) => r.id === raw.id)) return false;
      await write([raw, ...existing].sort((a, b) => b.createdAt - a.createdAt));
      if (!raw.review && reviewDueAt(raw) > Date.now()) {
        await notifier.schedule({
          id: reminderIdOf(raw.id),
          at: new Date(reviewDueAt(raw)),
          title: '七日回访',
          body: `「${raw.question}」这一卦，应验了吗？`,
        });
      }
      return true;
    },

    /** 删掉一条卦记，同时撤掉它的回访提醒 */
    async remove(id: string): Promise<boolean> {
      const records = await read();
      const left = records.filter((r) => r.id !== id);
      if (left.length === records.length) return false;
      await write(left);
      await notifier.cancel(reminderIdOf(id));
      return true;
    },

    async saveReview(id: string, outcome: Outcome, note: string, now = Date.now()): Promise<MeihuaRecord | null> {
      const records = await read();
      const target = records.find((r) => r.id === id);
      if (!target) return null;
      const updated: MeihuaRecord = { ...target, review: { outcome, note: note.trim(), at: now } };
      await write(records.map((r) => (r.id === id ? updated : r)));
      await notifier.cancel(reminderIdOf(id));
      return updated;
    },
  };
}

export type MeihuaStore = ReturnType<typeof createMeihuaStore>;

export const meihuaStore: MeihuaStore = createMeihuaStore(platformStorage, platformNotifier);
