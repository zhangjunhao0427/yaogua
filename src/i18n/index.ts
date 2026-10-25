/**
 * 多语言。中文是源语言，界面文案直接以中文原文为键：
 * 译文缺了就显示中文，不会变成一串键名。
 *
 * 经文与落点按语言分包，除中文外都是动态加载，
 * 免得一上来就把五种语言的六万字全塞进首屏。
 */
import { pack as zhPack } from './packs/zh';
import type { Lang } from './lang';
import type { TextPack } from './types';

export type { Lang } from './lang';
export type { TextPack } from './types';
export { ALL_LANGS, AVAILABLE_LANGS, detectLang, isLang, LANG_LABEL, LANG_TAG } from './lang';

/** 译完一种加一条；没有加载器的语言不会出现在 AVAILABLE_LANGS 里 */
const LOADERS: Partial<Record<Lang, () => Promise<{ pack: TextPack }>>> = {};

const loaded = new Map<Lang, TextPack>([['zh', zhPack]]);

let active: TextPack = zhPack;

/** 当前语言的全部文字 */
export function pack(): TextPack {
  return active;
}

export function currentLang(): Lang {
  return active.lang;
}

/** 载入一种语言的文字包；没有这种语言就回落到中文 */
export async function loadPack(lang: Lang): Promise<TextPack> {
  const already = loaded.get(lang);
  if (already) return already;
  const loader = LOADERS[lang];
  if (!loader) return zhPack;
  try {
    const { pack: p } = await loader();
    loaded.set(lang, p);
    return p;
  } catch {
    // 分包加载失败（极少见，资源随安装包下发）时不要让界面空掉
    return zhPack;
  }
}

/** 换语言。界面的重新渲染由 LangProvider 负责 */
export async function activateLang(lang: Lang): Promise<Lang> {
  active = await loadPack(lang);
  return active.lang;
}

/**
 * 界面文案。键是中文原文，{名字} 形式的占位符按 params 替换。
 * 例：t('共 {n} 卦', { n: 3 })
 */
export function t(zh: string, params?: Readonly<Record<string, string | number>>): string {
  const s = active.phrases[zh] ?? zh;
  if (!params) return s;
  return s.replace(/\{(\w+)\}/g, (whole, key: string) => {
    const value = params[key];
    return value === undefined ? whole : String(value);
  });
}
