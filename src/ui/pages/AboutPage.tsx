import { Screen } from '../components/Screen';

const COIN_ROWS = [
  ['6', '老阴', '阴', '变 ×', '1/8'],
  ['7', '少阳', '阳', '不变', '3/8'],
  ['8', '少阴', '阴', '不变', '3/8'],
  ['9', '老阳', '阳', '变 ○', '1/8'],
];

const RULE_ROWS = [
  ['无', '本卦卦辞'],
  ['一爻', '本卦这一变爻的爻辞'],
  ['二爻', '本卦两变爻的爻辞，以上面一爻为主'],
  ['三爻', '本卦与之卦的卦辞并看，以本卦为主'],
  ['四爻', '之卦两个不变爻的爻辞，以下面一爻为主'],
  ['五爻', '之卦唯一不变爻的爻辞'],
  ['六爻', '乾卦读「用九」，坤卦读「用六」，其余读之卦卦辞'],
];

export function AboutPage() {
  return (
    <Screen title="起卦说明" back="/">
      <div className="prose">
        <section>
          <h2>铜钱法</h2>
          <p>
            三枚铜钱同时掷出。各家对正反面的定义有分歧，本应用明确约定：<strong>背面计 3，字面计 2</strong>。三枚相加得一爻：
          </p>
          <table className="table">
            <thead>
              <tr>
                <th>和</th>
                <th>名称</th>
                <th>阴阳</th>
                <th>变否</th>
                <th>概率</th>
              </tr>
            </thead>
            <tbody>
              {COIN_ROWS.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p>掷六次成一卦。第一次为初爻，在最下；第六次为上爻，在最上。卦自下而上生长。</p>
        </section>

        <section>
          <h2>本卦与之卦</h2>
          <p>
            六爻所成的是本卦。把其中的变爻（老阳、老阴）阴阳翻转，其余不动，得到之卦，表示事情变化的方向。没有变爻，就没有之卦。
          </p>
        </section>

        <section>
          <h2>该读哪一句</h2>
          <p>依朱熹《易学启蒙》的变占之法，按变爻个数决定：</p>
          <table className="table">
            <thead>
              <tr>
                <th>变爻</th>
                <th>读什么</th>
              </tr>
            </thead>
            <tbody>
              {RULE_ROWS.map(([count, what]) => (
                <tr key={count}>
                  <td>{count}</td>
                  <td>{what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2>为什么卦不可重</h2>
          <p>《蒙》卦卦辞说：</p>
          <p className="quote">初筮告，再三渎，渎则不告。</p>
          <p>
            第一次问，才会得到回答；反复追问，是亵渎。能无限重摇的卦，结果就不值得认真对待。所以本应用每掷出一爻就立刻记下，刷新页面、退出重进，都无法重来。
          </p>
        </section>

        <section>
          <h2>随机从哪里来</h2>
          <p>
            每一枚铜钱的正反，都由系统的密码学随机数（crypto.getRandomValues）决定，并剔除了取模带来的偏差，不使用普通的伪随机函数。长按蓄力的时长只影响动画，不影响结果。
          </p>
        </section>

        <section>
          <h2>经文</h2>
          <p>
            卦辞、爻辞据《周易》通行本，属公有领域，并与维基文库逐条校对。白话解释为本应用原创，只帮你读懂字面，不替你下结论。
          </p>
        </section>

        <section>
          <h2>隐私</h2>
          <p>不需要注册，不问出生时间，也不收集任何个人信息。你的问题和卦记只保存在这台设备上。</p>
        </section>
      </div>
    </Screen>
  );
}
