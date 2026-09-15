/**
 * 持久化适配层，业务代码只经由此处读写。
 * 接口为异步，与 Capacitor Preferences 对齐；Web 实现走 localStorage。
 */

export interface KeyValueStorage {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<boolean>;
  remove(key: string): Promise<void>;
}

const PREFIX = 'yaogua:';

export const webStorage: KeyValueStorage = {
  async get<T>(key: string) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? null : (JSON.parse(raw) as T);
    } catch {
      return null;
    }
  },
  async set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  async remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      // 隐私模式或存储被禁用时忽略
    }
  },
};

export const storage: KeyValueStorage = webStorage;
