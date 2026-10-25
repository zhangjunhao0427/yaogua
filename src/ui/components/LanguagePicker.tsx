import { AVAILABLE_LANGS, LANG_LABEL } from '../../i18n';
import { useLang } from '../../i18n/provider';
import { cls } from '../cls';

/**
 * 语言只有一种时什么都不显示。
 * 每种语言都用它自己的说法写（English、日本語…），
 * 看不懂当前界面语言的人也能认出自己那一个。
 */
export function LanguagePicker() {
  const { lang, change } = useLang();
  if (AVAILABLE_LANGS.length < 2) return null;

  return (
    <div className="langs" role="group" aria-label="Language">
      {AVAILABLE_LANGS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          className={cls('langs__item', l === lang && 'is-active')}
          aria-pressed={l === lang}
          onClick={() => void change(l)}
        >
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}
