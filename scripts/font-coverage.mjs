// Verify the committed CJK font subsets cover every CJK character in the source.
// Pure JS: WOFF2 tables are Brotli-compressed, and cmap is not transformed, so
// Node can read it without Python, fontTools or system fonts.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { brotliDecompressSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(import.meta.dirname, '..')
const FONT_DIR = join(ROOT, 'src', 'assets', 'fonts')

const TAGS = [
  'cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm',
  'glyf', 'loca', 'prep', 'CFF ', 'VORG', 'EBDT', 'EBLC', 'gasp', 'hdmx', 'kern',
  'LTSH', 'PCLT', 'VDMX', 'vhea', 'vmtx', 'BASE', 'GDEF', 'GPOS', 'GSUB', 'EBSC',
  'JSTF', 'MATH', 'CBDT', 'CBLC', 'COLR', 'CPAL', 'SVG ', 'sbix', 'acnt', 'avar',
  'bdat', 'bloc', 'bsln', 'cvar', 'fdsc', 'feat', 'fmtx', 'fvar', 'gvar', 'hsty',
  'just', 'lcar', 'mort', 'morx', 'opbd', 'prop', 'trak', 'Zapf', 'Silf', 'Glat',
  'Gloc', 'Feat', 'Sill',
]

const CJK_RANGES = [
  [0x2e80, 0x2eff], [0x3000, 0x303f], [0x3040, 0x30ff], [0x3100, 0x312f],
  [0x31a0, 0x31bf], [0x31f0, 0x31ff], [0x3400, 0x4dbf], [0x4e00, 0x9fff],
  [0xf900, 0xfaff], [0xfe30, 0xfe4f], [0xff00, 0xffef],
  [0x20000, 0x2fa1f], [0x30000, 0x323af],
]
// Punctuation the engine sets inside Chinese copy, outside the ranges above.
const CJK_EXTRA = new Set([...'·—…“”‘’「」『』〈〉《》【】（）'])

export function isCjk(cp) {
  if (CJK_EXTRA.has(String.fromCodePoint(cp))) return true
  return CJK_RANGES.some(([a, b]) => cp >= a && cp <= b)
}

function base128(buf, pos) {
  let value = 0
  for (let i = 0; i < 5; i++) {
    if (pos >= buf.length) throw new Error('truncated UIntBase128')
    const b = buf[pos++]
    if (i === 0 && b === 0x80) throw new Error('invalid UIntBase128')
    value = value * 128 + (b & 0x7f)
    if (!(b & 0x80)) return [value, pos]
  }
  throw new Error('UIntBase128 too long')
}

function cmapTable(woff2) {
  if (woff2.toString('latin1', 0, 4) !== 'wOF2') throw new Error('not a WOFF2 file')
  const numTables = woff2.readUInt16BE(12)
  let pos = 48
  const tables = []
  for (let i = 0; i < numTables; i++) {
    const flags = woff2[pos++]
    const tagIndex = flags & 0x3f
    const transform = (flags >> 6) & 3
    let tag
    if (tagIndex === 63) {
      tag = woff2.toString('latin1', pos, pos + 4)
      pos += 4
    } else {
      tag = TAGS[tagIndex]
      if (!tag) throw new Error(`unknown table tag index ${tagIndex}`)
    }
    let origLength
    ;[origLength, pos] = base128(woff2, pos)
    let length = origLength
    const transformed = tag === 'glyf' || tag === 'loca' ? transform === 0 : transform !== 0
    if (transformed) {
      let transformLength
      ;[transformLength, pos] = base128(woff2, pos)
      length = transformLength
    }
    tables.push({ tag, length })
  }
  const compressedSize = woff2.readUInt32BE(20)
  const data = brotliDecompressSync(woff2.subarray(pos, pos + compressedSize))
  let offset = 0
  for (const table of tables) {
    table.data = data.subarray(offset, offset + table.length)
    offset += table.length
  }
  const cmap = tables.find((t) => t.tag === 'cmap')
  if (!cmap) throw new Error('no cmap table')
  return cmap.data
}

function codepoints(cmap) {
  const points = new Set()
  const numTables = cmap.readUInt16BE(2)
  const offsets = new Set()
  for (let i = 0; i < numTables; i++) {
    const p = 4 + i * 8
    const platform = cmap.readUInt16BE(p)
    const encoding = cmap.readUInt16BE(p + 2)
    const offset = cmap.readUInt32BE(p + 4)
    if (platform === 0 || (platform === 3 && [0, 1, 10].includes(encoding))) offsets.add(offset)
  }
  for (const offset of offsets) {
    if (offset + 2 > cmap.length) continue
    const format = cmap.readUInt16BE(offset)
    if (format === 0) {
      for (let c = 0; c < 256; c++) if (cmap[offset + 6 + c]) points.add(c)
    } else if (format === 4) {
      const segCount = cmap.readUInt16BE(offset + 6) / 2
      const end = offset + 14
      const start = end + segCount * 2 + 2
      const delta = start + segCount * 2
      const range = delta + segCount * 2
      for (let i = 0; i < segCount; i++) {
        const last = cmap.readUInt16BE(end + i * 2)
        const first = cmap.readUInt16BE(start + i * 2)
        if (first > last || first === 0xffff) continue
        const d = cmap.readInt16BE(delta + i * 2)
        const ro = cmap.readUInt16BE(range + i * 2)
        for (let c = first; c <= last; c++) {
          let glyph
          if (ro === 0) {
            glyph = (c + d) & 0xffff
          } else {
            const at = range + i * 2 + ro + (c - first) * 2
            if (at + 2 > cmap.length) continue
            glyph = cmap.readUInt16BE(at)
            if (glyph) glyph = (glyph + d) & 0xffff
          }
          if (glyph) points.add(c)
        }
      }
    } else if (format === 6) {
      const first = cmap.readUInt16BE(offset + 6)
      const count = cmap.readUInt16BE(offset + 8)
      for (let i = 0; i < count; i++) if (cmap.readUInt16BE(offset + 10 + i * 2)) points.add(first + i)
    } else if (format === 12) {
      const groups = cmap.readUInt32BE(offset + 12)
      for (let i = 0; i < groups; i++) {
        const p = offset + 16 + i * 12
        if (p + 12 > cmap.length) break
        const first = cmap.readUInt32BE(p)
        const last = cmap.readUInt32BE(p + 4)
        const glyph = cmap.readUInt32BE(p + 8)
        if (!glyph) continue
        for (let c = first; c <= last; c++) points.add(c)
      }
    }
  }
  return points
}

function sourceFiles() {
  const out = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name)
      if (entry.isDirectory()) walk(p)
      else if (/\.(?:ts|tsx|css|html)$/.test(entry.name)) out.push(p)
    }
  }
  walk(join(ROOT, 'src'))
  for (const name of readdirSync(ROOT)) {
    if (name.endsWith('.html') && statSync(join(ROOT, name)).isFile()) out.push(join(ROOT, name))
  }
  return out
}

let coveredCache

/** Code points covered by any committed CJK subset. */
export function coveredCjk() {
  if (coveredCache) return coveredCache
  const fonts = readdirSync(FONT_DIR).filter((f) => /^noto-.*\.woff2$/.test(f))
  const covered = new Set()
  for (const file of fonts) {
    for (const cp of codepoints(cmapTable(readFileSync(join(FONT_DIR, file))))) covered.add(cp)
  }
  coveredCache = covered
  return covered
}

/** CJK characters in `text` that no committed subset can render. */
export function missingCjk(text) {
  const covered = coveredCjk()
  const missing = new Set()
  for (const ch of text) {
    const cp = ch.codePointAt(0)
    if (isCjk(cp) && !covered.has(cp)) missing.add(ch)
  }
  return [...missing].sort()
}

function main() {
  const used = new Map()
  for (const file of sourceFiles()) {
    let text = readFileSync(file, 'utf8')
    // Character-class regexes such as /[一-鿿]/ name range endpoints; they are
    // code, not copy, so they must not count as rendered characters.
    text = text.replace(/\/\[[^\]\n]*[\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef][^\]\n]*\]\/[a-z]*/g, '')
    for (const ch of text) {
      const cp = ch.codePointAt(0)
      if (isCjk(cp)) used.set(ch, (used.get(ch) ?? 0) + 1)
    }
  }
  const fonts = readdirSync(FONT_DIR).filter((f) => /^noto-.*\.woff2$/.test(f)).sort()
  if (!fonts.length) {
    console.error(`font coverage: no CJK subsets in ${FONT_DIR}`)
    process.exit(1)
  }
  let failed = false
  for (const file of fonts) {
    const points = codepoints(cmapTable(readFileSync(join(FONT_DIR, file))))
    const missing = [...used.keys()].filter((ch) => !points.has(ch.codePointAt(0))).sort()
    if (missing.length) {
      failed = true
      console.error(`font coverage: ${file} is missing ${missing.length} character(s):`)
      for (const ch of missing) console.error(`  ${ch}  U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`)
    } else {
      console.log(`font coverage: ${file} covers all ${used.size} CJK characters`)
    }
  }
  if (failed) {
    console.error('font coverage: run `npm run fonts` in a checkout with Python, fontTools and Noto CJK, then re-run `npm run fonts:verify`.')
    process.exit(1)
  }
  console.log(`font coverage: OK — ${fonts.length} subset(s), ${used.size} CJK characters in source text`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
