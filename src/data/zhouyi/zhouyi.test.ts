import { describe, expect, it } from 'vitest';
import { castFromValues, hexagramByNumber, lineTitle, sixOf } from '../../core/hexagram';
import { judge } from '../../core/rules';
import type { LineValue } from '../../core/types';
import { resolveText, ZHOUYI } from './index';

const allPassages = ZHOUYI.flatMap((h) => [
  { original: h.judgment[0], plain: h.judgment[1] },
  ...[...h.lines, ...(h.extra ? [h.extra] : [])].map(([, original, plain]) => ({ original, plain })),
]);

describe('经文数据', () => {
  it('64 条卦辞、386 条爻辞（含用九、用六）', () => {
    expect(ZHOUYI).toHaveLength(64);
    const lineCount = ZHOUYI.reduce((sum, h) => sum + h.lines.length + (h.extra ? 1 : 0), 0);
    expect(lineCount).toBe(386);
  });

  it('每条爻辞的爻题与所在卦的阴阳一致（六个爻题唯一确定一卦，故可校验卦序）', () => {
    ZHOUYI.forEach((text, i) => {
      const { yang } = hexagramByNumber(i + 1);
      expect(text.lines.map(([title]) => title)).toEqual(sixOf((j) => lineTitle(j, yang[j])));
    });
  });

  it('只有乾有用九、坤有用六', () => {
    expect(ZHOUYI[0].extra?.[0]).toBe('用九');
    expect(ZHOUYI[1].extra?.[0]).toBe('用六');
    expect(ZHOUYI.slice(2).filter((h) => h.extra)).toEqual([]);
  });

  it('文本非空、以中文标点收尾、不含半角标点，白话不照抄原文', () => {
    for (const { original, plain } of allPassages) {
      expect(original).toMatch(/。$/);
      expect(plain).toMatch(/[。？！]$/);
      expect(original + plain).not.toMatch(/[,.;:!?'"()]/);
      expect(plain).not.toBe(original);
    }
  });

  it('卦义均为四字', () => {
    for (const h of ZHOUYI) expect([...h.theme]).toHaveLength(4);
  });
});

describe('规则层闭合', () => {
  it('4096 种摇卦结果的判定所引经文全部存在', () => {
    const VALUES: readonly LineValue[] = [6, 7, 8, 9];
    for (let m = 0; m < 4 ** 6; m++) {
      const verdict = judge(castFromValues(sixOf((i) => VALUES[(m >> (2 * i)) & 3])));
      for (const { ref } of verdict.readings) {
        const text = resolveText(ref);
        expect(text.original.length).toBeGreaterThan(0);
      }
    }
  });

  it('用九、用六解析到乾、坤', () => {
    expect(resolveText({ kind: 'useNine' })).toMatchObject({ hexagram: 1, title: '用九', original: '见群龙无首，吉。' });
    expect(resolveText({ kind: 'useSix' })).toMatchObject({ hexagram: 2, title: '用六', original: '利永贞。' });
  });

  it('爻辞按爻位取文', () => {
    expect(resolveText({ kind: 'line', hexagram: 1, line: 0 })).toMatchObject({ title: '初九', original: '潜龙勿用。' });
    expect(resolveText({ kind: 'line', hexagram: 64, line: 5 }).title).toBe('上九');
  });
});
