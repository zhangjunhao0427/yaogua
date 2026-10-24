import { describe, expect, it } from 'vitest';
import { backupFileName, BACKUP_VERSION, readBackup } from './backup';

const valid = JSON.stringify({
  app: 'yaogua',
  version: BACKUP_VERSION,
  exportedAt: 1_700_000_000_000,
  coin: [{ id: 'a' }],
  meihua: [],
});

describe('备份文件', () => {
  it('读得出自己导出的格式', () => {
    const backup = readBackup(valid);
    expect(backup.app).toBe('yaogua');
    expect(backup.coin).toHaveLength(1);
    expect(backup.exportedAt).toBe(1_700_000_000_000);
  });

  it('不是备份文件时明确报错，而不是悄悄导入半截', () => {
    expect(() => readBackup('这不是 json')).toThrow(/不是摇卦的备份/);
    expect(() => readBackup('{"app":"别的应用"}')).toThrow(/不是摇卦的备份/);
  });

  it('来自更新版本的备份拒绝导入，并说清原因', () => {
    const future = JSON.stringify({ app: 'yaogua', version: BACKUP_VERSION + 1, coin: [], meihua: [] });
    expect(() => readBackup(future)).toThrow(/更新的版本/);
  });

  it('缺字段时当作空，不抛错', () => {
    const partial = readBackup('{"app":"yaogua"}');
    expect(partial.coin).toEqual([]);
    expect(partial.meihua).toEqual([]);
    expect(partial.version).toBe(0);
  });

  it('文件名带上日期和时刻，便于区分几次备份', () => {
    const name = backupFileName(new Date('2026-10-24T09:05:00').getTime());
    expect(name).toMatch(/^yaogua-20261024-0905\.json$/);
  });
});
