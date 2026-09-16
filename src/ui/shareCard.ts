// 分享卡片：用 Canvas 直接画爻线，不依赖卦符字体

export interface ShareCardInput {
  readonly question: string;
  readonly date: string;
  readonly base: { readonly name: string; readonly yang: readonly boolean[]; readonly changing: readonly number[] };
  readonly changed: { readonly name: string; readonly yang: readonly boolean[] } | null;
  readonly passage: { readonly heading: string; readonly original: string; readonly plain: string };
}

const W = 1080;
const H = 1440;
const PAD = 108;
const SERIF = '"Songti SC", "STSong", "Noto Serif SC", "Noto Serif CJK SC", serif';
const SANS = 'system-ui, -apple-system, "PingFang SC", "Noto Sans SC", sans-serif';
const COLOR = { paper: '#f4eee2', ink: '#2a2521', soft: '#5b5249', muted: '#8a8075', rule: '#dcd1bf', copper: '#a45f2b' };
const BAR = { w: 190, h: 20, gap: 16 };
const FIGURE_H = 6 * BAR.h + 5 * BAR.gap;
/** 这些标点不放在行首 */
const NO_LINE_START = /[，。；：、？！」』）]/;

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const ch of text) {
    if (line && ctx.measureText(line + ch).width > maxWidth && !NO_LINE_START.test(ch)) {
      lines.push(line);
      line = ch;
    } else {
      line += ch;
    }
  }
  if (line) lines.push(line);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  kept[maxLines - 1] = kept[maxLines - 1].slice(0, -1) + '…';
  return kept;
}

/** 逐行绘制，返回下一行的基线位置 */
function drawLines(ctx: CanvasRenderingContext2D, lines: string[], x: number, y: number, lineHeight: number): number {
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight));
  return y + lines.length * lineHeight;
}

function drawFigure(
  ctx: CanvasRenderingContext2D,
  cx: number,
  top: number,
  yang: readonly boolean[],
  changing: readonly number[],
) {
  const left = cx - BAR.w / 2;
  const segment = BAR.w * 0.41;
  yang.forEach((isYang, i) => {
    // i = 0 为初爻，画在最下
    const y = top + FIGURE_H - (i + 1) * BAR.h - i * BAR.gap;
    ctx.fillStyle = changing.includes(i) ? COLOR.copper : COLOR.ink;
    if (isYang) {
      ctx.fillRect(left, y, BAR.w, BAR.h);
    } else {
      ctx.fillRect(left, y, segment, BAR.h);
      ctx.fillRect(left + BAR.w - segment, y, segment, BAR.h);
    }
  });
}

export async function renderShareCard(input: ShareCardInput): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('无法创建画布');

  ctx.fillStyle = COLOR.paper;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = COLOR.rule;
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, W - 96, H - 96);

  ctx.textAlign = 'left';
  ctx.fillStyle = COLOR.ink;
  ctx.font = `600 40px ${SERIF}`;
  ctx.fillText('摇卦', PAD, 168);
  ctx.textAlign = 'right';
  ctx.fillStyle = COLOR.muted;
  ctx.font = `28px ${SANS}`;
  ctx.fillText(input.date, W - PAD, 166);

  ctx.textAlign = 'center';
  ctx.fillStyle = COLOR.ink;
  ctx.font = `44px ${SERIF}`;
  const afterQuestion = drawLines(ctx, wrap(ctx, `「${input.question}」`, W - PAD * 2, 2), W / 2, 290, 64);

  const figureTop = afterQuestion + 40;
  const centers = input.changed ? [W / 2 - 230, W / 2 + 230] : [W / 2];
  drawFigure(ctx, centers[0], figureTop, input.base.yang, input.base.changing);
  if (input.changed) {
    drawFigure(ctx, centers[1], figureTop, input.changed.yang, []);
    ctx.fillStyle = COLOR.muted;
    ctx.font = `36px ${SERIF}`;
    ctx.fillText('之', W / 2, figureTop + FIGURE_H / 2 + 12);
  }

  const nameY = figureTop + FIGURE_H + 76;
  ctx.fillStyle = COLOR.ink;
  ctx.font = `40px ${SERIF}`;
  ctx.fillText(input.base.name, centers[0], nameY);
  if (input.changed) ctx.fillText(input.changed.name, centers[1], nameY);

  const headingY = nameY + 110;
  ctx.fillStyle = COLOR.copper;
  ctx.font = `30px ${SANS}`;
  ctx.fillText(input.passage.heading, W / 2, headingY);
  ctx.fillStyle = COLOR.ink;
  ctx.font = `46px ${SERIF}`;
  const afterOriginal = drawLines(ctx, wrap(ctx, input.passage.original, W - PAD * 2, 3), W / 2, headingY + 76, 70);
  ctx.fillStyle = COLOR.soft;
  ctx.font = `32px ${SANS}`;
  drawLines(ctx, wrap(ctx, input.passage.plain, W - PAD * 2, 3), W / 2, afterOriginal + 24, 48);

  ctx.fillStyle = COLOR.muted;
  ctx.font = `26px ${SANS}`;
  ctx.fillText('铜钱法起卦 · 卦不可重', W / 2, H - 92);

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('生成图片失败'))), 'image/png'),
  );
}
