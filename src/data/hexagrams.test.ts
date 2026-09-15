import { describe, expect, it } from 'vitest';
import { HEXAGRAM_COUNT, hexagramFullName, hexagramName } from './hexagrams';

describe('卦名', () => {
  it('64 个卦名互不重复', () => {
    const names = Array.from({ length: 64 }, (_, i) => hexagramName(i + 1));
    expect(HEXAGRAM_COUNT).toBe(64);
    expect(new Set(names).size).toBe(64);
  });

  it.each([
    [1, '乾为天'],
    [2, '坤为地'],
    [3, '水雷屯'],
    [4, '山水蒙'],
    [11, '地天泰'],
    [12, '天地否'],
    [63, '水火既济'],
    [64, '火水未济'],
  ])('第 %i 卦全称为 %s（先上卦后下卦）', (n, fullName) => {
    expect(hexagramFullName(n)).toBe(fullName);
  });
});
