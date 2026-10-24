/**
 * 农历换算，用系统自带的中国历（ICU），不自己维护农历表。
 * 梅花时间起卦要的是农历年支、月、日与时辰地支。
 */
import { EARTHLY_BRANCHES, hourBranchOf, type LunarMoment } from '../core/meihua';

const MONTHS = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'] as const;

export interface LunarDate extends LunarMoment {
  /** 如「丙午年九月十五 午时」 */
  readonly label: string;
  readonly leapMonth: boolean;
}

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;

/** 农历日的中文写法：初一、十五、廿三、三十 */
function dayLabel(day: number): string {
  const digits = ['十', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  if (day <= 10) return '初' + (day === 10 ? '十' : digits[day]);
  if (day < 20) return '十' + digits[day - 10];
  if (day === 20) return '二十';
  if (day < 30) return '廿' + digits[day - 20];
  return '三十';
}

interface ChineseParts {
  year: number;
  month: string;
  day: number;
}

function chineseParts(date: Date): ChineseParts {
  const parts = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: 'Asia/Shanghai',
  }).formatToParts(date);
  const pick = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return {
    // relatedYear 是对应的公历年，用来推干支
    year: Number(pick('relatedYear') || pick('year')),
    month: pick('month'),
    day: Number(pick('day')),
  };
}

/** 公历年推农历年的干支。1984 年为甲子 */
function stemBranchOfYear(year: number): { stem: string; branchIndex: number } {
  const offset = ((year - 1984) % 60 + 60) % 60;
  return { stem: HEAVENLY_STEMS[offset % 10], branchIndex: offset % 12 };
}

export function lunarOf(date: Date): LunarDate {
  const parts = chineseParts(date);
  const leapMonth = parts.month.startsWith('闰');
  const monthName = leapMonth ? parts.month.slice(1) : parts.month;
  // ICU 给的是「正月」「冬月」这类名字，转回数字；闰月按本月数算
  const monthIndex = MONTHS.findIndex((m) => monthName.startsWith(m));
  const month = monthIndex >= 0 ? monthIndex + 1 : Number(monthName.replace(/[^0-9]/g, '')) || 1;

  const { stem, branchIndex } = stemBranchOfYear(parts.year);
  // 中文区的 format 会带上「时」字，取 parts 才拿得到纯数字；h23 保证是 0–23
  const hourText = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hourCycle: 'h23',
    timeZone: 'Asia/Shanghai',
  })
    .formatToParts(date)
    .find((p) => p.type === 'hour')?.value;
  const hourBranch = hourBranchOf(Number(hourText) % 24);

  return {
    yearBranch: branchIndex + 1,
    month,
    day: parts.day,
    hourBranch,
    leapMonth,
    label:
      `${stem}${EARTHLY_BRANCHES[branchIndex]}年` +
      `${leapMonth ? '闰' : ''}${MONTHS[month - 1]}月${dayLabel(parts.day)}` +
      ` ${EARTHLY_BRANCHES[hourBranch - 1]}时`,
  };
}
