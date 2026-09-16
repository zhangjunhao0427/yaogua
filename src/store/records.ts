import { castFromValues, sixOf } from '../core/hexagram';
import type { Cast, Line, SixOf } from '../core/types';
import { CATEGORY_IDS, type Category } from '../data/guide';
import { notifier as platformNotifier, type Notifier } from '../platform/notify';
import { storage as platformStorage, type KeyValueStorage } from '../platform/storage';

export type Outcome = 'fulfilled' | 'partial' | 'unfulfilled';

export const OUTCOME_LABEL: Record<Outcome, string> = {
  fulfilled: '应验',
  partial: '部分应验',
  unfulfilled: '未应验',
};

export interface Review {
  readonly outcome: Outcome;
  readonly note: string;
  readonly at: number;
}

interface Asked {
  readonly id: string;
  readonly question: string;
  readonly category: Category | null;
  readonly createdAt: number;
}

/** 已立问、摇卦未完成 */
export interface Draft extends Asked {
  /** 已摇出的爻，由下至上 */
  readonly lines: readonly Line[];
}

/** 卦记 */
export interface CastRecord extends Asked {
  readonly lines: SixOf<Line>;
  readonly review?: Review;
}

export const REVIEW_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

const DRAFT_KEY = 'draft.v1';
const RECORDS_KEY = 'records.v1';

export const reviewDueAt = (record: CastRecord): number => record.createdAt + REVIEW_AFTER_MS;

export const isReviewDue = (record: CastRecord, now = Date.now()): boolean =>
  !record.review && now >= reviewDueAt(record);

export const castOf = (record: CastRecord): Cast => castFromValues(sixOf((i) => record.lines[i].value));

export function newId(): string {
  const bytes = new Uint8Array(8);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** 本地通知 id 须为 32 位整数，取卦记 id 前 7 位十六进制 */
export const reminderIdOf = (id: string): number => Number.parseInt(id.slice(0, 7), 16);

const isObject = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null;

function isLine(x: unknown): x is Line {
  if (!isObject(x) || !Array.isArray(x.toss) || x.toss.length !== 3) return false;
  const toss: unknown[] = x.toss;
  return toss.every((c) => c === 2 || c === 3) && x.value === (toss as number[]).reduce((a, b) => a + b, 0);
}

function isAsked(x: unknown): x is Record<string, unknown> & Asked {
  return (
    isObject(x) &&
    typeof x.id === 'string' &&
    typeof x.question === 'string' &&
    typeof x.createdAt === 'number' &&
    (x.category === null || CATEGORY_IDS.includes(x.category as Category))
  );
}

const isDraft = (x: unknown): x is Draft =>
  isAsked(x) && Array.isArray(x.lines) && x.lines.length <= 6 && x.lines.every(isLine);

const isRecord = (x: unknown): x is CastRecord =>
  isAsked(x) && Array.isArray(x.lines) && x.lines.length === 6 && x.lines.every(isLine);

export function createRecordStore(storage: KeyValueStorage, notifier: Notifier) {
  // 写入失败（隐私模式、配额已满）时退回内存，保证本次使用不中断
  function slot<T>(key: string, parse: (raw: unknown) => T) {
    let fallback: { value: T } | null = null;
    return {
      async read(): Promise<T> {
        return fallback ? fallback.value : parse(await storage.get<unknown>(key));
      },
      async write(value: T): Promise<void> {
        fallback = (await storage.set(key, value)) ? null : { value };
      },
    };
  }

  const draftSlot = slot<Draft | null>(DRAFT_KEY, (raw) => (isDraft(raw) ? raw : null));
  const recordSlot = slot<CastRecord[]>(RECORDS_KEY, (raw) => (Array.isArray(raw) ? raw.filter(isRecord) : []));

  return {
    loadDraft: (): Promise<Draft | null> => draftSlot.read(),

    /** 问题确认即锁定：已有未完成的卦时返回原卦，不另起 */
    async startDraft(question: string, category: Category | null, now = Date.now()): Promise<Draft> {
      const existing = await draftSlot.read();
      if (existing) return existing;
      const draft: Draft = { id: newId(), question: question.trim(), category, createdAt: now, lines: [] };
      await draftSlot.write(draft);
      return draft;
    },

    /** 每摇出一爻立即保存，刷新页面也无法重摇 */
    async addLine(draft: Draft, line: Line): Promise<Draft> {
      if (draft.lines.length >= 6) throw new Error('六爻已成');
      const next: Draft = { ...draft, lines: [...draft.lines, line] };
      await draftSlot.write(next);
      return next;
    },

    async finalize(draft: Draft): Promise<CastRecord> {
      if (draft.lines.length !== 6) throw new Error('六爻未成，不能成卦');
      const { id, question, category, createdAt } = draft;
      const record: CastRecord = { id, question, category, createdAt, lines: draft.lines as unknown as SixOf<Line> };
      const records = await recordSlot.read();
      if (!records.some((r) => r.id === id)) await recordSlot.write([record, ...records]);
      await draftSlot.write(null);
      await notifier.schedule({
        id: reminderIdOf(id),
        at: new Date(reviewDueAt(record)),
        title: '七日回访',
        body: `「${question}」这一卦，应验了吗？`,
      });
      return record;
    },

    async listRecords(): Promise<CastRecord[]> {
      return [...(await recordSlot.read())].sort((a, b) => b.createdAt - a.createdAt);
    },

    async getRecord(id: string): Promise<CastRecord | null> {
      return (await recordSlot.read()).find((r) => r.id === id) ?? null;
    },

    async saveReview(id: string, outcome: Outcome, note: string, now = Date.now()): Promise<CastRecord | null> {
      const records = await recordSlot.read();
      const target = records.find((r) => r.id === id);
      if (!target) return null;
      const updated: CastRecord = { ...target, review: { outcome, note: note.trim(), at: now } };
      await recordSlot.write(records.map((r) => (r.id === id ? updated : r)));
      await notifier.cancel(reminderIdOf(id));
      return updated;
    },
  };
}

export type RecordStore = ReturnType<typeof createRecordStore>;

export const recordStore: RecordStore = createRecordStore(platformStorage, platformNotifier);
