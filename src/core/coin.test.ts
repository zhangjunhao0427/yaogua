import { describe, expect, it } from 'vitest';
import { castLine, isChanging, isYang, lineValueOf } from './coin';
import { randomInt, type Rng } from './random';
import type { LineValue } from './types';

const sequenceRng = (values: number[]): Rng & { remaining: () => number } => ({
  nextUint32: () => {
    const v = values.shift();
    if (v === undefined) throw new Error('测试随机序列已耗尽');
    return v;
  },
  remaining: () => values.length,
});

describe('randomInt', () => {
  it('剔除取模偏差的余段，重新取数', () => {
    // 2^32 % 3 = 1，故 0xFFFFFFFF 落在余段内须丢弃
    const rng = sequenceRng([0xffffffff, 5]);
    expect(randomInt(3, rng)).toBe(2);
    expect(rng.remaining()).toBe(0);
  });

  it('区间内的值直接取模', () => {
    const rng = sequenceRng([0xfffffffe]);
    expect(randomInt(3, rng)).toBe(0xfffffffe % 3);
  });

  it('非法 n 报错', () => {
    expect(() => randomInt(0)).toThrow(RangeError);
    expect(() => randomInt(1.5)).toThrow(RangeError);
  });
});

describe('铜钱法', () => {
  it('背 3 字 2，三枚相加成爻', () => {
    expect(lineValueOf([2, 2, 2])).toBe(6);
    expect(lineValueOf([3, 2, 2])).toBe(7);
    expect(lineValueOf([3, 3, 2])).toBe(8);
    expect(lineValueOf([3, 3, 3])).toBe(9);
  });

  it('7、9 为阳，6、9 为变', () => {
    expect([6, 7, 8, 9].map((v) => isYang(v as LineValue))).toEqual([false, true, false, true]);
    expect([6, 7, 8, 9].map((v) => isChanging(v as LineValue))).toEqual([true, false, false, true]);
  });

  it('百万次投掷，6/7/8/9 频率收敛到 1/8、3/8、3/8、1/8（容差 0.5%）', () => {
    const N = 1_000_000;
    const counts: Record<LineValue, number> = { 6: 0, 7: 0, 8: 0, 9: 0 };
    for (let i = 0; i < N; i++) counts[castLine().value]++;

    const expected: Record<LineValue, number> = { 6: 1 / 8, 7: 3 / 8, 8: 3 / 8, 9: 1 / 8 };
    for (const v of [6, 7, 8, 9] as const) {
      expect(Math.abs(counts[v] / N - expected[v])).toBeLessThan(0.005);
    }
  });
});
