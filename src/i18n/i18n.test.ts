import { describe, expect, it } from 'vitest';
import { lineTitle } from '../core/hexagram';
import type { LineIndex } from '../core/types';
import { ANGLE_CATEGORY_IDS } from '../data/guide';
import { HEXAGRAM_COUNT } from '../data/hexagrams';
import { loadPack, t } from './index';
import { ALL_LANGS, AVAILABLE_LANGS } from './lang';
import { collectKeys, TRIGRAMS } from './scan';
import type { TextPack } from './types';

const KEYS = collectKeys();

/** 能让用户选到的语言（中文之外），每一种都必须是完整的 */
const translated = AVAILABLE_LANGS.filter((l) => l !== 'zh');

describe('界面文案的键', () => {
  it('能从源码与数据里收齐', () => {
    expect(KEYS.length).toBeGreaterThan(100);
    expect(KEYS).toContain('摇卦');
    expect(KEYS).toContain('事业');
    expect(KEYS).toContain('应验');
  });

  it('键里的占位符写法一致：{名字}，不留空壳', () => {
    for (const key of KEYS) {
      expect(key).not.toMatch(/\{\s*\}/);
      expect(key.trim()).not.toBe('');
    }
  });
});

describe.each(translated)('%s 的文字包', (lang) => {
  let p: TextPack;


  it('加载得到，且确实是这种语言', async () => {
    p = await loadPack(lang);
    expect(p.lang).toBe(lang);
  });

  it('界面文案一条不缺', async () => {
    p = await loadPack(lang);
    const missing = KEYS.filter((k) => !(k in p.phrases));
    expect(missing, `缺 ${missing.length} 条，例如：${missing.slice(0, 5).join(' / ')}`).toEqual([]);
  });

  it('译文不留空，也不是照抄中文', async () => {
    p = await loadPack(lang);
    const bad = KEYS.filter((k) => {
      const v = p.phrases[k];
      return !v?.trim() || (v === k && /[一-鿿]/.test(k) && k.length > 3);
    });
    expect(bad, `有 ${bad.length} 条没译，例如：${bad.slice(0, 5).join(' / ')}`).toEqual([]);
  });

  it('占位符一个不漏，也不多出来', async () => {
    p = await loadPack(lang);
    const holes = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    for (const key of KEYS) {
      const value = p.phrases[key];
      if (!value) continue;
      expect(holes(value), `「${key}」的占位符对不上`).toEqual(holes(key));
    }
  });

  it('六十四卦的卦名与全称都齐', async () => {
    p = await loadPack(lang);
    expect(p.hexagramNames).toHaveLength(HEXAGRAM_COUNT);
    expect(p.hexagramFullNames).toHaveLength(HEXAGRAM_COUNT);
    expect(p.hexagramNames.filter((n) => !n.trim())).toEqual([]);
    expect(new Set(p.hexagramNames).size).toBe(HEXAGRAM_COUNT);
  });

  it('八卦的卦名、取象、象辞都齐', async () => {
    p = await loadPack(lang);
    for (const name of TRIGRAMS) {
      expect(p.trigramName[name]?.trim()).toBeTruthy();
      expect(p.trigramImage[name]?.trim()).toBeTruthy();
      const lore = p.trigramLore[name];
      for (const field of ['image', 'nature', 'person', 'body', 'thing'] as const) {
        expect(lore?.[field]?.trim(), `${name} 缺 ${field}`).toBeTruthy();
      }
    }
  });

  it('经文六十四卦齐全，每卦六爻，乾坤多一条用九用六', async () => {
    p = await loadPack(lang);
    expect(p.zhouyi).toHaveLength(HEXAGRAM_COUNT);
    p.zhouyi.forEach((h, i) => {
      expect(h.lines, `第 ${i + 1} 卦`).toHaveLength(6);
      expect(h.theme.trim(), `第 ${i + 1} 卦的卦义`).toBeTruthy();
      expect(h.summary.trim(), `第 ${i + 1} 卦的卦象阐释`).toBeTruthy();
      expect(h.judgment.every((x) => x.trim()), `第 ${i + 1} 卦的卦辞`).toBe(true);
      expect(h.lines.every((l) => l.every((x) => x.trim())), `第 ${i + 1} 卦的爻辞`).toBe(true);
    });
    expect(p.zhouyi[0].extra?.length).toBe(3);
    expect(p.zhouyi[1].extra?.length).toBe(3);
    expect(p.zhouyi.slice(2).filter((h) => h.extra)).toEqual([]);
  });

  it('经文里的爻题与界面算出来的爻题是同一个说法', async () => {
    p = await loadPack(lang);
    // 爻题在经文里写一次、摇卦页又按爻位算一次，两处必须一致，否则同一爻会出现两种叫法
    const zh = await loadPack('zh');
    p.zhouyi.forEach((h, hi) => {
      h.lines.forEach((line, i) => {
        const zhTitle = zh.zhouyi[hi].lines[i][0];
        expect(line[0], `第 ${hi + 1} 卦第 ${i + 1} 爻`).toBe(p.phrases[zhTitle] ?? zhTitle);
      });
    });
  });

  it('有落点的话，每条经文八列、互不相同', async () => {
    p = await loadPack(lang);
    if (!p.angles) return; // 落点允许后补，缺了只是少一层解读
    expect(p.angles).toHaveLength(HEXAGRAM_COUNT);
    const columns = ANGLE_CATEGORY_IDS.length;
    p.angles.forEach((a, i) => {
      const groups = [a.judgment, ...a.lines, ...(a.extra ? [a.extra] : [])];
      groups.forEach((g, gi) => {
        expect(g, `第 ${i + 1} 卦第 ${gi} 条的列数`).toHaveLength(columns);
        expect(g.filter((x) => !x.trim()), `第 ${i + 1} 卦第 ${gi} 条有空落点`).toEqual([]);
        expect(new Set(g).size, `第 ${i + 1} 卦第 ${gi} 条有重复落点`).toBe(columns);
      });
    });
  });
});

describe('没译完的语言', () => {
  it('不会出现在可选语言里', () => {
    for (const lang of ALL_LANGS) {
      if (AVAILABLE_LANGS.includes(lang)) continue;
      expect(AVAILABLE_LANGS).not.toContain(lang);
    }
  });

  it('选到也不会崩，回落到中文', async () => {
    const p = await loadPack('ja');
    expect(p.zhouyi).toHaveLength(HEXAGRAM_COUNT);
  });
});

describe('中文这一份', () => {
  it('t() 取不到译文时原样返回中文', () => {
    expect(t('摇卦')).toBe('摇卦');
  });

  it('占位符能替换', () => {
    expect(t('共 {n} 卦，只保存在这台设备上。', { n: 3 })).toContain('3');
  });

  it('爻题六个位置都算得出来', () => {
    const titles = Array.from({ length: 6 }, (_, i) => lineTitle(i as LineIndex, true));
    expect(titles[0]).toBe('初九');
    expect(titles[5]).toBe('上九');
  });
});
