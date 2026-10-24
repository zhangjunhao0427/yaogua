import { Link } from 'react-router-dom';
import { entryDue, entryHref, listEntries } from '../../store/entries';
import { recordStore } from '../../store/records';
import { HexagramFigure } from '../components/HexagramFigure';
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
        <h1 className="hero__title serif">摇卦</h1>
        <p className="hero__sub">
          三枚铜钱，六次掷出。
          <br />
          卦不可重。
        </p>
      </div>

      {draft !== undefined &&
        (draft ? (
          <div className="stack">
            <Link className="btn btn--primary btn--block" to="/cast">
              继续摇卦 · 已得 {draft.lines.length} 爻
            </Link>
            <p className="small muted center">「{draft.question}」</p>
          </div>
        ) : (
          <div className="stack">
            <Link className="btn btn--primary btn--block" to="/ask">
              摇铜钱起卦
            </Link>
            <Link className="btn btn--block" to="/meihua">
              梅花易数
            </Link>
            <p className="small muted center">铜钱法六爻可变，梅花按时间或数起卦、只动一爻。</p>
          </div>
        ))}

      {due.length > 0 && (
        <Link className="card notice" to={entryHref(due[0])}>
          <span>{due.length} 卦已满七日，回来看看应验了没有</span>
          <span aria-hidden="true">›</span>
        </Link>
      )}

      {entries && entries.length > 0 && (
        <section>
          <h2 className="section-title">最近卦记</h2>
          <ul className="records">
            {entries.slice(0, 3).map((entry) => (
              <RecordItem key={`${entry.kind}-${entry.id}`} entry={entry} />
            ))}
          </ul>
        </section>
      )}

      <nav className="home__nav">
        <Link to="/records">全部卦记</Link>
        <Link to="/about">起卦说明</Link>
      </nav>
    </Screen>
  );
}
