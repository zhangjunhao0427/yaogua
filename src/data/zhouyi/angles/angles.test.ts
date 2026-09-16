import { describe, expect, it } from 'vitest';
import { castFromValues, sixOf } from '../../../core/hexagram';
import { judge } from '../../../core/rules';
import type { LineValue } from '../../../core/types';
import { CATEGORIES, CATEGORY_IDS } from '../../guide';
import { resolveText, ZHOUYI } from '../index';
import { ANGLES } from './index';

const everyAngles = ANGLES.flatMap((h) => [h.judgment, ...h.lines, ...(h.extra ? [h.extra] : [])]);

describe('分类落点', () => {
  it('与经文一一对应：64 卦、450 条、每条 4 个方向', () => {
    expect(ANGLES).toHaveLength(ZHOUYI.length);
    ANGLES.forEach((angles, i) => {
      expect(angles.lines).toHaveLength(ZHOUYI[i].lines.length);
      expect(Boolean(angles.extra)).toBe(Boolean(ZHOUYI[i].extra));
    });
    expect(everyAngles).toHaveLength(450);
    expect(everyAngles.flat()).toHaveLength(450 * CATEGORIES.length);
  });

  it('每条非空、以中文标点收尾、不含半角标点', () => {
    for (const angles of everyAngles) {
      for (const text of angles) {
        expect(text.length).toBeGreaterThan(4);
        expect(text).toMatch(/[。？！]$/);
        expect(text).not.toMatch(/[,.;:!?'"()]/);
      }
    }
  });

  it('同一条经文的四个方向互不相同', () => {
    for (const angles of everyAngles) {
      expect(new Set(angles).size).toBe(CATEGORIES.length);
    }
  });

  it('指定分类才返回落点，不指定时为 null', () => {
    const ref = { kind: 'line', hexagram: 1, line: 0 } as const;
    expect(resolveText(ref).angle).toBeNull();
    expect(resolveText(ref, 'career').angle).toBe(ANGLES[0].lines[0][0]);
    expect(resolveText(ref, 'recent').angle).toBe(ANGLES[0].lines[0][3]);
  });

  it('用九、用六各有四个方向', () => {
    for (const category of CATEGORY_IDS) {
      expect(resolveText({ kind: 'useNine' }, category).angle).toBeTruthy();
      expect(resolveText({ kind: 'useSix' }, category).angle).toBeTruthy();
    }
  });

  it('4096 种摇卦结果 × 4 个分类，判定所引经文都有落点', () => {
    const VALUES: readonly LineValue[] = [6, 7, 8, 9];
    for (let m = 0; m < 4 ** 6; m++) {
      const verdict = judge(castFromValues(sixOf((i) => VALUES[(m >> (2 * i)) & 3])));
      for (const category of CATEGORY_IDS) {
        for (const { ref } of verdict.readings) {
          expect(resolveText(ref, category).angle).toBeTruthy();
        }
      }
    }
  });
});
