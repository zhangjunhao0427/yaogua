import { useEffect, useState } from 'react';
import { cls } from '../cls';

interface DeleteButtonProps {
  onDelete: () => Promise<unknown> | unknown;
  label?: string;
  confirmLabel?: string;
  /** 列表里用的小号样式 */
  compact?: boolean;
}

/** 点第一次进入待确认，再点才删；四秒内没有再点就复位，免得误触 */
export function DeleteButton({
  onDelete,
  label = '删除这一卦',
  confirmLabel = '确定删除？',
  compact = false,
}: DeleteButtonProps) {
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = window.setTimeout(() => setArmed(false), 4000);
    return () => window.clearTimeout(timer);
  }, [armed]);

  async function click() {
    if (!armed) {
      setArmed(true);
      return;
    }
    setBusy(true);
    try {
      await onDelete();
    } finally {
      setBusy(false);
      setArmed(false);
    }
  }

  return (
    <button
      type="button"
      className={cls('btn btn--danger', compact ? 'btn--compact' : 'btn--block')}
      disabled={busy}
      aria-label={armed ? confirmLabel : label}
      onClick={() => void click()}
    >
      {busy ? '删除中…' : armed ? confirmLabel : label}
    </button>
  );
}
