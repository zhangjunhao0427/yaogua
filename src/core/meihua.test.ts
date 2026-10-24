import { describe, expect, it } from 'vitest';
import { hexagramByNumber, lineTitle } from './hexagram';
import {
  castFromMoment,
  castFromNumbers,
  ELEMENT_OF,
  hexagramFrom,
  hourBranchOf,
  movingLineFromNumber,
  NUMBER_BY_TRIGRAM,
  relationOf,
  TRIGRAM_BY_NUMBER,
  trigramFromNumber,
} from './meihua';
import type { TrigramName } from './types';

describe('先天八卦数', () => {
  it('乾一兑二离三震四巽五坎六艮七坤八', () => {
    expect(Object.values(TRIGRAM_BY_NUMBER)).toEqual(['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']);
    expect(NUMBER_BY_TRIGRAM.乾).toBe(1);
    expect(NUMBER_BY_TRIGRAM.坤).toBe(8);
  });

  it('除八取余，余零作八', () => {
    expect(trigramFromNumber(1)).toBe('乾');
    expect(trigramFromNumber(8)).toBe('坤');
    expect(trigramFromNumber(9)).toBe('乾');
    expect(trigramFromNumber(16)).toBe('坤');
    expect(trigramFromNumber(0)).toBe('坤');
  });

  it('除六取余定动爻，余零作六（上爻）', () => {
    expect(movingLineFromNumber(1)).toBe(0);
    expect(movingLineFromNumber(6)).toBe(5);
    expect(movingLineFromNumber(7)).toBe(0);
    expect(movingLineFromNumber(12)).toBe(5);
  });
});

describe('上下卦拼合', () => {
  it('上乾下坤为天地否，上坤下乾为地天泰', () => {
    expect(hexagramFrom('乾', '坤').number).toBe(12);
    expect(hexagramFrom('坤', '乾').number).toBe(11);
  });

  it('八八六十四种组合各得一卦，无重复', () => {
    const names = Object.values(TRIGRAM_BY_NUMBER);
    const numbers = names.flatMap((upper) => names.map((lower) => hexagramFrom(upper, lower).number));
    expect(new Set(numbers).size).toBe(64);
  });
});

describe('五行与体用', () => {
  it('乾兑金、震巽木、坎水、离火、坤艮土', () => {
    expect(ELEMENT_OF).toEqual({ 乾: '金', 兑: '金', 震: '木', 巽: '木', 坎: '水', 离: '火', 坤: '土', 艮: '土' });
  });

  it.each<[TrigramName, TrigramName, string]>([
    ['震', '坎', 'useGeneratesBody'], // 体木、用水，水生木
    ['坎', '震', 'bodyGeneratesUse'], // 体水、用木，水生木
    ['乾', '兑', 'sameElement'], // 同为金
    ['乾', '震', 'bodyOvercomesUse'], // 体金克用木
    ['震', '乾', 'useOvercomesBody'], // 用金克体木
  ])('体%s用%s为 %s', (body, use, expected) => {
    expect(relationOf(body, use)).toBe(expected);
  });
});

describe('起卦', () => {
  it('动爻在下卦则下卦为用、上卦为体', () => {
    // 上卦 1 乾、下卦 2 兑、动爻 2（九二，在下卦）
    const cast = castFromNumbers(1, 2, 2);
    expect(cast.upper).toBe('乾');
    expect(cast.lower).toBe('兑');
    expect(cast.moving).toBe(1);
    expect(cast.movingIn).toBe('lower');
    expect(cast.use).toBe('兑');
    expect(cast.body).toBe('乾');
  });

  it('动爻在上卦则上卦为用、下卦为体', () => {
    const cast = castFromNumbers(1, 2, 5);
    expect(cast.moving).toBe(4);
    expect(cast.movingIn).toBe('upper');
    expect(cast.use).toBe('乾');
    expect(cast.body).toBe('兑');
  });

  it('本卦、互卦、变卦三者齐备，变卦只翻动爻', () => {
    // 上离三、下乾一，动爻 3：火天大有，九三动
    const cast = castFromNumbers(3, 1, 3);
    expect(cast.origin.number).toBe(14);
    expect(cast.moving).toBe(2);
    // 大有九三变得火泽睽
    expect(cast.changed.number).toBe(38);
    // 本卦与变卦只差动爻那一位
    const diff = cast.origin.yang.filter((y, i) => y !== cast.changed.yang[i]);
    expect(diff).toHaveLength(1);
    // 大有的互卦为泽天夬
    expect(cast.mutual.number).toBe(43);
  });

  it('爻题按本卦阴阳取，动爻位于一至六之间', () => {
    for (let n = 1; n <= 60; n++) {
      const cast = castFromNumbers(n, n + 1, n);
      expect(cast.moving).toBeGreaterThanOrEqual(0);
      expect(cast.moving).toBeLessThanOrEqual(5);
      expect(lineTitle(cast.moving, cast.origin.yang[cast.moving])).toMatch(/^(初|上|九|六)/);
    }
  });
});

describe('时间起卦', () => {
  it('上卦取年月日，下卦与动爻取年月日时', () => {
    // 午年（7）五月初十巳时（6）：上卦 7+5+10=22，22÷8 余 6 为坎
    // 下卦 22+6=28，28÷8 余 4 为震；动爻 28÷6 余 4，即六四
    const cast = castFromMoment({ yearBranch: 7, month: 5, day: 10, hourBranch: 6 });
    expect(cast.upper).toBe('坎');
    expect(cast.lower).toBe('震');
    expect(cast.moving).toBe(3);
    expect(cast.origin.number).toBe(hexagramByNumber(cast.origin.number).number);
    expect(cast.movingIn).toBe('upper');
    expect(cast.use).toBe('坎');
    expect(cast.body).toBe('震');
  });

  it('同一时刻起卦结果相同：时间起卦没有随机', () => {
    const moment = { yearBranch: 3, month: 8, day: 21, hourBranch: 11 };
    expect(castFromMoment(moment)).toEqual(castFromMoment(moment));
  });

  it('时辰地支：子时跨夜，两小时一辰', () => {
    // 23–1 子、1–3 丑、……、11–13 午、13–15 未、21–23 亥
    expect(hourBranchOf(23)).toBe(1);
    expect(hourBranchOf(0)).toBe(1);
    expect(hourBranchOf(1)).toBe(2);
    expect(hourBranchOf(11)).toBe(7);
    expect(hourBranchOf(12)).toBe(7);
    expect(hourBranchOf(13)).toBe(8);
    expect(hourBranchOf(22)).toBe(12);
  });

  it('每个时辰正好覆盖两个钟点，十二辰不重不漏', () => {
    const counts = new Map<number, number>();
    for (let hour = 0; hour < 24; hour++) {
      const branch = hourBranchOf(hour);
      counts.set(branch, (counts.get(branch) ?? 0) + 1);
    }
    expect([...counts.keys()].sort((a, b) => a - b)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
    expect([...counts.values()]).toEqual(Array.from({ length: 12 }, () => 2));
  });
});
