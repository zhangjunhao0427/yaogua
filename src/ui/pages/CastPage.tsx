import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { castLine, isChanging, isYang, LINE_NAME } from '../../core/coin';
import { lineTitle } from '../../core/hexagram';
import type { Line, LineIndex, Toss } from '../../core/types';
import { hexagramFullName } from '../../data/hexagrams';
import { haptics } from '../../platform/haptics';
import { motion } from '../../platform/motion';
import { castOf, recordStore, type CastRecord, type Draft } from '../../store/records';
import { cls } from '../cls';
import { Coin } from '../components/Coin';
import { HexagramFigure } from '../components/HexagramFigure';
import { Screen } from '../components/Screen';
import { useReducedMotion } from '../hooks';

type Phase = 'loading' | 'idle' | 'charging' | 'throwing' | 'falling' | 'revealing' | 'complete';

/** 动效时长（毫秒），见交接文档「摇卦」一节 */
const TIMING = { throw: 200, fall: 660, stagger: 72, flip: 120, chargeFull: 1200, buzzEvery: 140 };

const FACE_NAME = { 2: '字', 3: '背' } as const;

export function CastPage() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [shown, setShown] = useState(0);
  const [faces, setFaces] = useState<Toss>([2, 2, 2]);
  const [revealed, setRevealed] = useState(3);
  const [record, setRecord] = useState<CastRecord | null>(null);
  const [shakeOn, setShakeOn] = useState(false);
  const [shakeDenied, setShakeDenied] = useState(false);

  const phaseRef = useRef<Phase>('loading');
  const draftRef = useRef<Draft | null>(null);
  const slotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timers = useRef<number[]>([]);
  const chargeFrame = useRef(0);

  function go(next: Phase) {
    phaseRef.current = next;
    setPhase(next);
  }

  function later(ms: number, fn: () => void) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((t) => clearTimeout(t));
      cancelAnimationFrame(chargeFrame.current);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const saved = await recordStore.loadDraft();
      if (!alive) return;
      if (!saved) {
        navigate('/ask', { replace: true });
        return;
      }
      if (saved.lines.length === 6) {
        // 上次六爻已成，未及成卦
        const done = await recordStore.finalize(saved);
        navigate(`/r/${done.id}?fresh=1`, { replace: true });
        return;
      }
      draftRef.current = saved;
      setDraft(saved);
      setShown(saved.lines.length);
      const last = saved.lines.at(-1);
      if (last) setFaces(last.toss);
      go('idle');
    })();
    return () => {
      alive = false;
    };
  }, [navigate]);

  function startCharge() {
    go('charging');
    const start = performance.now();
    let lastBuzz = -Infinity;
    const tick = (now: number) => {
      const level = Math.min(1, (now - start) / TIMING.chargeFull);
      if (!reduced) {
        const amp = 1 + level * 4;
        slotRefs.current.forEach((el, i) => {
          if (!el) return;
          const t = now / 16 + i * 2.1;
          const x = (amp * Math.sin(t * 1.7)).toFixed(2);
          const y = (amp * 0.6 * Math.cos(t * 2.3)).toFixed(2);
          const deg = (amp * 1.5 * Math.sin(t)).toFixed(2);
          el.style.transform = `translate(${x}px, ${y}px) rotate(${deg}deg)`;
        });
      }
      if (now - lastBuzz >= TIMING.buzzEvery) {
        lastBuzz = now;
        void haptics.impact(level > 0.6 ? 'medium' : 'light');
      }
      chargeFrame.current = requestAnimationFrame(tick);
    };
    chargeFrame.current = requestAnimationFrame(tick);
  }

  function stopCharge() {
    cancelAnimationFrame(chargeFrame.current);
    slotRefs.current.forEach((el) => el?.style.removeProperty('transform'));
  }

  async function formLine(line: Line, next: Draft) {
    setShown(next.lines.length);
    if (isChanging(line.value)) void haptics.impact('heavy');
    if (next.lines.length < 6) {
      go('idle');
      return;
    }
    go('complete');
    setRecord(await recordStore.finalize(next));
  }

  async function release() {
    const current = draftRef.current;
    const at = phaseRef.current;
    if (!current || (at !== 'idle' && at !== 'charging') || current.lines.length >= 6) return;
    stopCharge();
    go(reduced ? 'revealing' : 'throwing');

    const line = castLine();
    // 先保存再播动画：动画途中刷新也无法重摇
    const next = await recordStore.addLine(current, line);
    draftRef.current = next;
    setDraft(next);

    if (reduced) {
      setFaces(line.toss);
      setRevealed(3);
      later(160, () => void formLine(line, next));
      return;
    }

    setRevealed(0);
    later(TIMING.throw, () => go('falling'));
    const landed = TIMING.throw + TIMING.fall + TIMING.stagger * 2;
    later(landed, () => {
      setFaces(line.toss);
      go('revealing');
      void haptics.impact('medium');
    });
    for (let i = 0; i < 3; i++) later(landed + TIMING.flip * i, () => setRevealed(i + 1));
    later(landed + TIMING.flip * 3, () => void formLine(line, next));
  }

  const releaseRef = useRef(release);
  useEffect(() => {
    releaseRef.current = release;
  });

  useEffect(() => {
    if (!shakeOn) return;
    return motion.onShake(() => void releaseRef.current());
  }, [shakeOn]);

  async function enableShake() {
    const granted = await motion.requestPermission();
    setShakeOn(granted);
    setShakeDenied(!granted);
  }

  function onPointerDown(e: PointerEvent<HTMLButtonElement>) {
    if (e.button !== 0 || phaseRef.current !== 'idle') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startCharge();
  }

  function onPointerUp() {
    if (phaseRef.current === 'charging') void release();
  }

  function onPointerCancel() {
    if (phaseRef.current !== 'charging') return;
    stopCharge();
    go('idle');
  }

  // 键盘与读屏软件触发的点击没有指针事件（detail 为 0）
  function onClick(e: MouseEvent<HTMLButtonElement>) {
    if (e.detail === 0) void release();
  }

  if (!draft) return <Screen title="摇卦" />;

  const formed = draft.lines.slice(0, shown);
  const yang = formed.map((l) => isYang(l.value));
  const changing = formed.flatMap((l, i) => (isChanging(l.value) ? [i] : []));
  const last = formed.at(-1);
  const settled = phase === 'idle' || phase === 'charging' || phase === 'complete';

  return (
    <Screen title="摇卦" back="/" className="cast">
      <p className="cast__question serif">「{draft.question}」</p>

      <div className="cast__figure">
        <HexagramFigure yang={yang} changing={changing} size="lg" slots animateLast label={`已得 ${shown} 爻`} />
      </div>

      <button
        type="button"
        className={cls('stage', `is-${phase}`)}
        disabled={phase === 'complete'}
        aria-label={phase === 'complete' ? '六爻已成' : `掷铜钱，第 ${Math.min(shown + 1, 6)} 爻`}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onClick={onClick}
        onContextMenu={(e) => e.preventDefault()}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            ref={(el) => {
              slotRefs.current[i] = el;
            }}
            className={cls(
              'coin-slot',
              (phase === 'falling' || (phase === 'revealing' && i >= revealed)) && 'is-spinning',
              phase === 'revealing' && i < revealed && 'is-settling',
            )}
            style={{ '--i': i } as CSSProperties}
            aria-hidden="true"
          >
            <Coin face={faces[i]} />
          </span>
        ))}
      </button>

      <p className="cast__result" aria-live="polite">
        {last && settled ? <LineResult line={last} index={(shown - 1) as LineIndex} /> : ' '}
      </p>

      <ol className="dots" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className={cls('dot', i < shown && 'is-filled', changing.includes(i) && 'is-changing')} />
        ))}
      </ol>

      {phase === 'complete' ? (
        <Complete record={record} />
      ) : (
        <div className="cast__hints">
          <p>长按铜钱蓄力，松手掷出；轻点也可以。</p>
          {motion.isSupported() &&
            (shakeOn ? (
              <p>也可以摇动手机。</p>
            ) : (
              <button type="button" className="btn btn--text" onClick={() => void enableShake()}>
                {shakeDenied ? '摇一摇未获授权，点此重试' : '开启摇一摇'}
              </button>
            ))}
          <p className="cast__rule">卦不可重：每掷一爻即刻记下，无法重摇。</p>
        </div>
      )}
    </Screen>
  );
}

function LineResult({ line, index }: { line: Line; index: LineIndex }) {
  const changing = isChanging(line.value);
  return (
    <>
      <strong>{lineTitle(index, isYang(line.value))}</strong>
      {'　'}
      {line.toss.map((c) => FACE_NAME[c]).join(' ')} · {line.toss.join('+')}＝{line.value} ·{' '}
      <span className={cls(changing && 'is-changing')}>
        {LINE_NAME[line.value]}
        {changing && '（变）'}
      </span>
    </>
  );
}

function Complete({ record }: { record: CastRecord | null }) {
  if (!record) return <p className="muted center">成卦中…</p>;
  const cast = castOf(record);
  return (
    <div className="complete">
      <p className="eyebrow">六爻已成</p>
      <p className="complete__name serif">
        {hexagramFullName(cast.base.number)}
        {cast.changed && (
          <>
            <span className="muted"> 之 </span>
            {hexagramFullName(cast.changed.number)}
          </>
        )}
      </p>
      <Link className="btn btn--primary btn--block" to={`/r/${record.id}?fresh=1`}>
        看解读
      </Link>
    </div>
  );
}
