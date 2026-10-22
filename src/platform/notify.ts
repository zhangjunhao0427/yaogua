/**
 * 本地通知适配层，用于七日回访提醒。
 * 原生用 Capacitor LocalNotifications；网页无后端，无法可靠地在七天后推送，
 * schedule 返回 false，业务层靠打开应用时检查到期卦记兜底。
 */
import { LocalNotifications } from '@capacitor/local-notifications';
import { pick } from './runtime';

export interface Reminder {
  /** Capacitor LocalNotifications 要求 32 位整数 */
  id: number;
  at: Date;
  title: string;
  body: string;
}

export interface Notifier {
  schedule(reminder: Reminder): Promise<boolean>;
  cancel(id: number): Promise<void>;
}

export const webNotifier: Notifier = {
  async schedule() {
    return false;
  },
  async cancel() {},
};

async function ensurePermission(): Promise<boolean> {
  const current = await LocalNotifications.checkPermissions();
  if (current.display === 'granted') return true;
  if (current.display === 'denied') return false;
  return (await LocalNotifications.requestPermissions()).display === 'granted';
}

export const nativeNotifier: Notifier = {
  async schedule(reminder) {
    try {
      if (reminder.at.getTime() <= Date.now()) return false;
      if (!(await ensurePermission())) return false;
      await LocalNotifications.schedule({
        notifications: [
          {
            id: reminder.id,
            title: reminder.title,
            body: reminder.body,
            schedule: { at: reminder.at, allowWhileIdle: true },
          },
        ],
      });
      return true;
    } catch {
      return false;
    }
  },
  async cancel(id) {
    try {
      await LocalNotifications.cancel({ notifications: [{ id }] });
    } catch {
      // 通知可能已触发或不存在
    }
  },
};

export const notifier: Notifier = pick(nativeNotifier, webNotifier);
