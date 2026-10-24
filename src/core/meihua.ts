/**
 * 梅花易数（邵雍）起卦与体用判定。纯逻辑，不依赖平台。
 *
 * 与铜钱法的不同：
 * - 只有一个动爻，不是 0–6 个
 * - 起卦不靠随机：时间起卦是确定的，同一时刻谁算都一样
 * - 断卦主看体用生克，爻辞是辅
 */
import { flipLines, hexagramOf, mutualLines, sixOf, TRIGRAM } from './hexagram';
import type { Hexagram, LineIndex, SixOf, TrigramName } from './types';

/** 先天八卦数：乾一、兑二、离三、震四、巽五、坎六、艮七、坤八 */
export const TRIGRAM_BY_NUMBER: Record<number, TrigramName> = {
  1: '乾',
  2: '兑',
  3: '离',
  4: '震',
  5: '巽',
  6: '坎',
  7: '艮',
  8: '坤',
};

export const NUMBER_BY_TRIGRAM: Record<TrigramName, number> = {
  乾: 1,
  兑: 2,
  离: 3,
  震: 4,
  巽: 5,
  坎: 6,
  艮: 7,
  坤: 8,
};

export type Element = '金' | '木' | '水' | '火' | '土';

export const ELEMENT_OF: Record<TrigramName, Element> = {
  乾: '金',
  兑: '金',
  震: '木',
  巽: '木',
  坎: '水',
  离: '火',
  坤: '土',
  艮: '土',
};

/** 五行相生：金生水、水生木、木生火、火生土、土生金 */
const GENERATES: Record<Element, Element> = { 金: '水', 水: '木', 木: '火', 火: '土', 土: '金' };
/** 五行相克：金克木、木克土、土克水、水克火、火克金 */
const OVERCOMES: Record<Element, Element> = { 金: '木', 木: '土', 土: '水', 水: '火', 火: '金' };

export const generates = (a: Element, b: Element): boolean => GENERATES[a] === b;
export const overcomes = (a: Element, b: Element): boolean => OVERCOMES[a] === b;

/** 体用关系，吉凶由此而定 */
export type BodyUseRelation = 'useGeneratesBody' | 'bodyGeneratesUse' | 'sameElement' | 'bodyOvercomesUse' | 'useOvercomesBody';

export function relationOf(body: TrigramName, use: TrigramName): BodyUseRelation {
  const b = ELEMENT_OF[body];
  const u = ELEMENT_OF[use];
  if (b === u) return 'sameElement';
  if (generates(u, b)) return 'useGeneratesBody';
  if (generates(b, u)) return 'bodyGeneratesUse';
  if (overcomes(b, u)) return 'bodyOvercomesUse';
  return 'useOvercomesBody';
}

/** 把先天卦数化为八卦；余 0 作 8 */
export function trigramFromNumber(n: number): TrigramName {
  if (!Number.isInteger(n) || n < 0) throw new RangeError(`卦数须为非负整数，收到 ${n}`);
  const r = n % 8;
  return TRIGRAM_BY_NUMBER[r === 0 ? 8 : r];
}

/** 把数化为动爻位；余 0 作 6。返回 0–5 的下标，0 为初爻 */
export function movingLineFromNumber(n: number): LineIndex {
  if (!Number.isInteger(n) || n < 0) throw new RangeError(`爻数须为非负整数，收到 ${n}`);
  const r = n % 6;
  return ((r === 0 ? 6 : r) - 1) as LineIndex;
}

/** 卦名 → 三爻的 0/1 串，初爻在前 */
const BITS_OF = Object.fromEntries(Object.entries(TRIGRAM).map(([bits, name]) => [name, bits])) as Record<
  TrigramName,
  string
>;

/** 由上下卦拼出六爻，下卦在前（初爻在最下） */
export function hexagramFrom(upper: TrigramName, lower: TrigramName): Hexagram {
  const low = BITS_OF[lower];
  const up = BITS_OF[upper];
  return hexagramOf(sixOf((i) => (i < 3 ? low[i] === '1' : up[i - 3] === '1')));
}

export interface MeihuaCast {
  readonly upper: TrigramName;
  readonly lower: TrigramName;
  /** 动爻下标，0 为初爻 */
  readonly moving: LineIndex;
  /** 本卦 */
  readonly origin: Hexagram;
  /** 互卦：取二三四爻为下、三四五爻为上 */
  readonly mutual: Hexagram;
  /** 变卦：动爻翻转 */
  readonly changed: Hexagram;
  /** 体卦：不含动爻的那一卦，代表自己 */
  readonly body: TrigramName;
  /** 用卦：含动爻的那一卦，代表所问之事 */
  readonly use: TrigramName;
  /** 动爻在上卦还是下卦 */
  readonly movingIn: 'upper' | 'lower';
  readonly relation: BodyUseRelation;
}

/** 由上卦数、下卦数、动爻数成卦。三个数可以来自时间，也可以来自随手报的数 */
export function castFromNumbers(upperNumber: number, lowerNumber: number, movingNumber: number): MeihuaCast {
  const upper = trigramFromNumber(upperNumber);
  const lower = trigramFromNumber(lowerNumber);
  const moving = movingLineFromNumber(movingNumber);

  const origin = hexagramFrom(upper, lower);
  // 动爻在下卦（初二三）则下卦为用，在上卦（四五六）则上卦为用
  const movingIn = moving < 3 ? 'lower' : 'upper';
  const use = movingIn === 'lower' ? lower : upper;
  const body = movingIn === 'lower' ? upper : lower;

  return {
    upper,
    lower,
    moving,
    origin,
    mutual: hexagramOf(mutualLines(origin.yang)),
    changed: hexagramOf(flipLines(origin.yang, [moving])),
    body,
    use,
    movingIn,
    relation: relationOf(body, use),
  };
}

/** 时间起卦所需的农历数值 */
export interface LunarMoment {
  /** 年支数：子 1、丑 2 …… 亥 12 */
  readonly yearBranch: number;
  /** 农历月，闰月按本月数算 */
  readonly month: number;
  /** 农历日 */
  readonly day: number;
  /** 时辰地支数：子 1、丑 2 …… 亥 12 */
  readonly hourBranch: number;
}

/**
 * 时间起卦：上卦取年月日之和，下卦再加时辰，动爻取同一总和除以六。
 */
export function castFromMoment(m: LunarMoment): MeihuaCast {
  const upperSum = m.yearBranch + m.month + m.day;
  const lowerSum = upperSum + m.hourBranch;
  return castFromNumbers(upperSum, lowerSum, lowerSum);
}

export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

/** 由小时数（0–23）求时辰地支数：23–1 点为子时，依次两小时一辰 */
export function hourBranchOf(hour: number): number {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) throw new RangeError(`小时须在 0–23，收到 ${hour}`);
  return (Math.floor((hour + 1) / 2) % 12) + 1;
}

/** 卦气：上下卦都用得到的六爻取象，供界面显示 */
export function linesOf(cast: MeihuaCast): SixOf<boolean> {
  return cast.origin.yang;
}
