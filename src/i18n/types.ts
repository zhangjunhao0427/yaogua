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
  /** 六十四卦经文 */
  readonly zhouyi: readonly HexagramText[];
  /** 六十四卦在八个提问方向上的落点 */
  readonly angles: readonly MergedAngles[];
}
