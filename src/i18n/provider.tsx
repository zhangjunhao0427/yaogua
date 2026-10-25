import { createContext, use, useEffect, useState, type ReactNode } from 'react';
import { settingsStore } from '../store/settings';
import { activateLang, currentLang } from './index';
import { detectLang, LANG_TAG, type Lang } from './lang';

interface LangContextValue {
  readonly lang: Lang;
  readonly change: (lang: Lang) => Promise<void>;
}

const LangContext = createContext<LangContextValue>({ lang: 'zh', change: async () => {} });

export function useLang(): LangContextValue {
  return use(LangContext);
}

function browserLangs(): readonly string[] {
  if (typeof navigator === 'undefined') return [];
  return navigator.languages?.length ? navigator.languages : [navigator.language];
}

/**
 * 语言由这里统一切换：换语言会把整棵树重渲染一遍，
 * 所以组件里直接调 t() 就行，不必每处都订阅。
 */
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(currentLang());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const saved = await settingsStore.readLang();
      const wanted = saved ?? detectLang(browserLangs());
      const got = await activateLang(wanted);
      if (!alive) return;
      setLang(got);
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = LANG_TAG[lang];
  }, [lang]);

  async function change(next: Lang) {
    const got = await activateLang(next);
    await settingsStore.writeLang(got);
    setLang(got);
  }

  // 读偏好只是一次本地读取，很快；期间先不渲染，免得中文闪一下再跳成外文
  if (!ready) return null;

  return <LangContext value={{ lang, change }}>{children}</LangContext>;
}
