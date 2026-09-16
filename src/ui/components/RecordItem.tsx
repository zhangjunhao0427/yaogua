import { Link } from 'react-router-dom';
import { hexagramName } from '../../data/hexagrams';
import { castOf, isReviewDue, OUTCOME_LABEL, type CastRecord } from '../../store/records';
import { cls } from '../cls';
import { formatDate } from '../format';
import { HexagramFigure } from './HexagramFigure';

export function RecordItem({ record }: { record: CastRecord }) {
  const cast = castOf(record);
  const due = isReviewDue(record);
  const status = record.review ? OUTCOME_LABEL[record.review.outcome] : due ? '待回访' : null;
  return (
    <li>
      <Link to={`/r/${record.id}`} className="record">
        <HexagramFigure yang={cast.base.yang} changing={cast.changing} size="sm" />
        <span className="record__body">
          <span className="record__question">{record.question}</span>
          <span className="record__meta">
            {formatDate(record.createdAt)} · {hexagramName(cast.base.number)}
            {cast.changed && ` 之 ${hexagramName(cast.changed.number)}`}
          </span>
        </span>
        {status && <span className={cls('badge', due && 'badge--accent')}>{status}</span>}
      </Link>
    </li>
  );
}
