// 梅花易数的象与断（本项目原创文字，取象据《梅花易数》《说卦传》通行说法）
import type { BodyUseRelation, Element } from '../core/meihua';
import type { TrigramName } from '../core/types';

export interface TrigramLore {
  readonly name: TrigramName;
  /** 先天卦数 */
  readonly number: number;
  readonly element: Element;
  /** 自然之象 */
  readonly image: string;
  /** 卦性一词 */
  readonly nature: string;
  /** 人事之象 */
  readonly person: string;
  /** 身体之象，问健康时用得上 */
  readonly body: string;
  /** 事物之象 */
  readonly thing: string;
}

export const TRIGRAM_LORE: Record<TrigramName, TrigramLore> = {
  乾: {
    name: '乾',
    number: 1,
    element: '金',
    image: '天',
    nature: '刚健',
    person: '父、老人、上位者、决断的人',
    body: '头、骨、肺',
    thing: '金玉、圆形之物、车马、高处',
  },
  兑: {
    name: '兑',
    number: 2,
    element: '金',
    image: '泽',
    nature: '喜悦',
    person: '少女、口才好的人、歌者',
    body: '口、舌、喉、肺',
    thing: '言语、饮食、缺口之物、金属器皿',
  },
  离: {
    name: '离',
    number: 3,
    element: '火',
    image: '火',
    nature: '附丽',
    person: '中女、文人、明眼人',
    body: '眼目、心、血',
    thing: '文书、炉火、光亮之物、中空之物',
  },
  震: {
    name: '震',
    number: 4,
    element: '木',
    image: '雷',
    nature: '动',
    person: '长男、急性子、行动快的人',
    body: '足、肝、神经',
    thing: '声响、车、树木、新起之事',
  },
  巽: {
    name: '巽',
    number: 5,
    element: '木',
    image: '风',
    nature: '入',
    person: '长女、商旅、来回奔走的人',
    body: '股、呼吸、胆',
    thing: '风、绳索、草木、消息往来',
  },
  坎: {
    name: '坎',
    number: 6,
    element: '水',
    image: '水',
    nature: '陷',
    person: '中男、劳碌人、心思深的人',
    body: '耳、肾、血液',
    thing: '水、酒、险处、暗中之事',
  },
  艮: {
    name: '艮',
    number: 7,
    element: '土',
    image: '山',
    nature: '止',
    person: '少男、守成的人、固执的人',
    body: '手、背、脾胃',
    thing: '山石、门径、停滞之物、房屋',
  },
  坤: {
    name: '坤',
    number: 8,
    element: '土',
    image: '地',
    nature: '顺',
    person: '母、众人、柔顺的人',
    body: '腹、脾、肌肉',
    thing: '土地、布帛、方形之物、众多之物',
  },
};

export interface RelationLore {
  readonly key: BodyUseRelation;
  readonly label: string;
  /** 吉凶的大判断 */
  readonly verdict: string;
  readonly meaning: string;
}

export const RELATION_LORE: Record<BodyUseRelation, RelationLore> = {
  useGeneratesBody: {
    key: 'useGeneratesBody',
    label: '用生体',
    verdict: '大吉',
    meaning: '外面的力量在滋养你：有人帮、有资源进来，事情顺着你走。该接的就接住，不必客气。',
  },
  sameElement: {
    key: 'sameElement',
    label: '体用比和',
    verdict: '吉',
    meaning: '你和这件事同气相求，彼此合得来。阻力小，照着本来的打算推进就是。',
  },
  bodyOvercomesUse: {
    key: 'bodyOvercomesUse',
    label: '体克用',
    verdict: '小吉',
    meaning: '局面在你手里，你压得住它。能成，但要费些力气，而且赢得不轻松。',
  },
  bodyGeneratesUse: {
    key: 'bodyGeneratesUse',
    label: '体生用',
    verdict: '耗',
    meaning: '你在往外付出：出钱、出力、出心神。事情未必坏，但消耗的是你自己，量力而行。',
  },
  useOvercomesBody: {
    key: 'useOvercomesBody',
    label: '用克体',
    verdict: '凶',
    meaning: '外力压过你：对方强、时势不利、身体吃不消。这一卦不主张硬进，退守或求援为上。',
  },
};

/** 三卦各自看什么 */
export const STAGE_LORE = [
  { key: 'origin', label: '本卦', role: '事情的起头与当下', meaning: '现在的局面，以及体用生克定下的基本吉凶。' },
  { key: 'mutual', label: '互卦', role: '中间的过程', meaning: '事情进行当中会遇到的情形，也常指当事人看不见的内情。' },
  { key: 'changed', label: '变卦', role: '最后的结果', meaning: '动爻一变，事情落到的结局。与本卦合看，才知道是往好里走还是往坏里走。' },
] as const;
