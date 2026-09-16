/**
 * 分享适配层。Web 用 Web Share API，不支持时退回复制到剪贴板；
 * 接 Capacitor 时换成 Share 插件。
 */

export interface ShareContent {
  title: string;
  text: string;
  url?: string;
}

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed';

export interface Sharer {
  share(content: ShareContent): Promise<ShareResult>;
  /** 分享图片；环境不支持分享文件时返回 'unsupported'，由界面改为展示图片供保存 */
  shareImage(image: Blob, fileName: string, content: ShareContent): Promise<ShareResult | 'unsupported'>;
}

export const webSharer: Sharer = {
  async shareImage(image, fileName, content) {
    const file = new File([image], fileName, { type: image.type });
    if (typeof navigator === 'undefined' || !navigator.canShare?.({ files: [file] })) return 'unsupported';
    try {
      await navigator.share({ files: [file], title: content.title, text: content.text });
      return 'shared';
    } catch (e) {
      return e instanceof DOMException && e.name === 'AbortError' ? 'cancelled' : 'failed';
    }
  },
  async share(content) {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share(content);
        return 'shared';
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return 'cancelled';
      }
    }
    try {
      const text = [content.title, content.text, content.url].filter(Boolean).join('\n');
      await navigator.clipboard.writeText(text);
      return 'copied';
    } catch {
      return 'failed';
    }
  },
};

export const sharer: Sharer = webSharer;
