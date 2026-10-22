/**
 * 分享适配层。原生用 Capacitor Share（图片先落到缓存目录再分享），
 * 网页用 Web Share API，不支持时退回复制或由界面展示图片。
 */
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { pick } from './runtime';

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

/** 用户在系统分享面板上取消，不是失败 */
function isCancelled(e: unknown): boolean {
  if (e instanceof DOMException && e.name === 'AbortError') return true;
  const message = e instanceof Error ? e.message : String(e);
  return /cancel/i.test(message);
}

export const webSharer: Sharer = {
  async shareImage(image, fileName, content) {
    const file = new File([image], fileName, { type: image.type });
    if (typeof navigator === 'undefined' || !navigator.canShare?.({ files: [file] })) return 'unsupported';
    try {
      await navigator.share({ files: [file], title: content.title, text: content.text });
      return 'shared';
    } catch (e) {
      return isCancelled(e) ? 'cancelled' : 'failed';
    }
  },
  async share(content) {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share(content);
        return 'shared';
      } catch (e) {
        if (isCancelled(e)) return 'cancelled';
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

const CHUNK = 0x8000;

async function toBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

export const nativeSharer: Sharer = {
  async share(content) {
    try {
      await Share.share(content);
      return 'shared';
    } catch (e) {
      return isCancelled(e) ? 'cancelled' : 'failed';
    }
  },
  async shareImage(image, fileName, content) {
    try {
      // 中文文件名在部分系统上会出问题，统一用安全名
      const safeName = /^[\w.-]+$/.test(fileName) ? fileName : 'yaogua-card.png';
      const { uri } = await Filesystem.writeFile({
        path: safeName,
        data: await toBase64(image),
        directory: Directory.Cache,
      });
      await Share.share({ title: content.title, text: content.text, files: [uri] });
      return 'shared';
    } catch (e) {
      return isCancelled(e) ? 'cancelled' : 'failed';
    }
  },
};

export const sharer: Sharer = pick(nativeSharer, webSharer);
