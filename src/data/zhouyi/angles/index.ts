import { sixOf } from '../../../core/hexagram';
import { MORE_1 } from './more1';
import { MORE_2 } from './more2';
import { MORE_3 } from './more3';
import { MORE_4 } from './more4';
import { ANGLES_1 } from './part1';
import { ANGLES_2 } from './part2';
import { ANGLES_3 } from './part3';
import { ANGLES_4 } from './part4';
import type { Angles, HexagramAngles, MergedAngles } from './types';

export type { Angles, HexagramAngles, MergedAngles } from './types';

/** 前四类（事业、关系、抉择、近况） */
const BASE: readonly HexagramAngles[] = [...ANGLES_1, ...ANGLES_2, ...ANGLES_3, ...ANGLES_4];
/** 后四类（健康、钱财、学业、家庭） */
const MORE: readonly HexagramAngles[] = [...MORE_1, ...MORE_2, ...MORE_3, ...MORE_4];

const join = (a: Angles, b: Angles): readonly string[] => [...a, ...b];

function merge(base: HexagramAngles, more: HexagramAngles): MergedAngles {
  return {
    judgment: join(base.judgment, more.judgment),
    lines: sixOf((i) => join(base.lines[i], more.lines[i])),
    extra: base.extra && more.extra ? join(base.extra, more.extra) : undefined,
  };
}

/** 中文落点，按文王卦序排列，每条经文八列，列序与 ANGLE_CATEGORY_IDS 一致 */
export const ZH_ANGLES: readonly MergedAngles[] = BASE.map((base, i) => merge(base, MORE[i]));
