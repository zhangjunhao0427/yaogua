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

export type PerspectiveKey = 'base' | 'changed' | 'mutual' | 'opposite' | 'reversed';

export interface Perspective {
  readonly key: PerspectiveKey;
  readonly label: string;
  /** 一句话定位 */
  readonly role: string;
  /** 怎么来的、代表什么 */
  readonly meaning: string;
}

export const PERSPECTIVES: readonly Perspective[] = [
  {
    key: 'base',
    label: '本卦',
    role: '当下处境',
    meaning: '六次摇卦直接得到的卦，是你此刻实际所处的局面，也是这一卦的起点。',
  },
  {
    key: 'changed',
    label: '之卦',
    role: '事情的走向',
    meaning: '把变爻的阴阳翻转得到的卦，顺着眼下这样走下去会变成的样子。没有变爻就没有之卦，说明局面一时不会动。',
  },
  {
    key: 'mutual',
    label: '互卦',
    role: '中间过程',
    meaning: '取本卦的二、三、四爻作下卦，三、四、五爻作上卦。它藏在本卦里，代表从现在走到结果之间真正起作用的那一段，也常指外面看不见的内情。',
  },
  {
    key: 'opposite',
    label: '错卦',
    role: '事情的反面',
    meaning: '六爻阴阳全部相反的卦。它是你没看到的那一面，也可以看作立场与你相对的一方所处的位置。',
  },
  {
    key: 'reversed',
    label: '综卦',
    role: '换位来看',
    meaning: '把整个卦上下颠倒过来，是同一件事在对方眼里的样子。乾、坤、坎、离、颐、大过、中孚、小过这八个卦颠倒后还是自己，遇到它们，双方看到的是同一幅局面。',
  },
];

export function perspective(key: PerspectiveKey): Perspective {
  const found = PERSPECTIVES.find((p) => p.key === key);
  if (!found) throw new Error(`没有这个视角：${key}`);
  return found;
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
