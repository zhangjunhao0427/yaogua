import type { CoinValue } from '../../core/types';

/** 方孔铜钱：字面「开元通宝」计 2，背面计 3 */
export function Coin({ face }: { face: CoinValue }) {
  return (
    <span className="coin" data-face={face === 3 ? 'back' : 'front'}>
      <span className="coin__side coin__side--front">
        <span className="coin__char coin__char--top">开</span>
        <span className="coin__char coin__char--bottom">元</span>
        <span className="coin__char coin__char--right">通</span>
        <span className="coin__char coin__char--left">宝</span>
        <span className="coin__hole" />
      </span>
      <span className="coin__side coin__side--back">
        <span className="coin__ring" />
        <span className="coin__hole" />
      </span>
    </span>
  );
}
