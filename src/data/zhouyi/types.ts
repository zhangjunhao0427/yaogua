import type { SixOf } from '../../core/types';

/** [原文, 白话] */
export type Passage = readonly [original: string, plain: string];

/** [爻题, 原文, 白话] */
export type LinePassage = readonly [title: string, original: string, plain: string];

export interface HexagramText {
  /** 卦义，一句话概括 */
  readonly theme: string;
  /** 卦辞 */
  readonly judgment: Passage;
  /** 爻辞，由初爻到上爻 */
  readonly lines: SixOf<LinePassage>;
  /** 乾卦用九、坤卦用六 */
  readonly extra?: LinePassage;
}
