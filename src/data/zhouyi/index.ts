import { hexagramByNumber } from '../../core/hexagram';
import type { TextRef } from '../../core/types';
import type { Category } from '../guide';
import { angleIndex, anglesOf } from './angles';
import { PART_1 } from './part1';
import { PART_2 } from './part2';
import { PART_3 } from './part3';
import { PART_4 } from './part4';
import type { HexagramText } from './types';

export type { HexagramText, LinePassage, Passage } from './types';

/** 按文王卦序排列，下标 0 为第 1 卦 */
export const ZHOUYI: readonly HexagramText[] = [...PART_1, ...PART_2, ...PART_3, ...PART_4];

export interface ResolvedText {
  readonly hexagram: number;
  /** 「卦辞」「初九」「用九」等 */
  readonly title: string;
  readonly original: string;
  readonly plain: string;
  /** 按提问分类给出的落点；未指定分类时为 null */
  readonly angle: string | null;
}

export function hexagramText(n: number): HexagramText {
  return ZHOUYI[hexagramByNumber(n).number - 1];
}

function extraOf(n: number, category?: Category | null): ResolvedText {
  const extra = hexagramText(n).extra;
  const angles = anglesOf(n).extra;
  if (!extra || !angles) throw new Error(`第 ${n} 卦没有用九用六`);
  const [title, original, plain] = extra;
  return { hexagram: n, title, original, plain, angle: category ? angles[angleIndex(category)] : null };
}

/** 把变占判定给出的经文引用解析为具体文本；给了分类就带上该方向的落点 */
export function resolveText(ref: TextRef, category?: Category | null): ResolvedText {
  switch (ref.kind) {
    case 'judgment': {
      const [original, plain] = hexagramText(ref.hexagram).judgment;
      const angles = anglesOf(ref.hexagram).judgment;
      return {
        hexagram: ref.hexagram,
        title: '卦辞',
        original,
        plain,
        angle: category ? angles[angleIndex(category)] : null,
      };
    }
    case 'line': {
      const [title, original, plain] = hexagramText(ref.hexagram).lines[ref.line];
      const angles = anglesOf(ref.hexagram).lines[ref.line];
      return {
        hexagram: ref.hexagram,
        title,
        original,
        plain,
        angle: category ? angles[angleIndex(category)] : null,
      };
    }
    case 'useNine':
      return extraOf(1, category);
    case 'useSix':
      return extraOf(2, category);
  }
}
