import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { t } from '../../i18n';
import { sharer } from '../../platform/share';
import { backupFileName, makeBackup, mergeBackup, readBackup, type MergeResult } from '../../store/backup';
import { listEntries } from '../../store/entries';
import { Screen } from '../components/Screen';
import { formatDateTime } from '../format';

type Status =
  | { kind: 'idle' }
  | { kind: 'busy'; message: string }
  | { kind: 'done'; message: string }
  | { kind: 'error'; message: string };

export function DataPage() {
  const [count, setCount] = useState<number>();
  const [latest, setLatest] = useState<number>();
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let alive = true;
    void listEntries().then((entries) => {
      if (!alive) return;
      setCount(entries.length);
      setLatest(entries[0]?.createdAt);
    });
    return () => {
      alive = false;
    };
  }, [status]);

  async function exportAll() {
    setStatus({ kind: 'busy', message: t('正在打包…') });
    try {
      const backup = await makeBackup();
      const name = backupFileName(backup.exportedAt);
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const total = backup.coin.length + backup.meihua.length;
      const content = { title: t('摇卦备份'), text: t('{n} 条卦记', { n: total }) };

      const result = await sharer.shareFile(blob, name, content);
      if (result === 'shared') {
        setStatus({ kind: 'done', message: t('已导出，记得存到自己找得到的地方。') });
        return;
      }
      if (result === 'cancelled') {
        setStatus({ kind: 'idle' });
        return;
      }
      // 不支持系统分享就走浏览器下载
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      link.click();
      URL.revokeObjectURL(url);
      setStatus({ kind: 'done', message: t('已下载 {name}', { name }) });
    } catch {
      setStatus({ kind: 'error', message: t('导出没成功，稍后再试。') });
    }
  }

  async function importFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setStatus({ kind: 'busy', message: t('正在读取…') });
    try {
      const backup = readBackup(await file.text());
      const result: MergeResult = await mergeBackup(backup);
      setStatus({ kind: 'done', message: describe(result) });
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : t('这个文件读不了。') });
    }
  }

  return (
    <Screen title={t('备份与恢复')} back="/records">
      <section className="card stack">
        <p className="eyebrow">{t('本机现状')}</p>
        <p className="brief__name serif">{count === undefined ? t('统计中…') : t('{n} 条卦记', { n: count })}</p>
        {latest !== undefined && <p className="small muted">{t('最近一卦：{date}', { date: formatDateTime(latest) })}</p>}
        <p className="small muted">
          {t('卦记只存在这台设备上，不上传任何服务器。换手机、重装应用或清理存储，都会让它们消失——所以请定期导出一份留着。')}
        </p>
      </section>

      <div className="stack">
        <button type="button" className="btn btn--primary btn--block" onClick={() => void exportAll()}>
          {t('导出备份文件')}
        </button>
        <button type="button" className="btn btn--block" onClick={() => fileRef.current?.click()}>
          {t('从备份恢复')}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="visually-hidden"
          onChange={(e) => void importFile(e)}
        />
      </div>

      {status.kind !== 'idle' && (
        <p className={status.kind === 'error' ? 'error center' : 'small muted center'} role="status">
          {status.message}
        </p>
      )}

      <section className="prose">
        <section>
          <h2>{t('恢复是怎么合并的')}</h2>
          <p>
            {t(
              '恢复不会覆盖本机已有的卦记：同一条卦记（按它的编号认）以本机的为准，备份里多出来的才会加进来。所以在新手机上恢复、或者补回误删的那几卦，都不会把你后来新摇的卦弄丢。',
            )}
          </p>
          <p>{t('备份文件是纯文本的 JSON，你可以自己打开看，里面就是你的问题、卦象和回访记录。')}</p>
        </section>
      </section>

      <div className="actions">
        <Link className="btn btn--text" to="/records">
          {t('回卦记')}
        </Link>
      </div>
    </Screen>
  );
}

function describe({ added, skipped, unreadable }: MergeResult): string {
  const parts = [t('加入 {n} 条', { n: added })];
  if (skipped > 0) parts.push(t('本机已有 {n} 条', { n: skipped }));
  if (unreadable > 0) parts.push(t('{n} 条读不出来', { n: unreadable }));
  return t('{list}。', { list: parts.join(t('，')) });
}
