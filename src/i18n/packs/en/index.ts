import type { TextPack } from '../../types';
import { branches, hexagramFullNames, hexagramNames, stems, trigramImage, trigramLore, trigramName } from './names';
import { phrases } from './phrases';
import { EN_PART_1 } from './zhouyi1';
import { EN_PART_2 } from './zhouyi2';
import { EN_PART_3 } from './zhouyi3';
import { EN_PART_4 } from './zhouyi4';

// 分类落点（3600 条）尚未译；缺了只是少一层解读，界面照常。
export const pack: TextPack = {
  lang: 'en',
  phrases,
  trigramName,
  trigramImage,
  trigramLore,
  stems,
  branches,
  hexagramNames,
  hexagramFullNames,
  zhouyi: [...EN_PART_1, ...EN_PART_2, ...EN_PART_3, ...EN_PART_4],
};
