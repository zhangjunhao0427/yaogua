import { cls } from '../cls';

interface HexagramFigureProps {
  /** 由下至上，可少于六爻 */
  yang: readonly boolean[];
  changing?: readonly number[];
  size?: 'sm' | 'md' | 'lg';
  /** 补足六个空位，摇卦过程中使用 */
  slots?: boolean;
  /** 在变爻旁标 ○（老阳）×（老阴） */
  marks?: boolean;
  /** 最新一爻播放生成动画 */
  animateLast?: boolean;
  label?: string;
}

export function HexagramFigure({
  yang,
  changing = [],
  size = 'md',
  slots = false,
  marks = size !== 'sm',
  animateLast = false,
  label,
}: HexagramFigureProps) {
  const rows = slots ? 6 : yang.length;
  return (
    <div
      className={cls('hexagram', `hexagram--${size}`, marks && 'has-marks')}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {Array.from({ length: rows }, (_, i) => {
        const filled = i < yang.length;
        const isChanging = filled && changing.includes(i);
        return (
          <div
            key={i}
            className={cls(
              'yao',
              !filled && 'yao--empty',
              isChanging && 'yao--changing',
              animateLast && filled && i === yang.length - 1 && 'yao--enter',
            )}
          >
            <span className="yao__line">
              {filled && <span className="yao__bar" />}
              {filled && !yang[i] && <span className="yao__bar" />}
            </span>
            {marks && <span className="yao__mark">{isChanging ? (yang[i] ? '○' : '×') : ''}</span>}
          </div>
        );
      })}
    </div>
  );
}
