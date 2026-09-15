/**
 * 摇一摇适配层。Web 用 DeviceMotionEvent，接 Capacitor 时换成 Motion 插件。
 */

export interface Motion {
  /** iOS 13+ 须在用户手势回调内调用 */
  requestPermission(): Promise<boolean>;
  /** 监听摇动，返回取消监听的函数 */
  onShake(handler: () => void): () => void;
}

export interface Acceleration {
  x: number;
  y: number;
  z: number;
}

/** 相邻两次加速度（含重力）变化量超过阈值判为一次摇动，冷却期内不重复触发 */
export function createShakeDetector({ threshold = 15, cooldownMs = 1000 } = {}) {
  let last: Acceleration | null = null;
  let lastShakeAt = -Infinity;
  return (a: Acceleration, now: number): boolean => {
    const prev = last;
    last = a;
    if (!prev) return false;
    const delta = Math.abs(a.x - prev.x) + Math.abs(a.y - prev.y) + Math.abs(a.z - prev.z);
    if (delta < threshold || now - lastShakeAt < cooldownMs) return false;
    lastShakeAt = now;
    return true;
  };
}

interface PermissionGated {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

export const webMotion: Motion = {
  async requestPermission() {
    if (typeof DeviceMotionEvent === 'undefined') return false;
    const ctor = DeviceMotionEvent as unknown as PermissionGated;
    if (typeof ctor.requestPermission !== 'function') return true;
    try {
      return (await ctor.requestPermission()) === 'granted';
    } catch {
      return false;
    }
  },
  onShake(handler) {
    if (typeof window === 'undefined') return () => {};
    const detect = createShakeDetector();
    const listener = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity;
      if (a?.x == null || a.y == null || a.z == null) return;
      if (detect({ x: a.x, y: a.y, z: a.z }, e.timeStamp)) handler();
    };
    window.addEventListener('devicemotion', listener);
    return () => window.removeEventListener('devicemotion', listener);
  },
};

export const motion: Motion = webMotion;
