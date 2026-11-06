// Generates the Traditional Chinese (Taiwan) docs from the Simplified ones, so
// only zh-CN is maintained by hand. OpenCC `cn → twp` (Taiwan phrases) plus a
// small table of PCafe terms. usage: npm run docs (runs after gen-docs), or
// node scripts/zh-tw.mjs --check to fail when a zh-TW file is out of date.
import { toTraditional } from './zh-tw-convert.mjs'
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
function convert(text) {
  // Links to the Simplified docs become links to the Traditional ones.
  return toTraditional(text).replaceAll('docs/zh-CN/', 'docs/zh-TW/').replaceAll('../zh-CN/', '../zh-TW/')
}

/** Language switchers name both scripts; fix them after the blanket link rewrite. */
function switchers(text, file) {
  return text
    .replace('[English](README.md) · **簡體中文** · [繁體中文](README.zh-TW.md)', '[English](README.md) · [简体中文](README.zh-CN.md) · **繁體中文**')
    .replace('· [繁體中文](../zh-TW/README.md)', '· [简体中文](../zh-CN/README.md)')
}

const NOTE = '<!-- 本檔案由 scripts/zh-tw.mjs 從簡體中文自動轉換產生，請改簡體原文後執行 npm run docs。 -->\n'

const pairs = []
for (const f of readdirSync(join(ROOT, 'docs', 'zh-CN'))) if (f.endsWith('.md')) pairs.push([`docs/zh-CN/${f}`, `docs/zh-TW/${f}`])
pairs.push(['README.zh-CN.md', 'README.zh-TW.md'])
pairs.push(['skills/pcafe/SKILL.md', 'skills/pcafe/SKILL.zh-TW.md'])

const check = process.argv.includes('--check')
const stale = []
for (const [from, to] of pairs) {
  const src = readFileSync(join(ROOT, from), 'utf8')
  let out = switchers(convert(src), to)
  // A skill file must start with its front matter; put the note after it.
  if (out.startsWith('---\n')) {
    const end = out.indexOf('\n---\n', 4) + 5
    out = out.slice(0, end) + NOTE + out.slice(end)
  } else out = NOTE + out
  const target = join(ROOT, to)
  const old = existsSync(target) ? readFileSync(target, 'utf8') : ''
  if (old === out) continue
  if (check) stale.push(to)
  else writeFileSync(target, out)
}
if (check && stale.length) {
  console.error(`zh-TW out of date (run npm run docs): ${stale.join(', ')}`)
  process.exit(1)
}
console.log(`zh-TW: ${pairs.length} files ${check ? 'up to date' : 'converted'}`)
