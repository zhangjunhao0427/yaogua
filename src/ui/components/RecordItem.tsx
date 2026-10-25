import { Link } from 'react-router-dom';
import { t } from '../../i18n';
import { hexagramName } from '../../i18n/names';
import { entryDue, entryFigure, entryHexagrams, entryHref, type Entry } from '../../store/entries';
import { OUTCOME_LABEL } from '../../store/records';
import { cls } from '../cls';
import { formatDate } from '../format';
import { DeleteButton } from './DeleteButton';
import { HexagramFigure } from './HexagramFigure';

export function RecordItem({ entry, onDelete }: { entry: Entry; onDelete?: () => Promise<unknown> }) {
  const figure = entryFigure(entry);
  const { from, to } = entryHexagrams(entry);
  const due = entryDue(entry);
  const review = entry.record.review;
  const status = review ? t(OUTCOME_LABEL[review.outcome]) : due ? t('待回访') : null;

  return (
    <li className="record-row">
      <Link to={entryHref(entry)} className="record">
        <HexagramFigure yang={figure.yang} changing={figure.changing} size="sm" />
        <span className="record__body">
          <span className="record__question">{entry.record.question}</span>
          <span className="record__meta">
            {formatDate(entry.createdAt)} · {entry.kind === 'coin' ? t('铜钱') : t('梅花')} ·{' '}
            {to === null ? hexagramName(from) : t('{from} 之 {to}', { from: hexagramName(from), to: hexagramName(to) })}
          </span>
        </span>
        {status && !onDelete && <span className={cls('badge', due && 'badge--accent')}>{status}</span>}
      </Link>
      {onDelete && <DeleteButton compact label={t('删除')} confirmLabel={t('确定？')} onDelete={onDelete} />}
    </li>
  );
}
