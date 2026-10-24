// 由 src/data 生成 Widget 用的 Swift 经文表（64 卦卦辞），每日轮换一条。
// 用法：npm run gen:widget
//
// 卦序与八卦表直接从 src/core/hexagram.ts 的源码解析，不另存一份，
// 解析结果当场校验：八卦 8 条、卦序 64 条且 1–64 齐全。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');

function parseTables() {
  const src = read('src/core/hexagram.ts');

  const trigramBlock = src.match(/export const TRIGRAM = \{([\s\S]*?)\} as const/);
  if (!trigramBlock) throw new Error('找不到 TRIGRAM 表');
  const TRIGRAM = Object.fromEntries(
    [...trigramBlock[1].matchAll(/'([01]{3})':\s*'(.)'/g)].map((m) => [m[1], m[2]]),
  );
  if (Object.keys(TRIGRAM).length !== 8) throw new Error(`八卦表应为 8 条，解析到 ${Object.keys(TRIGRAM).length} 条`);

  const kingWenBlock = src.match(/export const KING_WEN[^=]*= \{([\s\S]*?)\};/);
  if (!kingWenBlock) throw new Error('找不到 KING_WEN 表');
  const KING_WEN = Object.fromEntries(
    [...kingWenBlock[1].matchAll(/(..):\s*(\d+)/g)].map((m) => [m[1], Number(m[2])]),
  );
  const numbers = Object.values(KING_WEN);
  if (numbers.length !== 64 || new Set(numbers).size !== 64) {
    throw new Error(`卦序表应为 64 条互不重复，解析到 ${numbers.length} 条`);
  }
  return { TRIGRAM, KING_WEN };
}

/** 卦序 → 六爻阴阳串，初爻在前 */
function bitsByNumber() {
  const { TRIGRAM, KING_WEN } = parseTables();
  const table = new Map();
  for (let mask = 0; mask < 64; mask++) {
    const yang = Array.from({ length: 6 }, (_, i) => (mask >> i) & 1);
    const lower = TRIGRAM[yang.slice(0, 3).join('')];
    const upper = TRIGRAM[yang.slice(3, 6).join('')];
    const number = KING_WEN[upper + lower];
    if (!number) throw new Error(`查不到上${upper}下${lower}`);
    table.set(number, yang.join(''));
  }
  if (table.size !== 64) throw new Error(`应得 64 卦，实得 ${table.size}`);
  return table;
}

const NAMES = (
  '乾 坤 屯 蒙 需 讼 师 比 小畜 履 泰 否 同人 大有 谦 豫 随 蛊 临 观 噬嗑 贲 剥 复 无妄 大畜 颐 大过 坎 离 咸 恒 ' +
  '遁 大壮 晋 明夷 家人 睽 蹇 解 损 益 夬 姤 萃 升 困 井 革 鼎 震 艮 渐 归妹 丰 旅 巽 兑 涣 节 中孚 小过 既济 未济'
).split(' ');

const parts = await Promise.all(
  [1, 2, 3, 4].map((i) => import(pathToFileURL(path.join(root, `src/data/zhouyi/part${i}.ts`)).href)),
);
const texts = parts.flatMap((m, i) => m[`PART_${i + 1}`]);
if (texts.length !== 64) throw new Error(`经文应为 64 卦，实得 ${texts.length}`);

const bits = bitsByNumber();
const swift = (s) => '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';

const rows = texts.map((t, i) => {
  const [original, plain] = t.judgment;
  return (
    `    Passage(name: ${swift(NAMES[i])}, theme: ${swift(t.theme)}, ` +
    `bits: ${swift(bits.get(i + 1))}, original: ${swift(original)}, plain: ${swift(plain)})`
  );
});

const out = `// 本文件由 scripts/generate-widget-data.mjs 生成，请勿手改。
// 来源：src/data/zhouyi（经文据《周易》通行本，白话为本项目原创）

import Foundation

struct Passage {
    let name: String
    let theme: String
    /// 六爻阴阳，初爻在前，1 为阳
    let bits: String
    let original: String
    let plain: String
}

enum Scripture {
    static let judgments: [Passage] = [
${rows.join(',\n')}
    ]

    /// 按日期取当天那一卦，同一天永远是同一条
    static func ofDay(_ date: Date) -> Passage {
        let day = Int(floor(date.timeIntervalSince1970 / 86_400))
        let count = judgments.count
        return judgments[((day % count) + count) % count]
    }
}
`;

const target = 'ios/App/YaoguaWidget/Scripture.swift';
fs.writeFileSync(path.join(root, target), out);
console.log(`生成 ${rows.length} 条到 ${target}`);
