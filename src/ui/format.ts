import { currentLang } from '../i18n';
import { LANG_TAG } from '../i18n/lang';

/** 日期按当前语言的习惯写 */
export function formatDate(ms: number): string {
  return new Intl.DateTimeFormat(LANG_TAG[currentLang()], { dateStyle: 'long' }).format(ms);
}

export function formatDateTime(ms: number): string {
  return new Intl.DateTimeFormat(LANG_TAG[currentLang()], { dateStyle: 'long', timeStyle: 'short' }).format(ms);
}
