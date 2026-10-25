/**
 * 备份与恢复。卦记只存在本机，换手机或误删应用就会全部丢失，
 * 所以要能导出成一个文件带走，也要能从文件读回来。
 */
import { meihuaStore, type MeihuaRecord } from './meihua';
import { t } from '../i18n';
import { recordStore, type CastRecord } from './records';

/** 备份文件的格式版本。改动结构时必须加一，并在 readBackup 里兼容旧版 */
export const BACKUP_VERSION = 1;

export interface Backup {
  readonly app: 'yaogua';
  readonly version: number;
  readonly exportedAt: number;
  readonly coin: readonly CastRecord[];
  readonly meihua: readonly MeihuaRecord[];
}

export interface MergeResult {
  /** 新加进来的条数 */
  readonly added: number;
  /** 本机已有、跳过的条数 */
  readonly skipped: number;
  /** 文件里认不出来的条数 */
  readonly unreadable: number;
}

/** 两个卦记仓库，测试时可换成内存实现 */
export interface BackupStores {
  readonly coin: Pick<typeof recordStore, 'listRecords' | 'restore'>;
  readonly meihua: Pick<typeof meihuaStore, 'list' | 'restore'>;
}

const defaultStores: BackupStores = { coin: recordStore, meihua: meihuaStore };

export async function makeBackup(now = Date.now(), stores: BackupStores = defaultStores): Promise<Backup> {
  const [coin, meihua] = await Promise.all([stores.coin.listRecords(), stores.meihua.list()]);
  return { app: 'yaogua', version: BACKUP_VERSION, exportedAt: now, coin, meihua };
}

export function backupFileName(exportedAt: number): string {
  const d = new Date(exportedAt);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `yaogua-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.json`;
}

const isObject = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null;

/** 解析备份文件。认不出来就抛错，宁可明确失败也不要悄悄导入半截数据 */
export function readBackup(text: string): Backup {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(t('这个文件不是摇卦的备份，打不开。'));
  }
  if (!isObject(parsed) || parsed.app !== 'yaogua') {
    throw new Error(t('这个文件不是摇卦的备份。'));
  }
  const version = typeof parsed.version === 'number' ? parsed.version : 0;
  if (version > BACKUP_VERSION) {
    throw new Error(t('这份备份来自更新的版本，请先把应用更新到最新。'));
  }
  return {
    app: 'yaogua',
    version,
    exportedAt: typeof parsed.exportedAt === 'number' ? parsed.exportedAt : Date.now(),
    coin: Array.isArray(parsed.coin) ? (parsed.coin as CastRecord[]) : [],
    meihua: Array.isArray(parsed.meihua) ? (parsed.meihua as MeihuaRecord[]) : [],
  };
}

/**
 * 并入本机：同 id 的保留本机那份，不覆盖。
 * 恢复备份不该删掉用户后来新摇的卦。
 */
export async function mergeBackup(backup: Backup, stores: BackupStores = defaultStores): Promise<MergeResult> {
  const [coinNow, meihuaNow] = await Promise.all([stores.coin.listRecords(), stores.meihua.list()]);
  const coinIds = new Set(coinNow.map((r) => r.id));
  const meihuaIds = new Set(meihuaNow.map((r) => r.id));

  let added = 0;
  let skipped = 0;
  let unreadable = 0;

  for (const record of backup.coin) {
    if (!isObject(record) || typeof record.id !== 'string') {
      unreadable++;
    } else if (coinIds.has(record.id)) {
      skipped++;
    } else if (await stores.coin.restore(record)) {
      added++;
    } else {
      unreadable++;
    }
  }

  for (const record of backup.meihua) {
    if (!isObject(record) || typeof record.id !== 'string') {
      unreadable++;
    } else if (meihuaIds.has(record.id)) {
      skipped++;
    } else if (await stores.meihua.restore(record)) {
      added++;
    } else {
      unreadable++;
    }
  }

  return { added, skipped, unreadable };
}
