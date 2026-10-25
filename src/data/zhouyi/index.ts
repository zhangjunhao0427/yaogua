import { hexagramByNumber } from '../../core/hexagram';
import type { TextRef } from '../../core/types';
import { pack } from '../../i18n';
import { ANGLE_CATEGORY_IDS, type Category } from '../guide';
import type { MergedAngles } from './angles';
import type { HexagramText } from './types';

export type { HexagramText, LinePassage, Passage } from './types';

export interface ResolvedText {
  readonly hexagram: number;
  /** 「卦辞」「初九」「用九」等 */
  readonly title: string;
  readonly original: string;
  readonly plain: string;
  /** 按提问分类给出的落点；未指定分类或选了「其他」时为 null */
  readonly angle: string | null;
}

/** 当前语言的经文 */
export function hexagramText(n: number): HexagramText {
  return pack().zhouyi[hexagramByNumber(n).number - 1];
}

/** 当前语言的分类落点；这种语言还没译落点时为 null */
export function anglesOf(n: number): MergedAngles | null {
  const angles = pack().angles;
  return angles ? angles[hexagramByNumber(n).number - 1] : null;
}

/** 「其他」没有落点，返回 -1 */
function angleIndex(category: Category): number {
  return ANGLE_CATEGORY_IDS.indexOf(category as never);
}

/** 「其他」没有对应的列，退回 null，由界面只显示通用白话 */
function angleFor(angles: readonly string[] | undefined, category?: Category | null): string | null {
  if (!category || !angles) return null;
  const column = angleIndex(category);
  return column < 0 ? null : (angles[column] ?? null);
}

function extraOf(n: number, category?: Category | null): ResolvedText {
  const extra = hexagramText(n).extra;
  const angles = anglesOf(n)?.extra;
  if (!extra) throw new Error(`第 ${n} 卦没有用九用六`);
  const [title, original, plain] = extra;
  return { hexagram: n, title, original, plain, angle: angleFor(angles, category) };
}

/** 把变占判定给出的经文引用解析为具体文本；给了分类就带上该方向的落点 */
export function resolveText(ref: TextRef, category?: Category | null): ResolvedText {
  switch (ref.kind) {
    case 'judgment': {
      const [original, plain] = hexagramText(ref.hexagram).judgment;
      return {
        hexagram: ref.hexagram,
        title: '卦辞',
        original,
        plain,
        angle: angleFor(anglesOf(ref.hexagram)?.judgment, category),
      };
    }
    case 'line': {
      const [title, original, plain] = hexagramText(ref.hexagram).lines[ref.line];
      return {
        hexagram: ref.hexagram,
        title,
        original,
        plain,
        angle: angleFor(anglesOf(ref.hexagram)?.lines[ref.line], category),
      };
    }
    case 'useNine':
      return extraOf(1, category);
    case 'useSix':
      return extraOf(2, category);
  }
}
