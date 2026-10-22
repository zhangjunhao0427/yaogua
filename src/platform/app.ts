/**
 * 原生壳的启动收尾：状态栏、启动屏、安卓返回键。网页里什么都不做。
 */
import { App as CapApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { isNative } from './runtime';

export async function initNativeShell(): Promise<void> {
  if (!isNative()) return;

  try {
    // 跟随系统深浅色
    await StatusBar.setStyle({ style: Style.Default });
  } catch {
    // 安卓部分机型或不支持时忽略
  }

  try {
    await CapApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack && window.location.hash !== '#/') {
        window.history.back();
      } else {
        void CapApp.exitApp();
      }
    });
  } catch {
    // iOS 没有返回键
  }

  try {
    await SplashScreen.hide();
  } catch {
    // 已经隐藏
  }
}
