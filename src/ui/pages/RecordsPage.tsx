import { Link } from 'react-router-dom';
import { listEntries } from '../../store/entries';
import { RecordItem } from '../components/RecordItem';
import { Screen } from '../components/Screen';
import { useLoad } from '../hooks';

export function RecordsPage() {
  const entries = useLoad(() => listEntries(), []);
  if (!entries) return <Screen title="卦记" back="/" />;

  return (
    <Screen title="卦记" back="/">
      {entries.length === 0 ? (
        <div className="empty">
          <p className="muted">还没有卦记。</p>
          <Link className="btn btn--primary" to="/ask">
            起一卦
          </Link>
        </div>
      ) : (
        <>
          <p className="small muted">共 {entries.length} 卦，只保存在这台设备上。</p>
          <ul className="records">
            {entries.map((entry) => (
              <RecordItem key={`${entry.kind}-${entry.id}`} entry={entry} />
            ))}
          </ul>
        </>
      )}
    </Screen>
  );
}
