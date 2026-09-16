// 经文校验：抓取维基文库《周易》各卦页面，繁转简后与 src/data/zhouyi 逐条比对（忽略标点）。
// 用法：npm run verify:text（首次需联网，页面缓存于 node_modules/.cache/zhouyi）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import OpenCC from 'opencc-js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cacheDir = path.join(root, 'node_modules/.cache/zhouyi');

/** 维基文库页面标题，文王卦序 */
const PAGES = (
  '乾 坤 屯 蒙 需 訟 師 比 小畜 履 泰 否 同人 大有 謙 豫 隨 蠱 臨 觀 噬嗑 賁 剝 復 无妄 大畜 頤 大過 坎 離 咸 恒 ' +
  '遯 大壯 晉 明夷 家人 睽 蹇 解 損 益 夬 姤 萃 升 困 井 革 鼎 震 艮 漸 歸妹 豐 旅 巽 兌 渙 節 中孚 小過 既濟 未濟'
).split(' ');

/** 已人工核对的取字差异：[维基文库转换结果, 本项目取字, 原因] */
const ACCEPTED = [
  ['号啕', '号咷', '转换工具把咷转成啕，通行本作咷'],
  ['天佑', '天祐', '转换工具把祐转成佑，通行本作祐'],
  ['㧑', '撝', '㧑为扩展区生僻字形，手机字体可能缺字'],
  ['𬙊', '纆', '同上'],
  ['𫗧', '餗', '同上'],
  ['𦈡', '繻', '同上'],
  ['遯', '遁', '遁为规范简体'],
  ['踟躅', '蹢躅', '转换工具误转，通行本作蹢躅'],
  ['见沫', '见沬', '沬指小星，转换或录入误作沫'],
  ['有他', '有它', '通行本作它'],
  ['无袛', '无祗', '维基文库录入误作衣旁'],
  ['乾胏', '干胏', '此处乾义为干燥，简体作干'],
  ['乾肉', '干肉', '同上'],
  ['不复远', '不远复', '维基文库倒文，通行本作不远复'],
];

const t2s = OpenCC.Converter({ from: 't', to: 'cn' });
// 卦名「乾」不能被转成「干」，先保护起来
const toSimplified = (s) => t2s(s.replaceAll('乾', '')).replaceAll('', '乾');
const bare = (s) => s.replace(/[\s，。；：、？！「」『』,.;:?!]/g, '');
const accept = (s) => ACCEPTED.reduce((acc, [from, to]) => acc.replaceAll(from, to), s);

async function fetchPage(i) {
  const file = path.join(cacheDir, `${String(i + 1).padStart(2, '0')}.txt`);
  if (fs.existsSync(file)) return fs.readFileSync(file, 'utf8');
  const url = `https://zh.wikisource.org/w/index.php?title=${encodeURIComponent('周易/' + PAGES[i])}&action=raw`;
  const res = await fetch(url, { headers: { 'User-Agent': 'yaogua-text-verify/1.0' } });
  if (!res.ok) throw new Error(`${PAGES[i]}：HTTP ${res.status}`);
  const raw = await res.text();
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(file, raw);
  await new Promise((r) => setTimeout(r, 300));
  return raw;
}

/** 解析「易經：」区块：首条为卦辞，其后为爻辞；*** 开头的行是上一条的续行 */
function parse(raw, pageName) {
  const start = raw.indexOf("'''易經：'''");
  if (start < 0) throw new Error(`${pageName}：找不到易經区块`);
  const items = [];
  for (const line of raw.slice(start).split('\n').slice(1)) {
    if (!line.includes('color:blue')) break;
    const text = toSimplified(
      line
        .replace(/<[^>]+>/g, '')
        .replace(/'''/g, '')
        .replace(/\{\{[^}]*\}\}/g, '')
        .replace(/-\{(?:[^|}]*\|)?([^}]*)\}-/g, '$1'),
    );
    const body = text.replace(/^[*#:]+/, '').trim();
    if (text.startsWith('***')) {
      items[items.length - 1].text += body;
    } else if (items.length === 0) {
      const k = body.indexOf('：');
      const title = k < 0 ? '' : body.slice(0, k);
      // 如坎卦卦辞以「习坎」起首，标题即经文的一部分
      const lead = title && title !== toSimplified(pageName) ? title : '';
      items.push({ title: '卦辞', text: k < 0 ? body : lead + body.slice(k + 1) });
    } else {
      const k = body.search(/[：，]/);
      items.push({ title: body.slice(0, k), text: body.slice(k + 1) });
    }
  }
  return items;
}

const parts = await Promise.all(
  [1, 2, 3, 4].map((i) => import(pathToFileURL(path.join(root, `src/data/zhouyi/part${i}.ts`)).href)),
);
const data = parts.flatMap((m, i) => m[`PART_${i + 1}`]);

let checked = 0;
let diffs = 0;
for (let i = 0; i < 64; i++) {
  const source = parse(await fetchPage(i), PAGES[i]);
  const local = [
    { title: '卦辞', text: data[i].judgment[0] },
    ...[...data[i].lines, ...(data[i].extra ? [data[i].extra] : [])].map(([title, text]) => ({ title, text })),
  ];
  if (source.length !== local.length) {
    diffs++;
    console.log(`第 ${i + 1} 卦：条数不同，维基文库 ${source.length}，本地 ${local.length}`);
    continue;
  }
  source.forEach((s, j) => {
    checked++;
    if (s.title !== local[j].title || accept(bare(s.text)) !== bare(local[j].text)) {
      diffs++;
      console.log(`第 ${i + 1} 卦 ${local[j].title}\n  维基文库：${s.title}：${s.text}\n  本地：    ${local[j].text}`);
    }
  });
}

console.log(`共比对 ${checked} 条，不一致 ${diffs} 条（已核对的取字差异 ${ACCEPTED.length} 类不计）`);
process.exit(diffs === 0 ? 0 : 1);
