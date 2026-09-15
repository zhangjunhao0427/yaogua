import { LINE_INDICES } from './hexagram';
import type { Cast, ChangingCount, Hexagram, LineIndex, Reading, TextRef, Verdict } from './types';

const judgment = (h: Hexagram): TextRef => ({ kind: 'judgment', hexagram: h.number });
const line = (h: Hexagram, i: LineIndex): TextRef => ({ kind: 'line', hexagram: h.number, line: i });
const main = (ref: TextRef): Reading => ({ ref, main: true });
const aside = (ref: TextRef): Reading => ({ ref, main: false });

/**
 * 变占七则（朱熹《易学启蒙》）：依变爻个数判定应读哪几段经文。
 * 注意 k=4、k=5 读的是之卦的「不变爻」。
 */
export function judge({ base, changed, changing }: Cast): Verdict {
  const count = changing.length as ChangingCount;
  if (count === 0) {
    return { count, rule: '六爻皆不变，占本卦卦辞。', readings: [main(judgment(base))] };
  }
  if (!changed) throw new Error('有变爻而无之卦');

  // changing 与 unchanged 均由下至上排列
  const unchanged = LINE_INDICES.filter((i) => !changing.includes(i));

  switch (count) {
    case 1:
      return {
        count,
        rule: '一爻变，占本卦变爻爻辞。',
        readings: [main(line(base, changing[0]))],
      };
    case 2:
      return {
        count,
        rule: '二爻变，占本卦两变爻爻辞，以上爻为主。',
        readings: [main(line(base, changing[1])), aside(line(base, changing[0]))],
      };
    case 3:
      return {
        count,
        rule: '三爻变，占本卦与之卦卦辞，以本卦为主。',
        readings: [main(judgment(base)), aside(judgment(changed))],
      };
    case 4:
      return {
        count,
        rule: '四爻变，占之卦两不变爻爻辞，以下爻为主。',
        readings: [main(line(changed, unchanged[0])), aside(line(changed, unchanged[1]))],
      };
    case 5:
      return {
        count,
        rule: '五爻变，占之卦不变爻爻辞。',
        readings: [main(line(changed, unchanged[0]))],
      };
    case 6:
      if (base.number === 1) {
        return { count, rule: '六爻皆变，乾卦占用九。', readings: [main({ kind: 'useNine' })] };
      }
      if (base.number === 2) {
        return { count, rule: '六爻皆变，坤卦占用六。', readings: [main({ kind: 'useSix' })] };
      }
      return { count, rule: '六爻皆变，占之卦卦辞。', readings: [main(judgment(changed))] };
  }
}
