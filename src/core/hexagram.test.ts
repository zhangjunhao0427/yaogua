import { describe, expect, it } from 'vitest';
import {
  castFromValues,
  flipLines,
  hexagramByNumber,
  hexagramOf,
  hexagramSymbol,
  KING_WEN,
  LINE_INDICES,
  lineTitle,
  sixOf,
  TRIGRAM,
  trigramOf,
} from './hexagram';
import type { LineIndex } from './types';

/** 由「初→上」的 0/1 串构造六爻，如 '111000' 为下乾上坤 */
const fromBits = (s: string) => sixOf((i) => s[i] === '1');

describe('八卦', () => {
  it('8 个键对应 8 个互不相同的卦名', () => {
    expect(Object.keys(TRIGRAM)).toHaveLength(8);
    expect(new Set(Object.values(TRIGRAM)).size).toBe(8);
  });

  it('由下至上取爻', () => {
    expect(trigramOf(true, false, false)).toBe('震');
    expect(trigramOf(false, false, true)).toBe('艮');
    expect(trigramOf(true, true, false)).toBe('兑');
    expect(trigramOf(false, true, true)).toBe('巽');
  });
});

describe('KING_WEN 查表', () => {
  it('恰好 64 条，值去重后 64 个，1 至 64 无缺失', () => {
    const values = Object.values(KING_WEN);
    expect(values).toHaveLength(64);
    expect(new Set(values).size).toBe(64);
    expect([...values].sort((a, b) => a - b)).toEqual(Array.from({ length: 64 }, (_, i) => i + 1));
  });

  it('键恰为 8×8 种上下卦组合', () => {
    const names = Object.values(TRIGRAM);
    const expected = names.flatMap((upper) => names.map((lower) => upper + lower));
    expect(Object.keys(KING_WEN).sort()).toEqual(expected.sort());
  });

  it('全部 64 种六爻组合各映射到唯一卦号', () => {
    const numbers = Array.from({ length: 64 }, (_, bits) =>
      hexagramOf(sixOf((i) => ((bits >> i) & 1) === 1)).number,
    );
    expect(new Set(numbers).size).toBe(64);
  });
});

describe('定点校验', () => {
  it.each([
    ['乾', '111111', 1],
    ['坤', '000000', 2],
    ['屯', '100010', 3],
    ['蒙', '010001', 4],
    ['泰', '111000', 11],
    ['否', '000111', 12],
    ['既济', '101010', 63],
    ['未济', '010101', 64],
  ])('%s（初→上 %s）为第 %i 卦', (_, bits, n) => {
    expect(hexagramOf(fromBits(bits)).number).toBe(n);
  });

  it('地天泰为上坤下乾，天地否为上乾下坤', () => {
    expect(hexagramByNumber(11)).toMatchObject({ upper: '坤', lower: '乾' });
    expect(hexagramByNumber(12)).toMatchObject({ upper: '乾', lower: '坤' });
  });

  it('卦号越界时报错', () => {
    expect(() => hexagramByNumber(0)).toThrow(RangeError);
    expect(() => hexagramByNumber(65)).toThrow(RangeError);
  });
});

describe('之卦', () => {
  it('任一卦全变六爻两次，得回原卦', () => {
    for (let n = 1; n <= 64; n++) {
      const once = hexagramOf(flipLines(hexagramByNumber(n).yang, LINE_INDICES));
      const twice = hexagramOf(flipLines(once.yang, LINE_INDICES));
      expect(once.number).not.toBe(n);
      expect(twice.number).toBe(n);
    }
  });

  it('只翻转变爻，其余不动', () => {
    // 乾卦初九变，之卦为天风姤
    const cast = castFromValues([9, 7, 7, 7, 7, 7]);
    expect(cast.base.number).toBe(1);
    expect(cast.changing).toEqual([0]);
    expect(cast.changed?.number).toBe(44);
  });

  it('无变爻时无之卦', () => {
    const cast = castFromValues([7, 8, 7, 8, 7, 8]);
    expect(cast.base.number).toBe(63);
    expect(cast.changing).toEqual([]);
    expect(cast.changed).toBeNull();
  });
});

describe('卦符', () => {
  it('第 1 卦为 U+4DC0，第 64 卦为 U+4DFF', () => {
    expect(hexagramSymbol(1)).toBe('䷀');
    expect(hexagramSymbol(64)).toBe('䷿');
  });
});

describe('爻题命名', () => {
  it.each<[LineIndex, boolean, string]>([
    [0, true, '初九'],
    [1, true, '九二'],
    [3, true, '九四'],
    [5, true, '上九'],
    [0, false, '初六'],
    [2, false, '六三'],
    [5, false, '上六'],
  ])('爻位 %i、阳=%s 为 %s', (i, yang, title) => {
    expect(lineTitle(i, yang)).toBe(title);
  });
});
