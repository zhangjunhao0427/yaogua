import { hexagramByNumber } from '../core/hexagram';
import type { TrigramName } from '../core/types';
import { pack } from './index';

/** 当前语言的卦名，如「泰」 */
export function hexagramName(n: number): string {
  return pack().hexagramNames[hexagramByNumber(n).number - 1];
}

/** 当前语言的卦全称，如「地天泰」 */
export function hexagramFullName(n: number): string {
  return pack().hexagramFullNames[hexagramByNumber(n).number - 1];
}

/** 当前语言的八卦卦名 */
export function trigramName(name: TrigramName): string {
  return pack().trigramName[name];
}

/** 当前语言的八卦取象，如乾为「天」 */
export function trigramImage(name: TrigramName): string {
  return pack().trigramImage[name];
}
