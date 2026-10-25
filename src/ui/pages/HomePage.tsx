import { Link } from 'react-router-dom';
import { t } from '../../i18n';
import { entryDue, entryHref, listEntries } from '../../store/entries';
import { recordStore } from '../../store/records';
import { HexagramFigure } from '../components/HexagramFigure';
import { LanguagePicker } from '../components/LanguagePicker';
import { RecordItem } from '../components/RecordItem';
import { Screen } from '../components/Screen';
import { useLoad } from '../hooks';

/** 首页装饰：既济 */
const HERO = [true, false, true, false, true, false];

export function HomePage() {
  const draft = useLoad(() => recordStore.loadDraft(), []);
  const entries = useLoad(() => listEntries(), []);
  const due = entries?.filter((entry) => entryDue(entry)) ?? [];

  return (
    <Screen className="home">
      <div className="hero">
        <HexagramFigure yang={HERO} marks={false} />
        <h1 className="hero__title serif">{t('摇卦')}</h1>
        <p className="hero__sub">
          {t('三枚铜钱，六次掷出。')}
          <br />
          {t('卦不可重。')}
        </p>
      </div>

      {draft !== undefined &&
        (draft ? (
          <div className="stack">
            <Link className="btn btn--primary btn--block" to="/cast">
              {t('继续摇卦 · 已得 {n} 爻', { n: draft.lines.length })}
            </Link>
            <p className="small muted center">{t('「{q}」', { q: draft.question })}</p>
          </div>
        ) : (
          <div className="stack">
            <Link className="btn btn--primary btn--block" to="/ask">
              {t('摇铜钱起卦')}
            </Link>
            <Link className="btn btn--block" to="/meihua">
              {t('梅花易数')}
            </Link>
            <p className="small muted center">{t('铜钱法六爻可变，梅花按时间或数起卦、只动一爻。')}</p>
          </div>
        ))}

      {due.length > 0 && (
        <Link className="card notice" to={entryHref(due[0])}>
          <span>{t('{n} 卦已满七日，回来看看应验了没有', { n: due.length })}</span>
          <span aria-hidden="true">›</span>
        </Link>
      )}

      {entries && entries.length > 0 && (
        <section>
          <h2 className="section-title">{t('最近卦记')}</h2>
          <ul className="records">
            {entries.slice(0, 3).map((entry) => (
              <RecordItem key={`${entry.kind}-${entry.id}`} entry={entry} />
            ))}
          </ul>
        </section>
      )}

      <nav className="home__nav">
        <Link to="/records">{t('全部卦记')}</Link>
        <Link to="/about">{t('起卦说明')}</Link>
      </nav>

      <LanguagePicker />
    </Screen>
  );
}
