/**
 * 卦记有两种：摇铜钱的和梅花的，分开存，看的时候合在一起按时间排。
 */
import { castOfRecord, isReviewDue as isMeihuaDue, meihuaStore, type MeihuaRecord } from './meihua';
import { castOf, isReviewDue as isCoinDue, recordStore, type CastRecord } from './records';

export type Entry =
  | { readonly kind: 'coin'; readonly id: string; readonly createdAt: number; readonly record: CastRecord }
  | { readonly kind: 'meihua'; readonly id: string; readonly createdAt: number; readonly record: MeihuaRecord };

export const entryHref = (entry: Entry): string => (entry.kind === 'coin' ? `/r/${entry.id}` : `/m/${entry.id}`);

export const entryQuestion = (entry: Entry): string => entry.record.question;

export const entryReview = (entry: Entry) => entry.record.review;

export const entryDue = (entry: Entry, now = Date.now()): boolean =>
  entry.kind === 'coin' ? isCoinDue(entry.record, now) : isMeihuaDue(entry.record, now);

/** 本卦与变爻，两种卦记都能给出，用来画卦象 */
export function entryFigure(entry: Entry): { yang: readonly boolean[]; changing: readonly number[] } {
  if (entry.kind === 'coin') {
    const cast = castOf(entry.record);
    return { yang: cast.base.yang, changing: cast.changing };
  }
  const cast = castOfRecord(entry.record);
  return { yang: cast.origin.yang, changing: [cast.moving] };
}

/** 本卦与之卦（变卦）的卦号，没有之卦时第二项为 null */
export function entryHexagrams(entry: Entry): { from: number; to: number | null } {
  if (entry.kind === 'coin') {
    const cast = castOf(entry.record);
    return { from: cast.base.number, to: cast.changed?.number ?? null };
  }
  const cast = castOfRecord(entry.record);
  return { from: cast.origin.number, to: cast.changed.number };
}

export async function removeEntry(entry: Entry): Promise<boolean> {
  return entry.kind === 'coin' ? recordStore.remove(entry.id) : meihuaStore.remove(entry.id);
}

export async function listEntries(): Promise<Entry[]> {
  const [coins, meihua] = await Promise.all([recordStore.listRecords(), meihuaStore.list()]);
  return [
    ...coins.map((record): Entry => ({ kind: 'coin', id: record.id, createdAt: record.createdAt, record })),
    ...meihua.map((record): Entry => ({ kind: 'meihua', id: record.id, createdAt: record.createdAt, record })),
  ].sort((a, b) => b.createdAt - a.createdAt);
}
