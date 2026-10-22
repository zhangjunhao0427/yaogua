import { Capacitor } from '@capacitor/core';

/** 是否跑在 iOS/Android 原生壳里；浏览器里为 false */
export function isNative(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export function platformName(): 'ios' | 'android' | 'web' {
  try {
    const name = Capacitor.getPlatform();
    return name === 'ios' || name === 'android' ? name : 'web';
  } catch {
    return 'web';
  }
}

/** 按平台挑实现：业务代码只认接口，不认平台 */
export function pick<T>(native: T, web: T): T {
  return isNative() ? native : web;
}
