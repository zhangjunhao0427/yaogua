import { isChanging, isYang } from './coin';
import type { Cast, Hexagram, LineIndex, LineValue, SixOf, TrigramName } from './types';

export const LINE_INDICES = [0, 1, 2, 3, 4, 5] as const satisfies readonly LineIndex[];

/** 八卦：键为初、二、三爻由下至上拼接，1 阳 0 阴 */
export const TRIGRAM = {
  '111': '乾', '110': '兑', '101': '离', '100': '震',
  '011': '巽', '010': '坎', '001': '艮', '000': '坤',
} as const satisfies Record<string, TrigramName>;

/** 八卦之象，用于全称「上象下象卦名」 */
export const TRIGRAM_IMAGE: Record<TrigramName, string> = {
  乾: '天', 兑: '泽', 离: '火', 震: '雷', 巽: '风', 坎: '水', 艮: '山', 坤: '地',
};

/** 文王卦序，键为「上卦 + 下卦」。表已校验，勿改 */
export const KING_WEN: Record<string, number> = {
  乾乾: 1,  乾坤: 12, 乾震: 25, 乾巽: 44, 乾坎: 6,  乾离: 13, 乾艮: 33, 乾兑: 10,
  坤乾: 11, 坤坤: 2,  坤震: 24, 坤巽: 46, 坤坎: 7,  坤离: 36, 坤艮: 15, 坤兑: 19,
  震乾: 34, 震坤: 16, 震震: 51, 震巽: 32, 震坎: 40, 震离: 55, 震艮: 62, 震兑: 54,
  巽乾: 9,  巽坤: 20, 巽震: 42, 巽巽: 57, 巽坎: 59, 巽离: 37, 巽艮: 53, 巽兑: 61,
  坎乾: 5,  坎坤: 8,  坎震: 3,  坎巽: 48, 坎坎: 29, 坎离: 63, 坎艮: 39, 坎兑: 60,
  离乾: 14, 离坤: 35, 离震: 21, 离巽: 50, 离坎: 64, 离离: 30, 离艮: 56, 离兑: 38,
  艮乾: 26, 艮坤: 23, 艮震: 27, 艮巽: 18, 艮坎: 4,  艮离: 22, 艮艮: 52, 艮兑: 41,
  兑乾: 43, 兑坤: 45, 兑震: 17, 兑巽: 28, 兑坎: 47, 兑离: 49, 兑艮: 31, 兑兑: 58,
};

export function sixOf<T>(fn: (i: LineIndex) => T): SixOf<T> {
  return LINE_INDICES.map(fn) as unknown as SixOf<T>;
}

export function trigramOf(bottom: boolean, middle: boolean, top: boolean): TrigramName {
  const key = [bottom, middle, top].map((y) => (y ? '1' : '0')).join('') as keyof typeof TRIGRAM;
  return TRIGRAM[key];
}

export function hexagramOf(yang: SixOf<boolean>): Hexagram {
  const lower = trigramOf(yang[0], yang[1], yang[2]);
  const upper = trigramOf(yang[3], yang[4], yang[5]);
  const number = KING_WEN[upper + lower];
  if (number === undefined) throw new Error(`查无此卦：上${upper}下${lower}`);
  return { number, upper, lower, yang };
}

const BY_NUMBER: ReadonlyMap<number, Hexagram> = new Map(
  Array.from({ length: 64 }, (_, bits) => {
    const h = hexagramOf(sixOf((i) => ((bits >> i) & 1) === 1));
    return [h.number, h] as const;
  }),
);

export function hexagramByNumber(n: number): Hexagram {
  const h = BY_NUMBER.get(n);
  if (!h) throw new RangeError(`卦序须在 1–64 之间，收到 ${n}`);
  return h;
}

/** 第 n 卦的 Unicode 卦符，U+4DC0 至 U+4DFF */
export function hexagramSymbol(n: number): string {
  return String.fromCodePoint(0x4dbf + hexagramByNumber(n).number);
}

/** 翻转指定爻位的阴阳，其余不动 */
export function flipLines(yang: SixOf<boolean>, indices: readonly LineIndex[]): SixOf<boolean> {
  return sixOf((i) => (indices.includes(i) ? !yang[i] : yang[i]));
}

/** 互卦：取二、三、四爻为下卦，三、四、五爻为上卦 */
export function mutualLines(yang: SixOf<boolean>): SixOf<boolean> {
  return sixOf((i) => yang[i < 3 ? i + 1 : i - 1]);
}

/** 错卦：六爻阴阳全部相反 */
export function oppositeLines(yang: SixOf<boolean>): SixOf<boolean> {
  return sixOf((i) => !yang[i]);
}

/** 综卦：把卦上下颠倒过来看 */
export function reversedLines(yang: SixOf<boolean>): SixOf<boolean> {
  return sixOf((i) => yang[5 - i]);
}

export interface Aspects {
  readonly mutual: Hexagram;
  readonly opposite: Hexagram;
  readonly reversed: Hexagram;
}

/** 本卦之外的三个角度：互卦、错卦、综卦 */
export function aspectsOf(h: Hexagram): Aspects {
  return {
    mutual: hexagramOf(mutualLines(h.yang)),
    opposite: hexagramOf(oppositeLines(h.yang)),
    reversed: hexagramOf(reversedLines(h.yang)),
  };
}

/** 由六次摇卦所得成卦：本卦、之卦、变爻位 */
export function castFromValues(values: SixOf<LineValue>): Cast {
  const changing = LINE_INDICES.filter((i) => isChanging(values[i]));
  const base = hexagramOf(sixOf((i) => isYang(values[i])));
  const changed = changing.length > 0 ? hexagramOf(flipLines(base.yang, changing)) : null;
  return { values, base, changed, changing };
}

/** 爻题：阳称九、阴称六；初、上居前，中间四爻数字在后 */
export function lineTitle(i: LineIndex, yang: boolean): string {
  const t = yang ? '九' : '六';
  if (i === 0) return '初' + t;
  if (i === 5) return '上' + t;
  return t + ['二', '三', '四', '五'][i - 1];
}
