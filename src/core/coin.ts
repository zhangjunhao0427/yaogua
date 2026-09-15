import { cryptoRng, randomInt, type Rng } from './random';
import type { CoinValue, Line, LineValue, Toss } from './types';

export const LINE_NAME: Record<LineValue, string> = { 6: '老阴', 7: '少阳', 8: '少阴', 9: '老阳' };

export const isYang = (v: LineValue): boolean => v === 7 || v === 9;

export const isChanging = (v: LineValue): boolean => v === 6 || v === 9;

/** 掷一枚：字面 2，背面 3 */
export function tossCoin(rng: Rng = cryptoRng()): CoinValue {
  return randomInt(2, rng) === 0 ? 2 : 3;
}

export function tossCoins(rng: Rng = cryptoRng()): Toss {
  return [tossCoin(rng), tossCoin(rng), tossCoin(rng)];
}

export function lineValueOf(toss: Toss): LineValue {
  return (toss[0] + toss[1] + toss[2]) as LineValue;
}

/** 摇一次，成一爻 */
export function castLine(rng: Rng = cryptoRng()): Line {
  const toss = tossCoins(rng);
  return { toss, value: lineValueOf(toss) };
}
