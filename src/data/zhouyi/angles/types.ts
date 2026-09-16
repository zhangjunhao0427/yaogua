import type { SixOf } from '../../../core/types';

/** 四个提问方向上的落点，顺序与 CATEGORIES 一致：事业、关系、抉择、近况 */
export type Angles = readonly [career: string, relationship: string, decision: string, recent: string];

export interface HexagramAngles {
  readonly judgment: Angles;
  readonly lines: SixOf<Angles>;
  /** 乾用九、坤用六 */
  readonly extra?: Angles;
}
