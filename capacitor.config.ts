import type { CapacitorConfig } from '@capacitor/cli';

// appId 上架后不可更改，改动前先确认
const config: CapacitorConfig = {
  appId: 'com.zhangjunhao0427.yaogua',
  appName: '摇卦',
  webDir: 'dist',
  // 网页资源随包发布，从 file:// 加载，不连任何服务器
  server: { androidScheme: 'https' },
  ios: { contentInset: 'always' },
  plugins: {
    SplashScreen: {
      launchShowDuration: 500,
      launchAutoHide: true,
      backgroundColor: '#f4eee2',
      showSpinner: false,
    },
  },
};

export default config;
