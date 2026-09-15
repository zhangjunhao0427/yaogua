import { hexagramByNumber, TRIGRAM_IMAGE } from '../core/hexagram';

// 卦辞与白话待补（见 CLAUDE.md 待办）

/** 文王卦序卦名，下标 0 为第 1 卦 */
const NAMES = [
  '乾', '坤', '屯', '蒙', '需', '讼', '师', '比',
  '小畜', '履', '泰', '否', '同人', '大有', '谦', '豫',
  '随', '蛊', '临', '观', '噬嗑', '贲', '剥', '复',
  '无妄', '大畜', '颐', '大过', '坎', '离', '咸', '恒',
  '遁', '大壮', '晋', '明夷', '家人', '睽', '蹇', '解',
  '损', '益', '夬', '姤', '萃', '升', '困', '井',
  '革', '鼎', '震', '艮', '渐', '归妹', '丰', '旅',
  '巽', '兑', '涣', '节', '中孚', '小过', '既济', '未济',
] as const;

export const HEXAGRAM_COUNT = NAMES.length;

export function hexagramName(n: number): string {
  return NAMES[hexagramByNumber(n).number - 1];
}

/** 全称：上下同卦为「乾为天」，否则「上象下象卦名」，如地天泰 */
export function hexagramFullName(n: number): string {
  const { upper, lower } = hexagramByNumber(n);
  const name = hexagramName(n);
  return upper === lower
    ? `${name}为${TRIGRAM_IMAGE[upper]}`
    : `${TRIGRAM_IMAGE[upper]}${TRIGRAM_IMAGE[lower]}${name}`;
}
