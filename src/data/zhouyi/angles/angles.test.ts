import { describe, expect, it } from 'vitest';
import { castFromValues, sixOf } from '../../../core/hexagram';
import { judge } from '../../../core/rules';
import type { LineValue } from '../../../core/types';
import { ANGLE_CATEGORY_IDS, CATEGORIES } from '../../guide';
import { resolveText } from '../index';
import { ZH_ZHOUYI as ZHOUYI } from '../scripture';
import { ZH_ANGLES as ANGLES } from './index';

const COLUMNS = ANGLE_CATEGORY_IDS.length;
const everyAngles = ANGLES.flatMap((h) => [h.judgment, ...h.lines, ...(h.extra ? [h.extra] : [])]);

describe('分类落点', () => {
  it('八个有落点的方向，外加一个「其他」', () => {
    expect(COLUMNS).toBe(8);
    expect(CATEGORIES).toHaveLength(9);
    expect(ANGLE_CATEGORY_IDS).not.toContain('other');
  });

  it('与经文一一对应：64 卦、450 条、每条八列', () => {
    expect(ANGLES).toHaveLength(ZHOUYI.length);
    ANGLES.forEach((angles, i) => {
      expect(angles.lines).toHaveLength(ZHOUYI[i].lines.length);
      expect(Boolean(angles.extra)).toBe(Boolean(ZHOUYI[i].extra));
    });
    expect(everyAngles).toHaveLength(450);
    for (const angles of everyAngles) expect(angles).toHaveLength(COLUMNS);
  });

  it('每条非空、以中文标点收尾、不含半角标点', () => {
    for (const angles of everyAngles) {
      for (const text of angles) {
        expect([...text].length).toBeGreaterThanOrEqual(5);
        expect(text).toMatch(/[。？！]$/);
        expect(text).not.toMatch(/[,.;:!?'"()]/);
      }
    }
  });

  it('同一条经文的八个方向互不相同', () => {
    for (const angles of everyAngles) {
      expect(new Set(angles).size).toBe(COLUMNS);
    }
  });

  it('指定分类才返回落点，不指定或选「其他」时为 null', () => {
    const ref = { kind: 'line', hexagram: 1, line: 0 } as const;
    expect(resolveText(ref).angle).toBeNull();
    expect(resolveText(ref, 'other').angle).toBeNull();
    expect(resolveText(ref, 'career').angle).toBe(ANGLES[0].lines[0][0]);
    expect(resolveText(ref, 'health').angle).toBe(ANGLES[0].lines[0][4]);
    expect(resolveText(ref, 'family').angle).toBe(ANGLES[0].lines[0][7]);
  });

  it('用九、用六在八个方向上都有落点', () => {
    for (const category of ANGLE_CATEGORY_IDS) {
      expect(resolveText({ kind: 'useNine' }, category).angle).toBeTruthy();
      expect(resolveText({ kind: 'useSix' }, category).angle).toBeTruthy();
    }
  });

  it('4096 种摇卦结果 × 八个方向，判定所引经文都有落点', () => {
    const VALUES: readonly LineValue[] = [6, 7, 8, 9];
    for (let m = 0; m < 4 ** 6; m++) {
      const verdict = judge(castFromValues(sixOf((i) => VALUES[(m >> (2 * i)) & 3])));
      for (const category of ANGLE_CATEGORY_IDS) {
        for (const { ref } of verdict.readings) {
          expect(resolveText(ref, category).angle).toBeTruthy();
        }
      }
    }
  });
});
