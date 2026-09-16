import { Link } from 'react-router-dom';
import { recordStore } from '../../store/records';
import { RecordItem } from '../components/RecordItem';
import { Screen } from '../components/Screen';
import { useLoad } from '../hooks';

export function RecordsPage() {
  const records = useLoad(() => recordStore.listRecords(), []);
  if (!records) return <Screen title="卦记" back="/" />;

  return (
    <Screen title="卦记" back="/">
      {records.length === 0 ? (
        <div className="empty">
          <p className="muted">还没有卦记。</p>
          <Link className="btn btn--primary" to="/ask">
            起一卦
          </Link>
        </div>
      ) : (
        <>
          <p className="small muted">共 {records.length} 卦，只保存在这台设备上。</p>
          <ul className="records">
            {records.map((record) => (
              <RecordItem key={record.id} record={record} />
            ))}
          </ul>
        </>
      )}
    </Screen>
  );
}
