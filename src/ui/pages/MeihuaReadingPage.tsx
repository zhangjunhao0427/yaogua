import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { lineTitle } from '../../core/hexagram';
import { ELEMENT_OF, NUMBER_BY_TRIGRAM, type MeihuaCast } from '../../core/meihua';
import type { Hexagram } from '../../core/types';
import { categoryInfo } from '../../data/guide';
import { hexagramFullName, hexagramName } from '../../data/hexagrams';
import { RELATION_LORE, STAGE_LORE, TRIGRAM_LORE } from '../../data/meihua';
import { hexagramText, resolveText } from '../../data/zhouyi';
import {
  castOfRecord,
  isReviewDue,
  meihuaStore,
  reviewDueAt,
  type MeihuaRecord,
} from '../../store/meihua';
import { OUTCOME_LABEL, type Outcome } from '../../store/records';
import { cls } from '../cls';
import { HexagramFigure } from '../components/HexagramFigure';
import { Screen } from '../components/Screen';
import { formatDate, formatDateTime } from '../format';

const OUTCOMES: readonly Outcome[] = ['fulfilled', 'partial', 'unfulfilled'];

export function MeihuaReadingPage() {
  const { id = '' } = useParams();
  const [params] = useSearchParams();
  const [record, setRecord] = useState<MeihuaRecord | null>();

  useEffect(() => {
    let alive = true;
    void meihuaStore.get(id).then((found) => {
      if (alive) setRecord(found);
    });
    return () => {
      alive = false;
    };
  }, [id]);

  if (record === undefined) return <Screen title="梅花易数" back="/records" />;
  if (record === null) {
    return (
      <Screen title="梅花易数" back="/">
        <div className="empty">
          <p className="muted">找不到这一卦。</p>
          <Link className="btn" to="/">
            回首页
          </Link>
        </div>
      </Screen>
    );
  }
  void params;
  return <Reading record={record} onChange={setRecord} />;
}

function Reading({ record, onChange }: { record: MeihuaRecord; onChange: (record: MeihuaRecord) => void }) {
  const cast = useMemo(() => castOfRecord(record), [record]);
  const relation = RELATION_LORE[cast.relation];
  const category = record.category ? categoryInfo(record.category) : null;
  const movingTitle = lineTitle(cast.moving, cast.origin.yang[cast.moving]);
  const text = resolveText({ kind: 'line', hexagram: cast.origin.number, line: cast.moving }, record.category);

  return (
    <Screen title="梅花易数" back="/records" className="reading">
      <section className="card">
        <p className="eyebrow">
          {formatDateTime(record.createdAt)}
          {category && ` · ${category.label}`}
          {record.source === 'time' ? ' · 时间起卦' : ' · 数字起卦'}
        </p>
        <p className="question__text serif">「{record.question}」</p>
        <p className="small muted">
          {record.source === 'time' && record.lunar ? (
            <>
              {record.lunar}
              <br />
            </>
          ) : (
            <>
              取数 {record.numbers[0]} 与 {record.numbers[1]}
              <br />
            </>
          )}
          {`上卦 ${NUMBER_BY_TRIGRAM[cast.upper]} ${cast.upper}、下卦 ${NUMBER_BY_TRIGRAM[cast.lower]} ${cast.lower}，动爻 ${movingTitle}`}
        </p>
      </section>

      {/* 体用是梅花的断语所在，放在最前 */}
      <section className={cls('card verdict-card', `verdict-card--${relation.verdict}`)}>
        <p className="eyebrow">体用生克</p>
        <p className="verdict-card__line serif">
          体 {cast.body}（{ELEMENT_OF[cast.body]}）· 用 {cast.use}（{ELEMENT_OF[cast.use]}）
        </p>
        <p className="verdict-card__head serif">
          {relation.label}
          <span className="verdict-card__tag">{relation.verdict}</span>
        </p>
        <p className="brief__text">{relation.meaning}</p>
        <p className="small muted">
          动爻在{cast.movingIn === 'upper' ? '上' : '下'}卦，所以{cast.use}为用、{cast.body}为体。
          体是你自己，用是所问的那件事。
        </p>
      </section>

      <section className="layer">
        <h2 className="layer__title">
          <span className="layer__no serif">一</span>三卦
        </h2>
        <div className="stages">
          <Stage hexagram={cast.origin} stage={0} moving={cast.moving} />
          <Stage hexagram={cast.mutual} stage={1} />
          <Stage hexagram={cast.changed} stage={2} />
        </div>
      </section>

      <section className="layer">
        <h2 className="layer__title">
          <span className="layer__no serif">二</span>两卦之象
        </h2>
        <div className="stack">
          <TrigramCard name={cast.body} role="体：你自己" />
          <TrigramCard name={cast.use} role="用：所问之事" />
        </div>
      </section>

      <section className="layer">
        <h2 className="layer__title">
          <span className="layer__no serif">三</span>动爻爻辞
        </h2>
        <article className="card passage passage--main">
          <header className="passage__head">
            <span>
              {hexagramName(cast.origin.number)} · {text.title}
            </span>
            <span className="badge badge--accent">动爻</span>
          </header>
          <p className="passage__original serif">{text.original}</p>
          <p className="passage__plain">{text.plain}</p>
          {text.angle && (
            <p className="passage__angle">
              <span className="passage__angle-label">{category?.label}</span>
              {text.angle}
            </p>
          )}
        </article>
        <p className="small muted">梅花以体用为主、爻辞为辅。两者不一致时，先看体用。</p>
      </section>

      <ReviewSection record={record} onChange={onChange} />
      <div className="actions">
        <Link className="btn btn--text" to="/">
          回首页
        </Link>
      </div>
    </Screen>
  );
}

function Stage({ hexagram, stage, moving }: { hexagram: Hexagram; stage: 0 | 1 | 2; moving?: number }) {
  const lore = STAGE_LORE[stage];
  return (
    <section className="card stage-card">
      <p className="eyebrow">
        {lore.label} · {lore.role}
      </p>
      <div className="stage-card__body">
        <HexagramFigure
          yang={hexagram.yang}
          changing={moving === undefined ? [] : [moving]}
          size="sm"
          marks={false}
        />
        <div>
          <p className="brief__name serif">
            {hexagramFullName(hexagram.number)}
            <span className="brief__theme">{hexagramText(hexagram.number).theme}</span>
          </p>
          <p className="small muted">{hexagramText(hexagram.number).summary}</p>
        </div>
      </div>
    </section>
  );
}

function TrigramCard({ name, role }: { name: ReturnType<typeof String> & keyof typeof TRIGRAM_LORE; role: string }) {
  const lore = TRIGRAM_LORE[name];
  return (
    <section className="card">
      <p className="eyebrow">{role}</p>
      <p className="brief__name serif">
        {lore.name}为{lore.image}
        <span className="brief__theme">
          {lore.element} · {lore.nature}
        </span>
      </p>
      <dl className="terms">
        <dt>人</dt>
        <dd>{lore.person}</dd>
        <dt>身</dt>
        <dd>{lore.body}</dd>
        <dt>物</dt>
        <dd>{lore.thing}</dd>
      </dl>
    </section>
  );
}

function ReviewSection({ record, onChange }: { record: MeihuaRecord; onChange: (record: MeihuaRecord) => void }) {
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  if (record.review) {
    return (
      <section className="card review">
        <p className="eyebrow">回访 · {formatDate(record.review.at)}</p>
        <p className="review__outcome serif">{OUTCOME_LABEL[record.review.outcome]}</p>
        {record.review.note && <p className="muted">{record.review.note}</p>}
      </section>
    );
  }

  if (!isReviewDue(record)) {
    return (
      <section className="card review">
        <p className="eyebrow">回访</p>
        <p className="muted">{formatDate(reviewDueAt(record))}起回来记下：这一卦应验了吗？</p>
      </section>
    );
  }

  async function save() {
    if (!outcome) return;
    setSaving(true);
    const updated = await meihuaStore.saveReview(record.id, outcome, note);
    setSaving(false);
    if (updated) onChange(updated);
  }

  return (
    <section className="card review">
      <p className="eyebrow">七日已过</p>
      <p>这一卦，应验了吗？</p>
      <div className="chips" role="group" aria-label="应验情况">
        {OUTCOMES.map((o) => (
          <button
            key={o}
            type="button"
            className={cls('chip', outcome === o && 'is-active')}
            aria-pressed={outcome === o}
            onClick={() => setOutcome(o)}
          >
            {OUTCOME_LABEL[o]}
          </button>
        ))}
      </div>
      <textarea
        className="field"
        rows={3}
        maxLength={500}
        value={note}
        placeholder="后来发生了什么？（可不填）"
        aria-label="回访记录"
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        type="button"
        className="btn btn--primary btn--block"
        disabled={!outcome || saving}
        onClick={() => void save()}
      >
        记下
      </button>
    </section>
  );
}

export type { MeihuaCast };
