import { hexagramByNumber, TRIGRAM_IMAGE } from '../../core/hexagram';
import type { TrigramName } from '../../core/types';
import { HEXAGRAM_NAMES } from '../../data/hexagrams';
import { TRIGRAM_LORE } from '../../data/meihua';
import { ZH_ANGLES } from '../../data/zhouyi/angles';
import { ZH_ZHOUYI } from '../../data/zhouyi/scripture';
import type { TextPack, TrigramLoreText } from '../types';

/** 上下同卦为「乾为天」，否则「上象下象卦名」，如地天泰 */
function fullName(n: number): string {
  const { upper, lower } = hexagramByNumber(n);
  const name = HEXAGRAM_NAMES[n - 1];
  return upper === lower ? `${name}为${TRIGRAM_IMAGE[upper]}` : `${TRIGRAM_IMAGE[upper]}${TRIGRAM_IMAGE[lower]}${name}`;
}

const lore = Object.fromEntries(
  Object.entries(TRIGRAM_LORE).map(([name, l]) => [
    name,
    { image: l.image, nature: l.nature, person: l.person, body: l.body, thing: l.thing } satisfies TrigramLoreText,
  ]),
) as Record<TrigramName, TrigramLoreText>;

const trigramName = Object.fromEntries(Object.keys(TRIGRAM_LORE).map((n) => [n, n])) as Record<TrigramName, string>;

/** 中文是源语言：phrases 为空，取不到就用键本身，键本身就是中文 */
export const pack: TextPack = {
  lang: 'zh',
  phrases: {},
  trigramName,
  trigramImage: TRIGRAM_IMAGE,
  trigramLore: lore,
  hexagramNames: HEXAGRAM_NAMES,
  hexagramFullNames: HEXAGRAM_NAMES.map((_, i) => fullName(i + 1)),
  zhouyi: ZH_ZHOUYI,
  angles: ZH_ANGLES,
};
