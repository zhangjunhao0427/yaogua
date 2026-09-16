import { Link } from 'react-router-dom';
import { isReviewDue, recordStore } from '../../store/records';
import { HexagramFigure } from '../components/HexagramFigure';
import { RecordItem } from '../components/RecordItem';
import { Screen } from '../components/Screen';
import { useLoad } from '../hooks';

/** 首页装饰：既济 */
const HERO = [true, false, true, false, true, false];

export function HomePage() {
  const draft = useLoad(() => recordStore.loadDraft(), []);
  const records = useLoad(() => recordStore.listRecords(), []);
  const due = records?.filter((r) => isReviewDue(r)) ?? [];

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
          <Link className="btn btn--primary btn--block" to="/ask">
            起一卦
          </Link>
        ))}

      {due.length > 0 && (
        <Link className="card notice" to={`/r/${due[0].id}`}>
          <span>{due.length} 卦已满七日，回来看看应验了没有</span>
          <span aria-hidden="true">›</span>
        </Link>
      )}

      {records && records.length > 0 && (
        <section>
          <h2 className="section-title">最近卦记</h2>
          <ul className="records">
            {records.slice(0, 3).map((r) => (
              <RecordItem key={r.id} record={r} />
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
