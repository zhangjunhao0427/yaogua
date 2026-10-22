/**
 * 震动适配层。原生用 Capacitor Haptics（iPhone 的 Taptic Engine），
 * 网页用 Vibration API（iOS Safari 不支持，静默跳过）。
 */
import { Haptics as CapHaptics, ImpactStyle as CapImpactStyle } from '@capacitor/haptics';
import { pick } from './runtime';

export type ImpactStyle = 'light' | 'medium' | 'heavy';

export interface Haptics {
  impact(style: ImpactStyle): Promise<void>;
  vibrate(durationMs: number): Promise<void>;
}

const IMPACT_MS: Record<ImpactStyle, number> = { light: 10, medium: 20, heavy: 35 };

const NATIVE_STYLE: Record<ImpactStyle, CapImpactStyle> = {
  light: CapImpactStyle.Light,
  medium: CapImpactStyle.Medium,
  heavy: CapImpactStyle.Heavy,
};

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

export const nativeHaptics: Haptics = {
  async impact(style) {
    try {
      await CapHaptics.impact({ style: NATIVE_STYLE[style] });
    } catch {
      // 设备关闭了触感反馈
    }
  },
  async vibrate(durationMs) {
    try {
      await CapHaptics.vibrate({ duration: durationMs });
    } catch {
      // 同上
    }
  },
};

export const haptics: Haptics = pick(nativeHaptics, webHaptics);
