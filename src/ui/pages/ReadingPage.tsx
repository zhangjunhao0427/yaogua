import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { aspectsOf, lineTitle } from '../../core/hexagram';
import { judge } from '../../core/rules';
import type { Cast, Hexagram } from '../../core/types';
import { CATEGORIES, glossaryFor, perspective, reflectionPrompts, type PerspectiveKey } from '../../data/guide';
import { hexagramFullName, hexagramName } from '../../data/hexagrams';
import { hexagramText, resolveText, type ResolvedText } from '../../data/zhouyi';
import { sharer } from '../../platform/share';
import {
  castOf,
  isReviewDue,
  OUTCOME_LABEL,
  recordStore,
  reviewDueAt,
  type CastRecord,
  type Outcome,
} from '../../store/records';
import { cls } from '../cls';
import { HexagramFigure } from '../components/HexagramFigure';
import { Screen } from '../components/Screen';
import { formatDate, formatDateTime } from '../format';
import { useReducedMotion } from '../hooks';
import { renderShareCard } from '../shareCard';

const LAYERS = ['卦象', '变占', '经文', '反思'] as const;
const NUMERALS = '一二三四';
const OUTCOMES: readonly Outcome[] = ['fulfilled', 'partial', 'unfulfilled'];

export function ReadingPage() {
  const { id = '' } = useParams();
  const [params] = useSearchParams();
  const [record, setRecord] = useState<CastRecord | null>();

  useEffect(() => {
    let alive = true;
    void recordStore.getRecord(id).then((found) => {
      if (alive) setRecord(found);
    });
    return () => {
      alive = false;
    };
  }, [id]);

  if (record === undefined) return <Screen title="解读" back="/records" />;
  if (record === null) {
    return (
      <Screen title="解读" back="/">
        <div className="empty">
          <p className="muted">找不到这一卦。</p>
          <Link className="btn" to="/">
            回首页
          </Link>
        </div>
      </Screen>
    );
  }
  return <Reading record={record} fresh={params.get('fresh') === '1'} onChange={setRecord} />;
}

function Reading({
  record,
  fresh,
  onChange,
}: {
  record: CastRecord;
  fresh: boolean;
  onChange: (record: CastRecord) => void;
}) {
  const reduced = useReducedMotion();
  const cast = useMemo(() => castOf(record), [record]);
  const verdict = useMemo(() => judge(cast), [cast]);
  const texts = useMemo(
    () => verdict.readings.map(({ ref, main }) => ({ ...resolveText(ref, record.category), main })),
    [verdict, record.category],
  );
  const [depth, setDepth] = useState(fresh ? 1 : LAYERS.length);
  const newest = useRef<HTMLElement>(null);

  useEffect(() => {
    if (depth > 1) newest.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, [depth, reduced]);

  const main = texts.find((t) => t.main) ?? texts[0];
  const category = CATEGORIES.find((c) => c.id === record.category);
  const refFor = (n: number) => (n === depth ? newest : undefined);

  return (
    <Screen title="解读" back="/records" className="reading">
      <section className="card">
        <p className="eyebrow">
          {formatDateTime(record.createdAt)}
          {category && ` · ${category.label}`}
        </p>
        <p className="question__text serif">「{record.question}」</p>
      </section>

      <Layer n={1} sectionRef={refFor(1)}>
        <div className="figures">
          <Figure perspectiveKey="base" hexagram={cast.base} changing={cast.changing} />
          {cast.changed && (
            <>
              <span className="figures__arrow" aria-hidden="true">
                之
              </span>
              <Figure perspectiveKey="changed" hexagram={cast.changed} changing={[]} />
            </>
          )}
        </div>
        <p className="small muted center">
          {cast.changing.length > 0
            ? `变爻：${cast.changing.map((i) => lineTitle(i, cast.base.yang[i])).join('、')}　○ 老阳　× 老阴`
            : '六爻皆不变，没有之卦'}
        </p>
        <Aspects base={cast.base} />
      </Layer>

      {depth >= 2 && (
        <Layer n={2} sectionRef={refFor(2)}>
          <p className="verdict serif">{verdict.rule}</p>
          <p className="small muted">依朱熹《易学启蒙》变占之法，按变爻个数决定读哪几句。</p>
        </Layer>
      )}

      {depth >= 3 && (
        <Layer n={3} sectionRef={refFor(3)}>
          {texts.map((text) => (
            <article
              key={`${text.hexagram}-${text.title}`}
              className={cls('card passage', text.main && texts.length > 1 && 'passage--main')}
            >
              <header className="passage__head">
                <span>
                  {hexagramName(text.hexagram)} · {text.title}
                </span>
                {text.main && texts.length > 1 && <span className="badge badge--accent">为主</span>}
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
          ))}
          <Glossary texts={texts} />
        </Layer>
      )}

      {depth >= 4 && (
        <Layer n={4} sectionRef={refFor(4)}>
          <ol className="prompts">
            {reflectionPrompts(record.category, {
              base: hexagramName(cast.base.number),
              changed: cast.changed ? hexagramName(cast.changed.number) : null,
            }).map((prompt) => (
              <li key={prompt}>{prompt}</li>
            ))}
          </ol>
          <p className="small muted">卦不替你决定，只提供一个重新看这件事的角度。</p>
        </Layer>
      )}

      {depth < LAYERS.length ? (
        <button type="button" className="btn btn--primary btn--block" onClick={() => setDepth((d) => d + 1)}>
          下一层：{LAYERS[depth]}
        </button>
      ) : (
        <>
          <ReviewSection record={record} onChange={onChange} />
          <div className="actions">
            <ShareButton record={record} cast={cast} main={main} />
            <Link className="btn btn--text" to="/">
              回首页
            </Link>
          </div>
        </>
      )}
    </Screen>
  );
}

function Layer({
  n,
  sectionRef,
  children,
}: {
  n: number;
  sectionRef?: RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  return (
    <section ref={sectionRef} className="layer">
      <h2 className="layer__title">
        <span className="layer__no serif">{NUMERALS[n - 1]}</span>
        {LAYERS[n - 1]}
      </h2>
      {children}
    </section>
  );
}

function Figure({
  perspectiveKey,
  hexagram,
  changing,
}: {
  perspectiveKey: PerspectiveKey;
  hexagram: Hexagram;
  changing: readonly number[];
}) {
  const { label, role } = perspective(perspectiveKey);
  const name = hexagramFullName(hexagram.number);
  return (
    <figure className="figure">
      <span className="figure__caption">
        {label} · {role}
      </span>
      <HexagramFigure yang={hexagram.yang} changing={changing} label={`${label}${name}`} />
      <figcaption className="figure__text">
        <span className="figure__name serif">{name}</span>
        <span className="figure__theme">{hexagramText(hexagram.number).theme}</span>
      </figcaption>
    </figure>
  );
}

/** 互卦、错卦、综卦：同一卦的另外三个角度 */
function Aspects({ base }: { base: Hexagram }) {
  const { mutual, opposite, reversed } = aspectsOf(base);
  const items = [
    ['mutual', mutual],
    ['opposite', opposite],
    ['reversed', reversed],
  ] as const;

  return (
    <details className="aspects">
      <summary>互卦 · 错卦 · 综卦：再换三个角度看</summary>
      <ul className="aspects__list">
        {items.map(([key, hexagram]) => {
          const { label, role, meaning } = perspective(key);
          return (
            <li key={key} className="aspect">
              <HexagramFigure yang={hexagram.yang} size="sm" />
              <div className="aspect__body">
                <p className="aspect__head">
                  <strong>{label}</strong>
                  <span className="muted"> · {role}</span>
                </p>
                <p className="aspect__name serif">
                  {hexagramFullName(hexagram.number)}
                  <span className="muted">　{hexagramText(hexagram.number).theme}</span>
                </p>
                <p className="small muted">
                  {meaning}
                  {hexagram.number === base.number && '　这一卦与本卦相同。'}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

function Glossary({ texts }: { texts: readonly ResolvedText[] }) {
  const terms = glossaryFor(texts.map((t) => t.original));
  if (terms.length === 0) return null;
  return (
    <details className="glossary">
      <summary>字词释义</summary>
      <dl className="terms">
        {terms.map(([term, meaning]) => (
          <Fragment key={term}>
            <dt className="serif">{term}</dt>
            <dd>{meaning}</dd>
          </Fragment>
        ))}
      </dl>
    </details>
  );
}

function ReviewSection({ record, onChange }: { record: CastRecord; onChange: (record: CastRecord) => void }) {
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
    const updated = await recordStore.saveReview(record.id, outcome, note);
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
      <label htmlFor="review-note" className="visually-hidden">
        回访记录
      </label>
      <textarea
        id="review-note"
        className="field"
        rows={3}
        maxLength={500}
        value={note}
        placeholder="后来发生了什么？（可不填）"
        onChange={(e) => setNote(e.target.value)}
      />
      <button type="button" className="btn btn--primary btn--block" disabled={!outcome || saving} onClick={() => void save()}>
        记下
      </button>
    </section>
  );
}

function ShareButton({ record, cast, main }: { record: CastRecord; cast: Cast; main: ResolvedText }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  async function share() {
    setBusy(true);
    setError('');
    try {
      const blob = await renderShareCard({
        question: record.question,
        date: formatDate(record.createdAt),
        base: {
          name: hexagramFullName(cast.base.number),
          yang: cast.base.yang,
          changing: cast.changing,
        },
        changed: cast.changed ? { name: hexagramFullName(cast.changed.number), yang: cast.changed.yang } : null,
        passage: {
          heading: `${hexagramName(main.hexagram)} · ${main.title}`,
          original: main.original,
          plain: main.angle ?? main.plain,
        },
      });
      const result = await sharer.shareImage(blob, '摇卦.png', { title: '摇卦', text: `「${record.question}」` });
      if (result === 'unsupported' || result === 'failed') setPreview(URL.createObjectURL(blob));
    } catch {
      setError('卡片生成失败，稍后再试');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" className="btn btn--block" disabled={busy} onClick={() => void share()}>
        {busy ? '生成中…' : '生成分享卡片'}
      </button>
      {error && (
        <p className="error small center" role="alert">
          {error}
        </p>
      )}
      {preview && (
        <div className="sheet" role="dialog" aria-modal="true" aria-label="分享卡片">
          <img src={preview} alt="分享卡片预览" />
          <p className="small">长按图片可保存</p>
          <a className="btn" href={preview} download="摇卦.png">
            下载图片
          </a>
          <button type="button" className="btn btn--text" onClick={() => setPreview(null)}>
            关闭
          </button>
        </div>
      )}
    </>
  );
}
