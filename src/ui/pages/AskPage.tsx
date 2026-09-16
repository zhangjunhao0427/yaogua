import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, isClosedQuestion, type Category, type CategoryInfo } from '../../data/guide';
import { recordStore } from '../../store/records';
import { cls } from '../cls';
import { Screen } from '../components/Screen';
import { useLoad } from '../hooks';

const MAX_LENGTH = 200;

export function AskPage() {
  const navigate = useNavigate();
  const draft = useLoad(() => recordStore.loadDraft(), []);
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [error, setError] = useState<{ field: 'category' | 'question'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 已有未完成的卦：问题已锁定，回到摇卦
  useEffect(() => {
    if (draft) navigate('/cast', { replace: true });
  }, [draft, navigate]);

  function pick(info: CategoryInfo) {
    // 分类必选，点击只切换到该项，不取消
    setCategory(info.id);
    setError(null);
    if (!question.trim()) setQuestion(info.starter);
    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) return;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!category) {
      setError({ field: 'category', message: '先选一个分类，解读会按这个方向来写' });
      return;
    }
    const q = question.trim();
    if (!q || CATEGORIES.some((c) => c.starter === q)) {
      setError({ field: 'question', message: q ? '把问题写完整，再确认' : '先写下你想问的事' });
      inputRef.current?.focus();
      return;
    }
    setSubmitting(true);
    await recordStore.startDraft(q, category);
    navigate('/calm', { replace: true });
  }

  const closed = !error && isClosedQuestion(question);

  return (
    <Screen title="立问" back="/">
      <div className="stack stack--lg">
        <h2 className="ask__title serif">你想问什么？</h2>
        <p className="muted">问「我该如何」，而不是「会不会」。卦更擅长回答怎么做，而不是替你预言结果。</p>
      </div>

      <div className="stack">
        <p className="field-label">
          问哪方面？<span className="muted">必选，解读会按这个方向来写</span>
        </p>
        <div className="chips" role="radiogroup" aria-label="问题分类">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              className={cls('chip', category === c.id && 'is-active')}
              aria-checked={category === c.id}
              onClick={() => pick(c)}
            >
              {c.label}
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
          问题
        </label>
        <textarea
          id="question"
          ref={inputRef}
          className={cls('field', error?.field === 'question' && 'field--error')}
          rows={4}
          maxLength={MAX_LENGTH}
          value={question}
          placeholder="例如：面对新的工作机会，我该如何抉择？"
          aria-invalid={error?.field === 'question'}
          aria-describedby="question-hint"
          onChange={(e) => {
            setQuestion(e.target.value);
            if (error) setError(null);
          }}
        />
        <p id="question-hint" className="field-hint">
          {error?.field === 'question' ? (
            <span className="error" role="alert">
              {error.message}
            </span>
          ) : closed ? (
            '这像一道是非题。试着改成「我该如何……」，读卦时会更有收获。'
          ) : (
            <span className="muted">
              {[...question].length}/{MAX_LENGTH}
            </span>
          )}
        </p>
        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          确认问题
        </button>
        <p className="small muted center">确认后问题锁定，这一卦不能再改。</p>
      </form>
    </Screen>
  );
}
