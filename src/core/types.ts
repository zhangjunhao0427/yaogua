/** 单枚铜钱：字面计 2，背面计 3（本项目约定，说明页须写明） */
export type CoinValue = 2 | 3;

/** 三枚铜钱之和：6 老阴（变）、7 少阳、8 少阴、9 老阳（变） */
export type LineValue = 6 | 7 | 8 | 9;

export type Toss = readonly [CoinValue, CoinValue, CoinValue];

/** 摇一次所得的一爻 */
export interface Line {
  readonly toss: Toss;
  readonly value: LineValue;
}

/** 爻位下标：0 为初爻（最下），5 为上爻（最上） */
export type LineIndex = 0 | 1 | 2 | 3 | 4 | 5;

/** 按爻位由下至上排列的六元组 */
export type SixOf<T> = readonly [T, T, T, T, T, T];

export type TrigramName = '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤';

export interface Hexagram {
  /** 文王卦序 1–64 */
  readonly number: number;
  readonly upper: TrigramName;
  readonly lower: TrigramName;
  readonly yang: SixOf<boolean>;
}

export interface Cast {
  readonly values: SixOf<LineValue>;
  /** 本卦 */
  readonly base: Hexagram;
  /** 之卦：变爻阴阳翻转后所得；无变爻时为 null */
  readonly changed: Hexagram | null;
  /** 变爻位，由下至上 */
  readonly changing: readonly LineIndex[];
}

/** 解读时应读的一段经文 */
export type TextRef =
  | { readonly kind: 'judgment'; readonly hexagram: number }
  | { readonly kind: 'line'; readonly hexagram: number; readonly line: LineIndex }
  | { readonly kind: 'useNine' }
  | { readonly kind: 'useSix' };

export interface Reading {
  readonly ref: TextRef;
  /** 是否为主 */
  readonly main: boolean;
}

export type ChangingCount = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Verdict {
  readonly count: ChangingCount;
  /** 判定说明，可直接展示给用户 */
  readonly rule: string;
  /** 应读经文，为主者在前 */
  readonly readings: readonly Reading[];
}
