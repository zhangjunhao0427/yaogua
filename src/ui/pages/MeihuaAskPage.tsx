import { useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../../i18n';
import { castFromMoment } from '../../core/meihua';
import { CATEGORIES, categoryInfo, isClosedQuestion, type Category, type CategoryInfo } from '../../data/guide';
import { meihuaStore, type MeihuaSource } from '../../store/meihua';
import { cls } from '../cls';
import { Screen } from '../components/Screen';
import { lunarOf } from '../lunar';

const MAX_LENGTH = 200;
type Field = 'category' | 'question' | 'numbers';

export function MeihuaAskPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [source, setSource] = useState<MeihuaSource>('time');
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [error, setError] = useState<{ field: Field; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function pick(info: CategoryInfo) {
    setCategory(info.id);
    setError(null);
    inputRef.current?.focus();
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!category) {
      setError({ field: 'category', message: t('先选一个方向，解读会按它来写') });
      return;
    }
    const q = question.trim();
    if (!q) {
      setError({ field: 'question', message: t('先写下你想问的事') });
      inputRef.current?.focus();
      return;
    }

    let numbers: [number, number, number];
    let lunar: string | undefined;
    if (source === 'time') {
      const moment = lunarOf(new Date());
      const cast = castFromMoment(moment);
      numbers = [moment.yearBranch + moment.month + moment.day, 0, 0];
      // 三个数都由年月日时推出，存下来便于复算
      const upperSum = moment.yearBranch + moment.month + moment.day;
      const lowerSum = upperSum + moment.hourBranch;
      numbers = [upperSum, lowerSum, lowerSum];
      lunar = moment.label;
      void cast;
    } else {
      const a = Number(first);
      const b = Number(second);
      if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < 1 || a > 99999 || b > 99999) {
        setError({ field: 'numbers', message: t('两个数都要填，取 1 到 99999 之间的整数') });
        return;
      }
      numbers = [a, b, a + b];
    }

    setSubmitting(true);
    const record = await meihuaStore.add({ question: q, category, source, numbers, lunar });
    navigate(`/m/${record.id}?fresh=1`, { replace: true });
  }

  const closed = !error && isClosedQuestion(question);
  const preview = source === 'time' ? lunarOf(new Date()).label : null;

  return (
    <Screen title={t('梅花易数')} back="/">
      <div className="stack stack--lg">
        <h2 className="ask__title serif">{t('你想问什么？')}</h2>
        <p className="muted">{t('梅花易数不摇铜钱，按时间或你心里想到的数起卦，只有一个动爻，断的是体用生克。')}</p>
      </div>

      <div className="stack">
        <p className="field-label">
          {t('这件事属于哪一类？')}
          <span className="muted">{t('必选，解读会按它来写')}</span>
        </p>
        <div className="chips" role="radiogroup" aria-label={t('问题分类')}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              className={cls('chip', category === c.id && 'is-active')}
              aria-checked={category === c.id}
              onClick={() => pick(c)}
            >
              {t(c.label)}
            </button>
          ))}
        </div>
        {error?.field === 'category' && (
          <p className="error small" role="alert">
            {error.message}
          </p>
        )}
      </div>

      <form className="stack" onSubmit={submit} noValidate>
        <label htmlFor="question" className="visually-hidden">
          {t('问题')}
        </label>
        <textarea
          id="question"
          ref={inputRef}
          className={cls('field', error?.field === 'question' && 'field--error')}
          rows={3}
          maxLength={MAX_LENGTH}
          value={question}
          placeholder={t(category ? categoryInfo(category).hint : '例如：这件事我该如何决定？')}
          aria-invalid={error?.field === 'question'}
          onChange={(e) => {
            setQuestion(e.target.value);
            if (error) setError(null);
          }}
        />
        <p className="field-hint">
          {error?.field === 'question' ? (
            <span className="error" role="alert">
              {error.message}
            </span>
          ) : closed ? (
            t('这像一道是非题。试着改成「我该如何……」，读卦时会更有收获。')
          ) : (
            <span className="muted">
              {[...question].length}/{MAX_LENGTH}
            </span>
          )}
        </p>

        <p className="field-label">{t('怎么起卦？')}</p>
        <div className="chips" role="radiogroup" aria-label={t('起卦方式')}>
          <button
            type="button"
            role="radio"
            className={cls('chip', source === 'time' && 'is-active')}
            aria-checked={source === 'time'}
            onClick={() => setSource('time')}
          >
            {t('按此刻的时间')}
          </button>
          <button
            type="button"
            role="radio"
            className={cls('chip', source === 'number' && 'is-active')}
            aria-checked={source === 'number'}
            onClick={() => setSource('number')}
          >
            {t('我报两个数')}
          </button>
        </div>

        {source === 'time' ? (
          <p className="small muted">
            {t('此刻是')} <strong>{preview}</strong>
            {t('。年月日定上卦，加上时辰定下卦与动爻。')}
            <br />
            {t('同一个时辰之内起卦，得到的是同一卦——时间起卦本来就没有随机。')}
          </p>
        ) : (
          <div className="stack">
            <div className="number-row">
              <input
                className={cls('field', error?.field === 'numbers' && 'field--error')}
                type="number"
                inputMode="numeric"
                min={1}
                max={99999}
                value={first}
                placeholder={t('第一个数')}
                aria-label={t('第一个数，定上卦')}
                onChange={(e) => {
                  setFirst(e.target.value);
                  if (error) setError(null);
                }}
              />
              <input
                className={cls('field', error?.field === 'numbers' && 'field--error')}
                type="number"
                inputMode="numeric"
                min={1}
                max={99999}
                value={second}
                placeholder={t('第二个数')}
                aria-label={t('第二个数，定下卦')}
                onChange={(e) => {
                  setSecond(e.target.value);
                  if (error) setError(null);
                }}
              />
            </div>
            <p className="small muted">
              {error?.field === 'numbers' ? (
                <span className="error" role="alert">
                  {error.message}
                </span>
              ) : (
                t('第一个数除以八定上卦，第二个数除以八定下卦，两数之和除以六定动爻。心里先想好再填。')
              )}
            </p>
          </div>
        )}

        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          {t('起卦')}
        </button>
        <p className="small muted center">{t('解读按你选的方向来写。这句话只存给你自己看。')}</p>
      </form>
    </Screen>
  );
}
