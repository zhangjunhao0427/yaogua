/** 偏好设置。目前只有语言一项，同样只经存储适配层。 */
import { isLang, type Lang } from '../i18n/lang';
import { storage as platformStorage, type KeyValueStorage } from '../platform/storage';

const LANG_KEY = 'lang.v1';

export function createSettingsStore(storage: KeyValueStorage) {
  return {
    /** 用户选过的语言；没选过返回 null，由调用方按系统语言猜 */
    async readLang(): Promise<Lang | null> {
      const saved = await storage.get<unknown>(LANG_KEY);
      return isLang(saved) ? saved : null;
    },
    async writeLang(lang: Lang): Promise<boolean> {
      return storage.set(LANG_KEY, lang);
    },
  };
}

export const settingsStore = createSettingsStore(platformStorage);
