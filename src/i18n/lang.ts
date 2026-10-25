/** 应用支持的语言。zh 是源语言，其余都从中文译出。 */
export type Lang = 'zh' | 'en' | 'ja' | 'ko' | 'vi';

export const ALL_LANGS: readonly Lang[] = ['zh', 'en', 'ja', 'ko', 'vi'];

/** 各语言用自己的说法写自己的名字 */
export const LANG_LABEL: Record<Lang, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  vi: 'Tiếng Việt',
};

/** HTML lang 属性用的标记 */
export const LANG_TAG: Record<Lang, string> = {
  zh: 'zh-Hans',
  en: 'en',
  ja: 'ja',
  ko: 'ko',
  vi: 'vi',
};

/**
 * 已经译完、可以在界面上挑的语言。
 * 一种语言只有在经文与落点都译全（见 i18n 的完整性测试）之后才加进来，
 * 不能让用户选到一个中英混杂的版本。
 */
export const AVAILABLE_LANGS: readonly Lang[] = ['zh'];

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (ALL_LANGS as readonly string[]).includes(value);
}

/** 按系统语言猜一个；猜不到就用中文 */
export function detectLang(preferred: readonly string[]): Lang {
  for (const raw of preferred) {
    const tag = raw.toLowerCase();
    const guess: Lang | null = tag.startsWith('zh')
      ? 'zh'
      : tag.startsWith('en')
        ? 'en'
        : tag.startsWith('ja')
          ? 'ja'
          : tag.startsWith('ko')
            ? 'ko'
            : tag.startsWith('vi')
              ? 'vi'
              : null;
    if (guess && AVAILABLE_LANGS.includes(guess)) return guess;
  }
  return 'zh';
}
