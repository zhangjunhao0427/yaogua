/**
 * 本地通知适配层，用于七日回访提醒。
 * Web 端无后端，无法可靠地在七天后推送，schedule 返回 false；
 * 业务层须在应用打开时检查到期卦记作兜底。接 Capacitor 时换成 LocalNotifications。
 */

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

export const notifier: Notifier = webNotifier;
