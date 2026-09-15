import { describe, expect, it } from 'vitest';
import { castFromValues, LINE_INDICES, sixOf } from './hexagram';
import { judge } from './rules';
import type { LineValue, SixOf, Verdict } from './types';

const verdictOf = (values: SixOf<LineValue>) => judge(castFromValues(values));

function lineRefs(v: Verdict) {
  return v.readings.map(({ ref }) => {
    if (ref.kind !== 'line') throw new Error(`应为爻辞，实为 ${ref.kind}`);
    return ref;
  });
}

describe('变占七则', () => {
  it('k=0：占本卦卦辞', () => {
    const v = verdictOf([7, 8, 7, 8, 7, 8]); // 既济
    expect(v.count).toBe(0);
    expect(v.readings).toEqual([{ ref: { kind: 'judgment', hexagram: 63 }, main: true }]);
  });

  it('k=1：占本卦变爻爻辞', () => {
    const v = verdictOf([7, 7, 9, 7, 7, 7]); // 乾，九三变
    expect(v.count).toBe(1);
    expect(v.readings).toEqual([{ ref: { kind: 'line', hexagram: 1, line: 2 }, main: true }]);
  });

  it('k=2：占本卦两变爻爻辞，以上爻为主', () => {
    const v = verdictOf([8, 6, 8, 8, 9, 8]); // 比，六二、九五变
    expect(v.count).toBe(2);
    expect(v.readings).toEqual([
      { ref: { kind: 'line', hexagram: 8, line: 4 }, main: true },
      { ref: { kind: 'line', hexagram: 8, line: 1 }, main: false },
    ]);
  });

  it('k=3：本卦与之卦卦辞并看，两条都给，以本卦为主', () => {
    const v = verdictOf([9, 9, 9, 8, 8, 8]); // 泰之坤
    expect(v.count).toBe(3);
    expect(v.readings).toEqual([
      { ref: { kind: 'judgment', hexagram: 11 }, main: true },
      { ref: { kind: 'judgment', hexagram: 2 }, main: false },
    ]);
  });

  it('k=4：占之卦两不变爻爻辞（不是变爻），以下爻为主', () => {
    const cast = castFromValues([9, 6, 7, 9, 6, 8]); // 丰之井，三、上不变
    expect(cast.base.number).toBe(55);
    expect(cast.changed?.number).toBe(48);

    const v = judge(cast);
    expect(v.count).toBe(4);
    expect(v.readings).toEqual([
      { ref: { kind: 'line', hexagram: 48, line: 2 }, main: true },
      { ref: { kind: 'line', hexagram: 48, line: 5 }, main: false },
    ]);
    for (const ref of lineRefs(v)) expect(cast.changing).not.toContain(ref.line);
  });

  it('k=5：占之卦唯一不变爻爻辞（不是变爻）', () => {
    const cast = castFromValues([9, 9, 8, 9, 9, 9]); // 履之坤，三爻不变
    expect(cast.base.number).toBe(10);
    expect(cast.changed?.number).toBe(2);

    const v = judge(cast);
    expect(v.count).toBe(5);
    expect(v.readings).toEqual([{ ref: { kind: 'line', hexagram: 2, line: 2 }, main: true }]);
    expect(cast.changing).not.toContain(2);
  });

  it('k=6：乾卦占用九', () => {
    expect(verdictOf([9, 9, 9, 9, 9, 9]).readings).toEqual([{ ref: { kind: 'useNine' }, main: true }]);
  });

  it('k=6：坤卦占用六', () => {
    expect(verdictOf([6, 6, 6, 6, 6, 6]).readings).toEqual([{ ref: { kind: 'useSix' }, main: true }]);
  });

  it('k=6：其余卦占之卦卦辞', () => {
    const v = verdictOf([9, 6, 9, 6, 9, 6]); // 既济之未济
    expect(v.readings).toEqual([{ ref: { kind: 'judgment', hexagram: 64 }, main: true }]);
  });
});

describe('全部 4096 种摇卦结果', () => {
  const VALUES: readonly LineValue[] = [6, 7, 8, 9];
  const WEIGHT: Record<LineValue, number> = { 6: 1, 7: 3, 8: 3, 9: 1 };
  const BINOMIAL = [1, 6, 15, 20, 15, 6, 1];
  const READING_COUNT = [1, 1, 2, 2, 2, 1, 1];

  const casts = Array.from({ length: 4 ** 6 }, (_, m) =>
    castFromValues(sixOf((i) => VALUES[(m >> (2 * i)) & 3])),
  );

  it('各分支概率符合 C(6,k)·(1/4)^k·(3/4)^(6-k)', () => {
    // 以 1/8^6 为单位精确计数
    const weight = new Array<number>(7).fill(0);
    for (const cast of casts) {
      weight[cast.changing.length] += cast.values.reduce((w, v) => w * WEIGHT[v], 1);
    }
    expect(weight).toEqual(BINOMIAL.map((c, k) => c * 2 ** k * 6 ** (6 - k)));
  });

  it('条数与规则一致，且恰有一条为主、排在最前', () => {
    for (const cast of casts) {
      const { readings } = judge(cast);
      expect(readings).toHaveLength(READING_COUNT[cast.changing.length]);
      expect(readings.filter((r) => r.main)).toHaveLength(1);
      expect(readings[0].main).toBe(true);
    }
  });

  it('k=1、2 读本卦变爻，二爻变以上爻为主', () => {
    for (const cast of casts.filter((c) => c.changing.length === 1 || c.changing.length === 2)) {
      const refs = lineRefs(judge(cast));
      for (const ref of refs) {
        expect(ref.hexagram).toBe(cast.base.number);
        expect(cast.changing).toContain(ref.line);
      }
      expect(refs[0].line).toBe(Math.max(...cast.changing));
    }
  });

  it('k=4、5 读之卦不变爻，四爻变以下爻为主', () => {
    for (const cast of casts.filter((c) => c.changing.length === 4 || c.changing.length === 5)) {
      const unchanged = LINE_INDICES.filter((i) => !cast.changing.includes(i));
      const refs = lineRefs(judge(cast));
      for (const ref of refs) {
        expect(ref.hexagram).toBe(cast.changed?.number);
        expect(ref.hexagram).not.toBe(cast.base.number);
        expect(unchanged).toContain(ref.line);
      }
      expect(refs[0].line).toBe(Math.min(...unchanged));
    }
  });
});
