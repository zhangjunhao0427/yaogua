import type { TrigramName } from '../core/types';
import type { MergedAngles } from '../data/zhouyi/angles';
import type { HexagramText } from '../data/zhouyi/types';
import type { Lang } from './lang';

/** 界面文案表：键就是中文原文，值是译文。缺的键回落到中文。 */
export type Phrases = Readonly<Record<string, string>>;

export interface TrigramLoreText {
  readonly image: string;
  readonly nature: string;
  readonly person: string;
  readonly body: string;
  readonly thing: string;
}

/**
 * 一种语言的全部文字。
 * 中文那份随主包一起打进去（它同时是回落目标），其余语言按需动态加载。
 */
export interface TextPack {
  readonly lang: Lang;
  readonly phrases: Phrases;
  /** 八卦卦名：乾 → Qian / 乾 / 건 / Càn */
  readonly trigramName: Readonly<Record<TrigramName, string>>;
  /** 八卦取象：天 → Heaven / 天 / 하늘 / Trời */
  readonly trigramImage: Readonly<Record<TrigramName, string>>;
  /** 梅花易数的八卦取象，问健康、问事物时用得上 */
  readonly trigramLore: Readonly<Record<TrigramName, TrigramLoreText>>;
  /** 六十四卦卦名，下标 0 为第 1 卦 */
  readonly hexagramNames: readonly string[];
  /** 六十四卦全称，如「地天泰」 */
  readonly hexagramFullNames: readonly string[];
  /** 天干十个，缺省用中文的甲乙丙丁 */
  readonly stems?: readonly string[];
  /** 地支十二个，缺省用中文的子丑寅卯 */
  readonly branches?: readonly string[];
  /** 六十四卦经文 */
  readonly zhouyi: readonly HexagramText[];
  /**
   * 六十四卦在八个提问方向上的落点。
   * 这是每种语言里最大的一块（三千六百条），允许先缺着：
   * 缺了就只给通用白话，和选「其他」时一样，界面不会空。
   */
  readonly angles?: readonly MergedAngles[];
}
