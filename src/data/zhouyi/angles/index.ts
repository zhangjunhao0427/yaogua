import { hexagramByNumber } from '../../../core/hexagram';
import { CATEGORY_IDS, type Category } from '../../guide';
import { ANGLES_1 } from './part1';
import { ANGLES_2 } from './part2';
import { ANGLES_3 } from './part3';
import { ANGLES_4 } from './part4';
import type { HexagramAngles } from './types';

export type { Angles, HexagramAngles } from './types';

/** 按文王卦序排列，与 ZHOUYI 一一对应 */
export const ANGLES: readonly HexagramAngles[] = [...ANGLES_1, ...ANGLES_2, ...ANGLES_3, ...ANGLES_4];

export function anglesOf(n: number): HexagramAngles {
  return ANGLES[hexagramByNumber(n).number - 1];
}

export function angleIndex(category: Category): number {
  return CATEGORY_IDS.indexOf(category);
}
