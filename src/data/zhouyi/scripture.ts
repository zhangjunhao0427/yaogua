// 中文经文，按文王卦序拼成一份。其他语言的经文在各自的文字包里。
import { PART_1 } from './part1';
import { PART_2 } from './part2';
import { PART_3 } from './part3';
import { PART_4 } from './part4';
import type { HexagramText } from './types';

/** 下标 0 为第 1 卦 */
export const ZH_ZHOUYI: readonly HexagramText[] = [...PART_1, ...PART_2, ...PART_3, ...PART_4];
