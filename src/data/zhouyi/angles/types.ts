import type { SixOf } from '../../../core/types';

/** 一组四个方向的落点，顺序固定：
 *  part*.ts 为事业、关系、抉择、近况；more*.ts 为健康、钱财、学业、家庭 */
export type Angles = readonly [string, string, string, string];

export interface HexagramAngles {
  readonly judgment: Angles;
  readonly lines: SixOf<Angles>;
  /** 乾用九、坤用六 */
  readonly extra?: Angles;
}

/** 两组合并后的八列，列序与 ANGLE_CATEGORY_IDS 一致 */
export interface MergedAngles {
  readonly judgment: readonly string[];
  readonly lines: SixOf<readonly string[]>;
  readonly extra?: readonly string[];
}
