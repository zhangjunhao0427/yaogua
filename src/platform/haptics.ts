/**
 * 震动适配层。Web 用 Vibration API（iOS Safari 不支持，静默跳过），
 * 接 Capacitor 时换成 Haptics 插件。
 */

export type ImpactStyle = 'light' | 'medium' | 'heavy';

export interface Haptics {
  impact(style: ImpactStyle): Promise<void>;
  vibrate(durationMs: number): Promise<void>;
}

const IMPACT_MS: Record<ImpactStyle, number> = { light: 10, medium: 20, heavy: 35 };

function webVibrate(ms: number) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    // 不支持时静默跳过
  }
}

export const webHaptics: Haptics = {
  async impact(style) {
    webVibrate(IMPACT_MS[style]);
  },
  async vibrate(durationMs) {
    webVibrate(durationMs);
  },
};

export const haptics: Haptics = webHaptics;
