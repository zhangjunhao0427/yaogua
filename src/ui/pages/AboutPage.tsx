import { PERSPECTIVES } from '../../data/guide';
import { t } from '../../i18n';
import { CONTACT_EMAIL, PRIVACY_URL } from '../../data/site';
import { Screen } from '../components/Screen';

const coinRows = () => [
  ['6', t('老阴'), t('阴'), t('变 ×'), '1/8'],
  ['7', t('少阳'), t('阳'), t('不变'), '3/8'],
  ['8', t('少阴'), t('阴'), t('不变'), '3/8'],
  ['9', t('老阳'), t('阳'), t('变 ○'), '1/8'],
];

const ruleRows = () => [
  [t('无'), t('本卦卦辞')],
  [t('一爻'), t('本卦这一变爻的爻辞')],
  [t('二爻'), t('本卦两变爻的爻辞，以上面一爻为主')],
  [t('三爻'), t('本卦与之卦的卦辞并看，以本卦为主')],
  [t('四爻'), t('之卦两个不变爻的爻辞，以下面一爻为主')],
  [t('五爻'), t('之卦唯一不变爻的爻辞')],
  [t('六爻'), t('乾卦读「用九」，坤卦读「用六」，其余读之卦卦辞')],
];

export function AboutPage() {
  return (
    <Screen title={t('起卦说明')} back="/">
      <div className="prose">
        <section>
          <h2>{t('铜钱法')}</h2>
          <p>
            三枚铜钱同时掷出。各家对正反面的定义有分歧，本应用明确约定：<strong>{t('背面计 3，字面计 2')}</strong>。三枚相加得一爻：
          </p>
          <table className="table">
            <thead>
              <tr>
                <th>{t('和')}</th>
                <th>{t('名称')}</th>
                <th>{t('阴阳')}</th>
                <th>{t('变否')}</th>
                <th>{t('概率')}</th>
              </tr>
            </thead>
            <tbody>
              {coinRows().map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p>{t('掷六次成一卦。第一次为初爻，在最下；第六次为上爻，在最上。卦自下而上生长。')}</p>
        </section>

        <section>
          <h2>{t('五个角度')}</h2>
          <p>{t('同一次摇卦，可以从几个角度去看同一件事：')}</p>
          <table className="table">
            <thead>
              <tr>
                <th>{t('卦')}</th>
                <th>{t('代表什么')}</th>
              </tr>
            </thead>
            <tbody>
              {PERSPECTIVES.map((p) => (
                <tr key={p.key}>
                  <td>
                    {p.label}
                    <br />
                    <span className="muted">{p.role}</span>
                  </td>
                  <td>{p.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>{t('解读页只以本卦和之卦断吉凶，互卦、错卦、综卦是补充的视角，不改变判定。')}</p>
        </section>

        <section>
          <h2>{t('该读哪一句')}</h2>
          <p>{t('依朱熹《易学启蒙》的变占之法，按变爻个数决定：')}</p>
          <table className="table">
            <thead>
              <tr>
                <th>{t('变爻')}</th>
                <th>{t('读什么')}</th>
              </tr>
            </thead>
            <tbody>
              {ruleRows().map(([count, what]) => (
                <tr key={count}>
                  <td>{count}</td>
                  <td>{what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2>{t('梅花易数')}</h2>
          <p>
            另一套起卦法，传为邵雍所创。不摇铜钱，按时间或数起卦，<strong>{t('只有一个动爻')}</strong>，断卦主看体用生克。
          </p>
          <table className="table">
            <thead>
              <tr>
                <th>{t('算什么')}</th>
                <th>{t('怎么算')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t('上卦')}</td>
                <td>{t('（农历年支数 + 月 + 日）÷ 8 取余，余 0 作 8')}</td>
              </tr>
              <tr>
                <td>{t('下卦')}</td>
                <td>{t('上面的和再加时辰数，÷ 8 取余')}</td>
              </tr>
              <tr>
                <td>{t('动爻')}</td>
                <td>{t('同一个和 ÷ 6 取余，余 0 作 6')}</td>
              </tr>
            </tbody>
          </table>
          <p>{t('卦数用先天八卦：乾一、兑二、离三、震四、巽五、坎六、艮七、坤八。年支数子一、丑二，依次到亥十二；时辰同理，二十三点到一点为子时。')}</p>
          <p>
            <strong>{t('体与用')}</strong>：动爻所在的那一卦叫「用」，代表所问之事；另一卦叫「体」，代表你自己。两卦各有五行——乾兑金、震巽木、坎水、离火、坤艮土——按生克定吉凶：用生体大吉，体用比和吉，体克用小吉，体生用是消耗，用克体则凶。
          </p>
          <p>
            要看三卦：<strong>{t('本卦')}</strong>是起头与当下，<strong>{t('互卦')}</strong>是中间的过程，<strong>{t('变卦')}</strong>是最后的结果。
          </p>
          <p>
            有一点和摇铜钱很不一样：<strong>{t('时间起卦没有随机')}</strong>。同一个时辰里起卦，算出来必然是同一卦。所以梅花讲「心动则占」，不讲「卦不可重」。
          </p>
          <p>{t('农历的换算用的是系统自带的中国历数据，闰月按本月数计算。')}</p>
        </section>

        <section>
          <h2>{t('为什么卦不可重')}</h2>
          <p>{t('《蒙》卦卦辞说：')}</p>
          <p className="quote">{t('初筮告，再三渎，渎则不告。')}</p>
          <p>{t('第一次问，才会得到回答；反复追问，是亵渎。能无限重摇的卦，结果就不值得认真对待。所以摇铜钱时每掷出一爻就立刻记下，刷新页面、退出重进，都无法重来。')}</p>
        </section>

        <section>
          <h2>{t('随机从哪里来')}</h2>
          <p>{t('每一枚铜钱的正反，都由系统的密码学随机数（crypto.getRandomValues）决定，并剔除了取模带来的偏差，不使用普通的伪随机函数。长按蓄力的时长只影响动画，不影响结果。')}</p>
        </section>

        <section>
          <h2>{t('经文')}</h2>
          <p>{t('卦辞、爻辞据《周易》通行本，属公有领域，并与维基文库逐条校对。白话解释为本应用原创，只帮你读懂字面，不替你下结论。')}</p>
        </section>

        <section>
          <h2>{t('免责声明')}</h2>
          <p>
            {t('这里给出的是《周易》的经文和预先写好的白话解释，')}
            <strong>{t('仅供参考与自省')}</strong>
            {t('，不是针对你具体处境的专业判断，也不构成医疗、法律、财务、投资或心理方面的建议。')}
          </p>
          <p>{t('身体不适请及时就医，法律与财务上的决定请咨询有资质的人。不要依据卦象做出危及自身或他人安全、健康、财产的决定。应用不预测未来，也不保证任何结果。')}</p>
        </section>

        <section>
          <h2>{t('隐私')}</h2>
          <p>{t('不需要注册，不问出生时间，也不收集任何个人信息。你的问题和卦记只保存在这台设备上，不上传任何服务器——所以也请定期在「卦记 → 备份」里导出一份留着。')}</p>
          <p>
            <a className="link" href={PRIVACY_URL} target="_blank" rel="noreferrer noopener">
              {t('完整的隐私政策')}
            </a>
            {t('。有问题或发现错字，欢迎来信')}{' '}
            <a className="link" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            {t('。')}
          </p>
        </section>
      </div>
    </Screen>
  );
}
