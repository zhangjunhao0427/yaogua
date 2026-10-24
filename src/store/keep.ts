/**
 * 存储里认不出来的条目，要原样留着，不能当垃圾丢掉。
 *
 * 原先的做法是读取时 filter 掉不合格的条目，之后任何一次写入都会把它们
 * 永久抹去。将来数据结构升级时，旧格式的卦记就会这样悄无声息地消失——
 * 用户只会看到卦记变少了，不知道发生过什么。
 */
import type { KeyValueStorage } from '../platform/storage';

export interface Kept<T> {
  /** 本版认得、可以展示的条目 */
  readonly known: T[];
  /** 认不出来的原始条目，原样留着，写回时一并保存 */
  readonly foreign: unknown[];
}

export interface KeepSlot<T> {
  read(): Promise<Kept<T>>;
  /** 只替换认得的那部分，认不出来的照原样写回去 */
  write(known: T[]): Promise<void>;
}

/**
 * 一个数组型的存储槽。写入失败（隐私模式、配额满）时退回内存，
 * 保证本次使用不中断。
 */
export function keepSlot<T>(
  storage: KeyValueStorage,
  key: string,
  isKnown: (value: unknown) => value is T,
): KeepSlot<T> {
  let fallback: Kept<T> | null = null;

  return {
    async read(): Promise<Kept<T>> {
      if (fallback) return fallback;
      const raw = await storage.get<unknown>(key);
      const items = Array.isArray(raw) ? raw : [];
      const known: T[] = [];
      const foreign: unknown[] = [];
      for (const item of items) {
        if (isKnown(item)) known.push(item);
        else foreign.push(item);
      }
      return { known, foreign };
    },

    async write(known: T[]): Promise<void> {
      const { foreign } = await this.read();
      const next: Kept<T> = { known, foreign };
      fallback = (await storage.set(key, [...known, ...foreign])) ? null : next;
    },
  };
}
