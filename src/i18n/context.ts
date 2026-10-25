import { createContext, use } from 'react';
import type { Lang } from './lang';

export interface LangContextValue {
  readonly lang: Lang;
  readonly change: (lang: Lang) => Promise<void>;
}

export const LangContext = createContext<LangContextValue>({ lang: 'zh', change: async () => {} });

export function useLang(): LangContextValue {
  return use(LangContext);
}
