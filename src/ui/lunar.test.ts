import { describe, expect, it } from 'vitest';
import { lunarOf } from './lunar';

/** 用东八区的时刻构造，避免跑测试的机器时区影响结果 */
const at = (iso: string) => new Date(`${iso}+08:00`);

describe('农历换算', () => {
  it.each([
    ['2026-02-17T12:00:00', 1, 1, '丙午年正月初一'],
    ['2025-01-29T12:00:00', 1, 1, '乙巳年正月初一'],
    ['2026-10-24T12:00:00', 9, 15, '丙午年九月十五'],
  ])('%s 为 %i 月 %i 日', (iso, month, day, label) => {
    const lunar = lunarOf(at(iso));
    expect(lunar.month).toBe(month);
    expect(lunar.day).toBe(day);
    expect(lunar.label.startsWith(label)).toBe(true);
  });

  it('闰月按本月数计算，并在显示上标明', () => {
    const lunar = lunarOf(at('2025-07-25T12:00:00'));
    expect(lunar.leapMonth).toBe(true);
    expect(lunar.month).toBe(6);
    expect(lunar.day).toBe(1);
    expect(lunar.label).toContain('闰六月');
  });

  it('年支取自干支：甲子年支为子，丙午年支为午', () => {
    expect(lunarOf(at('1984-06-01T12:00:00')).label.startsWith('甲子年')).toBe(true);
    expect(lunarOf(at('1984-06-01T12:00:00')).yearBranch).toBe(1);
    expect(lunarOf(at('2026-06-01T12:00:00')).yearBranch).toBe(7);
  });

  it('时辰随钟点走：午时、子时', () => {
    expect(lunarOf(at('2026-10-24T12:30:00')).hourBranch).toBe(7);
    expect(lunarOf(at('2026-10-24T12:30:00')).label.endsWith('午时')).toBe(true);
    expect(lunarOf(at('2026-10-24T23:30:00')).hourBranch).toBe(1);
  });
});
