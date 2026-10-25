// 收集所有需要翻译的界面键。
// 两处来源：源码里写死的 t('…')，以及由数据取出、在界面上过 t() 的那些句子。
// 只给测试用：它要读源码，所以引了 node:fs，界面代码不能引这个文件。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LINE_NAME } from '../core/coin';
import { lineTitle } from '../core/hexagram';
import { ELEMENT_OF } from '../core/meihua';
import type { LineIndex, TrigramName } from '../core/types';
import { CATEGORIES, GLOSSARY, PERSPECTIVES } from '../data/guide';
import { RELATION_LORE, STAGE_LORE, TRIGRAM_LORE } from '../data/meihua';
import { OUTCOME_LABEL } from '../store/records';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry.name) && !entry.name.includes('.test.')) out.push(full);
  }
  return out;
}

/** 源码里 t('…') 的第一个参数 */
function fromSource(): string[] {
  const keys: string[] = [];
  for (const file of walk(path.join(ROOT, 'src'))) {
    const src = fs.readFileSync(file, 'utf8');
    for (const m of src.matchAll(/\bt\(\s*'((?:[^'\\]|\\.)*)'/g)) {
      keys.push(m[1].replace(/\\'/g, "'"));
    }
  }
  return keys;
}

/** 从数据里取、在界面上才过 t() 的句子 */
function fromData(): string[] {
  const keys: string[] = [];
  for (const c of CATEGORIES) {
    keys.push(c.label, c.hint, c.reflection);
    if (c.caution) keys.push(c.caution);
  }
  for (const p of PERSPECTIVES) keys.push(p.label, p.role, p.meaning);
  for (const r of Object.values(RELATION_LORE)) keys.push(r.label, r.verdict, r.meaning);
  for (const s of STAGE_LORE) keys.push(s.label, s.role, s.meaning);
  for (const l of Object.values(TRIGRAM_LORE)) keys.push(l.element);
  for (const [, meaning] of GLOSSARY) keys.push(meaning);
  keys.push(...Object.values(OUTCOME_LABEL), ...Object.values(LINE_NAME), ...Object.values(ELEMENT_OF));
  for (let i = 0; i < 6; i++) {
    keys.push(lineTitle(i as LineIndex, true), lineTitle(i as LineIndex, false));
  }
  return keys;
}

/** 全部界面键，去重后按出现顺序 */
export function collectKeys(): string[] {
  return [...new Set([...fromSource(), ...fromData()])];
}

/** 卦名、经文等按语言分包的内容不走这里；这些是 TextPack 的字段，由类型与测试保证完整 */
export const TRIGRAMS: readonly TrigramName[] = Object.keys(TRIGRAM_LORE) as TrigramName[];
