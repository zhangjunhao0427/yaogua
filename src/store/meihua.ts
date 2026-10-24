import { castFromNumbers, type MeihuaCast } from '../core/meihua';
import { CATEGORY_IDS, type Category } from '../data/guide';
import { notifier as platformNotifier, type Notifier } from '../platform/notify';
import { storage as platformStorage, type KeyValueStorage } from '../platform/storage';
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
  // 与卦记一样，写入失败时退回内存，保证本次使用不中断
  let fallback: MeihuaRecord[] | null = null;

  async function read(): Promise<MeihuaRecord[]> {
    if (fallback) return fallback;
    const raw = await storage.get<unknown>(KEY);
    return Array.isArray(raw) ? raw.filter(isRecord) : [];
  }

  async function write(records: MeihuaRecord[]): Promise<void> {
    fallback = (await storage.set(KEY, records)) ? null : records;
  }

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
