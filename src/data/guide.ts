// 立问与解读的引导文案（本项目原创）

export type Category = 'career' | 'relationship' | 'decision' | 'recent';

export interface CategoryInfo {
  readonly id: Category;
  readonly label: string;
  /** 输入框为空时填入的开头 */
  readonly starter: string;
  readonly reflection: string;
}

export const CATEGORIES: readonly CategoryInfo[] = [
  {
    id: 'career',
    label: '事业',
    starter: '在工作上，我该如何',
    reflection: '这件事里，哪一部分是你真正能掌控的？把经文提示的姿态放到那一部分，会是什么样子？',
  },
  {
    id: 'relationship',
    label: '关系',
    starter: '在这段关系里，我该如何',
    reflection: '对方此刻可能处在什么位置？经文里的姿态，说的是你，还是这段关系本身？',
  },
  {
    id: 'decision',
    label: '抉择',
    starter: '面对这个选择，我该如何',
    reflection: '把两个选项都按这句话去做一遍，哪一个做起来更自然？',
  },
  {
    id: 'recent',
    label: '近况',
    starter: '最近这段时间，我该如何',
    reflection: '这段时间，你最想「止」住的是什么？最想再「进」一步的又是什么？',
  },
];

export const CATEGORY_IDS: readonly Category[] = CATEGORIES.map((c) => c.id);

/** 「会不会」「能不能」这类是非题，提示改为开放式问题 */
export function isClosedQuestion(question: string): boolean {
  return /会不会|能不能|是不是|可不可以|有没有|行不行|吗[？?]?\s*$/.test(question.trim());
}

export function reflectionPrompts(
  category: Category | null,
  names: { readonly base: string; readonly changed: string | null },
): string[] {
  const prompts = [
    '读到的这句话里，哪个词最先触动你？它让你想到了问题里的哪个具体处境？',
    names.changed
      ? `从「${names.base}」到「${names.changed}」，变化的方向是什么？你愿意往那边走吗？`
      : `「${names.base}」六爻不变，眼下的局面会持续一阵。在不变之中，你能先做好的一件事是什么？`,
  ];
  const info = CATEGORIES.find((c) => c.id === category);
  if (info) prompts.push(info.reflection);
  prompts.push('先把答案放一放。七天后回来看，你希望那时的自己做了什么？');
  return prompts;
}

/** 常见断辞释义，按出现先后展示 */
export const GLOSSARY: readonly (readonly [term: string, meaning: string])[] = [
  ['元亨', '大为亨通'],
  ['亨', '通达顺畅'],
  ['利贞', '利于守持正道'],
  ['贞', '守持正道；也有占问之义'],
  ['孚', '诚信'],
  ['吉', '吉祥，结果顺遂'],
  ['凶', '凶险，结果不利'],
  ['悔亡', '悔恨消失'],
  ['悔', '懊悔，做了之后会后悔'],
  ['吝', '憾惜，有小困难、小遗憾'],
  ['厉', '危险，须警惕'],
  ['无咎', '没有过失，不会招致责难'],
  ['利涉大川', '适合渡过大河，喻可以冒险做大事'],
  ['利见大人', '适合去见德高位尊、能给予帮助的人'],
  ['有攸往', '有所前往，指采取行动'],
  ['征', '前进、出行，也指征伐'],
];

export function glossaryFor(texts: readonly string[]): (readonly [string, string])[] {
  const joined = texts.join('');
  return GLOSSARY.filter(([term]) => joined.includes(term));
}
