import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recordStore } from '../../store/records';
import { cls } from '../cls';
import { Screen } from '../components/Screen';
import { useLoad, useReducedMotion } from '../hooks';

const SECONDS = 3;

export function CalmPage() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const draft = useLoad(() => recordStore.loadDraft(), []);
  const [left, setLeft] = useState(SECONDS);

  useEffect(() => {
    if (draft === null) navigate('/ask', { replace: true });
    if (!draft) return;
    if (left === 0) {
      navigate('/cast', { replace: true });
      return;
    }
    const timer = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [draft, left, navigate]);

  return (
    <Screen className="calm">
      <div className={cls('breath', !reduced && 'breath--animate')} aria-hidden="true" />
      <p className="calm__cue serif" aria-live="polite">
        {left > 1 ? '吸气' : '呼气'}
      </p>
      {draft && <p className="calm__question serif">「{draft.question}」</p>}
      <p className="small muted">放下手边的事，把心思放回这个问题上。</p>
      <button type="button" className="btn btn--text" onClick={() => navigate('/cast', { replace: true })}>
        跳过
      </button>
    </Screen>
  );
}
