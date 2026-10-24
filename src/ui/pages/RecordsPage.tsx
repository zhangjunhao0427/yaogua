import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listEntries, removeEntry, type Entry } from '../../store/entries';
import { cls } from '../cls';
import { RecordItem } from '../components/RecordItem';
import { Screen } from '../components/Screen';

export function RecordsPage() {
  const [entries, setEntries] = useState<Entry[]>();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let alive = true;
    void listEntries().then((list) => {
      if (alive) setEntries(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  async function remove(entry: Entry) {
    await removeEntry(entry);
    const left = await listEntries();
    setEntries(left);
    if (left.length === 0) setEditing(false);
  }

  if (!entries) return <Screen title="卦记" back="/" />;

  return (
    <Screen title="卦记" back="/">
      {entries.length === 0 ? (
        <div className="empty">
          <p className="muted">还没有卦记。</p>
          <Link className="btn btn--primary" to="/">
            起一卦
          </Link>
        </div>
      ) : (
        <>
          <div className="records__bar">
            <span className="small muted">共 {entries.length} 卦，只保存在这台设备上。</span>
            <button
              type="button"
              className={cls('btn btn--text btn--compact', editing && 'is-active')}
              onClick={() => setEditing((on) => !on)}
            >
              {editing ? '完成' : '管理'}
            </button>
          </div>
          <ul className="records">
            {entries.map((entry) => (
              <RecordItem
                key={`${entry.kind}-${entry.id}`}
                entry={entry}
                onDelete={editing ? () => remove(entry) : undefined}
              />
            ))}
          </ul>
          {editing && <p className="small muted center">删掉的卦记找不回来，连同它的七日回访提醒一起撤销。</p>}
        </>
      )}
    </Screen>
  );
}
