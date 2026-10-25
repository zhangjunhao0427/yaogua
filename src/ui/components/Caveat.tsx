import { Link } from 'react-router-dom';
import { t } from '../../i18n';

/**
 * 解读页末尾的提醒。卦讲的是姿态，不是诊断，
 * 这句话要在每一次解读的末尾出现，而不是只藏在说明页里。
 */
export function Caveat() {
  return (
    <p className="small muted center caveat">
      {t('卦是用来照见自己的，不替代医疗、法律或财务上的专业判断。身体不适请就医。')}
      <br />
      <Link className="link" to="/about">
        {t('起卦说明')}
      </Link>
    </p>
  );
}
