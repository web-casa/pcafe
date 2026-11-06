// Rebuilds src/assets/emoji/ from the published icon packages. Only needed to change the set.
// usage: node scripts/build-emoji.mjs <dir with unpacked npm packs> <emoji-test.txt>
//   npm pack @iconify-json/fluent-emoji @iconify-json/fluent-emoji-flat @iconify-json/noto, then unpack each into <dir>/<name>/
//   emoji-test.txt: https://unicode.org/Public/emoji/latest/emoji-test.txt
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { gzipSync } from 'node:zlib'

const [dir, testFile] = process.argv.slice(2)
if (!dir || !testFile) {
  console.error('usage: build-emoji <packs dir> <emoji-test.txt>')
  process.exit(2)
}
const OUT = resolve(import.meta.dirname, '..', 'src', 'assets', 'emoji')
const pack = (prefix) => {
  const name = readdirSync(dir).find((d) => d.startsWith(prefix) && !d.endsWith('.tgz') && (prefix.endsWith('flat') || !d.includes('flat')))
  return JSON.parse(readFileSync(join(dir, name, 'package', 'icons.json'), 'utf8'))
}
const body = (set, name) => set.icons[name]?.body ?? set.icons[set.aliases?.[name]?.parent]?.body
const SETS = { fluent: pack('iconify-json-fluent-emoji'), flat: pack('iconify-json-fluent-emoji-flat'), noto: pack('iconify-json-noto') }
const slug = (s) => s.toLowerCase().replace(/[’“”]/g, '').replace(/[^a-z0-9#*]+/g, '-').replace(/^-|-$/g, '')
// Flags are left out on purpose: Windows shows them as letters, and a national flag is not decoration.
const SKIP_SUBGROUPS = new Set(['country-flag', 'subdivision-flag'])
const TONES = /1F3F[B-F]/

const out = { fluent: {}, flat: {}, noto: {} }
const index = []
let group = ''
let subgroup = ''
let missing = 0
for (const line of readFileSync(testFile, 'utf8').split('\n')) {
  if (line.startsWith('# group:')) group = line.slice(8).trim()
  else if (line.startsWith('# subgroup:')) subgroup = line.slice(11).trim()
  if (line.startsWith('#') || !line.includes('; fully-qualified') || TONES.test(line) || SKIP_SUBGROUPS.has(subgroup)) continue
  const char = String.fromCodePoint(...line.split(';')[0].trim().split(/\s+/).map((c) => parseInt(c, 16)))
  const name = slug(line.replace(/^.*E\d+\.\d+ /, '').trim())
  const svgs = Object.fromEntries(Object.entries(SETS).map(([k, set]) => {
    const b = body(set, name)
    return [k, b && `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${set.width ?? 32} ${set.height ?? 32}">${b}</svg>`]
  }))
  if (Object.values(svgs).some((v) => !v)) { missing++; continue }
  index.push([char, name, group, subgroup])
  for (const k of Object.keys(out)) out[k][char] = svgs[k]
}
mkdirSync(OUT, { recursive: true })
writeFileSync(join(OUT, 'index.json'), JSON.stringify(index))
for (const [k, v] of Object.entries(out)) writeFileSync(join(OUT, `${k}.json.gz`), gzipSync(JSON.stringify(v), { level: 9 }))
console.log(`${index.length} emoji written, ${missing} skipped because a set lacks them`)
