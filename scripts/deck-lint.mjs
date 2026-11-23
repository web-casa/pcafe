// Whole-deck structure hints for long decks: printed with `check`, never a failure.
// Reads the deck manifest (`index.tsx`) and follows explicit local imports in
// manifest order so modular multi-file decks are linted accurately without
// accidentally scanning arbitrary helper files or comments.
// usage: node scripts/deck-lint.mjs <deck-folder> | --self-test
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve, sep } from 'node:path'

const LONG = 20
const AGENDA = /^(Agenda|PillAgenda|IndexStack|ChapterProgress)$/
const SECTION = /^(SectionBreak|RibbonSection|ChapterProgress)$/
const CLOSING = /Closing$/

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Strip JS/TS comments while preserving string/template literals and all newlines
 * so line numbers stay exact and strings like 'src/**\/*.tsx' or 'http://...' are untouched.
 */
function stripComments(src) {
  let out = ''
  let i = 0
  const n = src.length
  while (i < n) {
    const ch = src[i]
    const next = src[i + 1]
    if (ch === "'" || ch === '"' || ch === '`') {
      const quote = ch
      out += ch
      i++
      while (i < n) {
        const c = src[i]
        out += c
        i++
        if (c === '\\' && i < n) {
          out += src[i]
          i++
        } else if (c === quote) {
          break
        }
      }
      continue
    }
    if (ch === '/' && next === '/') {
      i += 2
      while (i < n && src[i] !== '\n') { out += ' '; i++ }
      continue
    }
    if (ch === '/' && next === '*') {
      out += '  '
      i += 2
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) {
        out += src[i] === '\n' ? '\n' : ' '
        i++
      }
      if (i < n) { out += '  '; i += 2 }
      continue
    }
    out += ch
    i++
  }
  return out
}

/** Blank string literal contents (preserving length & newlines) so identifier regexes never match inside quotes. */
function blankStrings(src) {
  let out = ''
  let i = 0
  const n = src.length
  while (i < n) {
    const ch = src[i]
    if (ch === "'" || ch === '"' || ch === '`') {
      const quote = ch
      out += quote
      i++
      while (i < n) {
        const c = src[i]
        if (c === '\\' && i + 1 < n) {
          out += src[i + 1] === '\n' ? ' \n' : '  '
          i += 2
        } else if (c === quote) {
          out += quote
          i++
          break
        } else {
          out += c === '\n' ? '\n' : ' '
          i++
        }
      }
      continue
    }
    out += ch
    i++
  }
  return out
}

/** Slides in source order: the first JSX component each render returns, its line, and whether it builds. */
export function readSlides(src, file = 'deck', lineOffset = 0) {
  const clean = stripComments(src)
  const out = []
  const re = /render:\s*\(\)\s*=>\s*\(?\s*<([A-Z][A-Za-z0-9]*)/g
  for (const m of clean.matchAll(re)) {
    const before = clean.slice(Math.max(0, m.index - 400), m.index)
    const own = before.slice(before.lastIndexOf('{'))
    out.push({ comp: m[1], file, line: lineOffset + clean.slice(0, m.index).split('\n').length, build: /build:\s*'(reveal|focus)'/.test(own) })
  }
  return out
}

function resolveLocalModule(baseDir, spec) {
  if (!spec.startsWith('./') && !spec.startsWith('../')) return null
  const base = resolve(baseDir, spec)
  for (const cand of [base, `${base}.tsx`, `${base}.ts`, join(base, 'index.tsx'), join(base, 'index.ts')]) {
    if (existsSync(cand) && statSync(cand).isFile() && !cand.endsWith('.css') && !cand.endsWith('.json')) return cand
  }
  return null
}

/** Find the balanced `[...]` slice right after `slides:` so trailing arrays in the file are never swallowed. */
function extractSlidesArray(clean) {
  const masked = blankStrings(clean)
  const m = masked.match(/\bslides\s*:\s*\[/)
  if (!m) return null
  const openIdx = m.index + m[0].length - 1
  let depth = 0
  for (let i = openIdx; i < masked.length; i++) {
    const c = masked[i]
    if (c === '[') depth++
    else if (c === ']') {
      depth--
      if (depth === 0) {
        return {
          start: openIdx + 1,
          end: i,
          cleanSlice: clean.slice(openIdx + 1, i),
          maskedSlice: masked.slice(openIdx + 1, i),
        }
      }
    }
  }
  return null
}

/** Extract slides belonging to a specific named export (when a file exports multiple slide arrays). */
function readExportedSlides(fileSrc, exportName, fileRel) {
  if (!exportName || exportName === 'default') return readSlides(fileSrc, fileRel)
  const clean = stripComments(fileSrc)
  const re = new RegExp(`export\\s+(?:const|let|var)\\s+${escapeRegExp(exportName)}\\b`)
  const m = clean.match(re)
  if (!m) return readSlides(fileSrc, fileRel)
  const rest = clean.slice(m.index)
  const nextExport = rest.slice(1).search(/\nexport\s+(?:const|let|var|function|default)\b/)
  const section = nextExport >= 0 ? rest.slice(0, nextExport + 1) : rest
  const lineOffset = clean.slice(0, m.index).split('\n').length - 1
  const found = readSlides(section, fileRel, lineOffset)
  return found.length ? found : readSlides(fileSrc, fileRel)
}

/**
 * Parse explicit relative imports from `index.tsx` and read slides in the order
 * they appear inside the `slides: [...]` manifest.
 */
export function readDeckSlides(dir, root = process.cwd()) {
  const entry = join(dir, 'index.tsx')
  if (!existsSync(entry)) return []
  const src = readFileSync(entry, 'utf8')
  const clean = stripComments(src)
  const entryRel = relative(root, entry)

  // Parse each top-level import statement individually so semicolon-less external imports
  // never swallow subsequent local slide imports.
  const dirAbs = resolve(dir)
  const dirPrefix = dirAbs.endsWith(sep) ? dirAbs : dirAbs + sep
  const identToBinding = new Map()
  const importRe = /^[ \t]*import\s+(type\s+)?((?:(?![\r\n][ \t]*import\b)[\s\S])*?)\s+from\s+['"]([^'"]+)['"]/gm
  for (const m of clean.matchAll(importRe)) {
    if (m[1]) continue // skip `import type ...`
    const clause = m[2].trim()
    const spec = m[3]
    if (!spec.startsWith('./') && !spec.startsWith('../')) continue
    if (/\bfrom\b/.test(clause)) continue
    const resolved = resolveLocalModule(dirname(entry), spec)
    if (!resolved || !resolved.startsWith(dirPrefix)) continue
    const named = clause.match(/\{([^}]+)\}/)
    if (named) {
      for (const part of named[1].split(',')) {
        const cleaned = part.replace(/^\s*type\s+/, '').trim()
        if (!cleaned) continue
        const [orig, alias] = cleaned.split(/\s+as\s+/i).map((s) => s.trim())
        const local = alias || orig
        if (local) identToBinding.set(local, { file: resolved, exportName: orig })
      }
    }
    const def = clause.replace(/\{[^}]*\}/, '').replace(/,/g, '').trim()
    if (def && /^[A-Za-z_$][\w$]*$/.test(def)) identToBinding.set(def, { file: resolved, exportName: 'default' })
  }

  const arr = extractSlidesArray(clean)
  if (!arr || !identToBinding.size) {
    return readSlides(src, entryRel)
  }

  const events = []
  const inlineRe = /render:\s*\(\)\s*=>\s*\(?\s*<([A-Z][A-Za-z0-9]*)/g
  for (const m of arr.cleanSlice.matchAll(inlineRe)) {
    const absIdx = arr.start + m.index
    const before = clean.slice(Math.max(0, absIdx - 400), absIdx)
    const own = before.slice(before.lastIndexOf('{'))
    events.push({
      pos: m.index,
      slides: [{ comp: m[1], file: entryRel, line: clean.slice(0, absIdx).split('\n').length, build: /build:\s*'(reveal|focus)'/.test(own) }],
    })
  }
  const fileCache = new Map()
  const readCached = (f) => {
    if (!fileCache.has(f)) fileCache.set(f, readFileSync(f, 'utf8'))
    return fileCache.get(f)
  }
  for (const [ident, binding] of identToBinding) {
    // Match only identifier/spread positions in the string-blanked slides array (handles `$` identifiers too).
    const refRe = new RegExp(`(?<![\\w$.])(?:\\.\\.\\.)?${escapeRegExp(ident)}(?![\\w$:])`, 'g')
    for (const m of arr.maskedSlice.matchAll(refRe)) {
      const fileSlides = readExportedSlides(readCached(binding.file), binding.exportName, relative(root, binding.file))
      if (fileSlides.length) events.push({ pos: m.index, slides: fileSlides })
    }
  }
  events.sort((a, b) => a.pos - b.pos)
  const ordered = events.flatMap((e) => e.slides)
  return ordered.length ? ordered : readSlides(src, entryRel)
}

export function lintSlides(slides, defaultFile = 'deck') {
  const hints = []
  const n = slides.length
  const add = (id, slide, text, hint) => hints.push({ id, code: `deck.${id}`, file: slide?.file ?? defaultFile, line: slide?.line ?? 1, text, hint })
  if (n >= LONG) {
    if (!slides.some((s) => AGENDA.test(s.comp))) add('no-agenda', slides[0], `${n} slides, no agenda`, 'A long deck needs a map: add Agenda, PillAgenda or IndexStack after the cover.')
    const sec = slides.filter((s) => SECTION.test(s.comp)).length
    if (sec < 2) add('few-sections', slides[0], `${n} slides, ${sec} section break${sec === 1 ? '' : 's'}`, 'Split it into 3–5 chapters, each opened by SectionBreak, so listeners know where they are.')
    if (!CLOSING.test(slides[n - 1]?.comp ?? '')) add('no-closing', slides[n - 1], `last slide is ${slides[n - 1]?.comp}`, 'End a long deck with a Closing slide that repeats the 2–3 takeaways.')
  }
  let run = 1
  for (let i = 1; i <= n; i++) {
    if (i < n && slides[i].comp === slides[i - 1].comp) { run += 1; continue }
    if (run >= 4) add('repeat', slides[i - run], `${slides[i - 1].comp} ${run} times in a row`, 'Several slides in a row look the same: vary the template or merge them.')
    run = 1
  }
  const builds = slides.filter((s) => s.build).length
  if (n >= 6 && builds > n / 3) add('builds', slides.find((s) => s.build), `${builds} of ${n} slides use build`, 'Keep build steps to at most a third of the slides, or the speaker presses too often.')
  return hints
}

export function deckLint(dir, root = process.cwd()) {
  const f = join(dir, 'index.tsx')
  if (!existsSync(f)) return []
  return lintSlides(readDeckSlides(dir, root), relative(root, f))
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const arg = process.argv[2]
  if (arg === '--self-test') {
    const mk = (comps, build = []) => comps.map((comp, i) => ({ comp, file: 'deck', line: i + 1, build: build.includes(i) }))
    const long = mk(['Cover', ...Array(20).fill('BigStat').map((c, i) => (i % 3 ? c : 'Funnel'))])
    const ids = lintSlides(long).map((h) => h.id)
    // Modular manifest test: directory index.tsx import, semicolon-less external named import,
    // `$` identifier, multi-export file, and strings containing `/* */` and `//`.
    const tmp = mkdtempSync(join(tmpdir(), 'pcafe-deck-lint-'))
    let modOk = false
    try {
      mkdirSync(join(tmp, 'slides', 'ch1'), { recursive: true })
      writeFileSync(join(tmp, 'slides', 'ch1', 'index.tsx'), [
        "export const $first = [{ id: 'a', render: () => <Cover title='src/**/*.tsx' lead='a//b' /> }]",
        '// render: () => <Fake />',
      ].join('\n'))
      writeFileSync(join(tmp, 'slides', 'multi.tsx'), [
        "export const partA = [{ id: 'b', build: 'reveal', render: () => <Agenda /> }]",
        "export const partB = [{ id: 'c', render: () => <StatRow /> }]",
      ].join('\n'))
      writeFileSync(join(tmp, 'slides', 'unused-helper.tsx'), "export const helper = { render: () => <Ignored /> }\n")
      writeFileSync(join(tmp, 'index.tsx'), [
        "import { Closing } from '../../kit'",
        "import { $first } from './slides/ch1'",
        "import { partA, partB } from './slides/multi'",
        "export const deck = { title: 'T', slides: [...$first, ...partA, ...partB, { id: 'partA', render: () => <Closing /> }] }",
        "export const extra = [{ render: () => <NotInDeck /> }]",
      ].join('\n'))
      const modSlides = readDeckSlides(tmp, tmp)
      modOk = modSlides.map((s) => `${s.comp}@${s.file}`).join(',') ===
        'Cover@slides/ch1/index.tsx,Agenda@slides/multi.tsx,StatRow@slides/multi.tsx,Closing@index.tsx'
    } finally {
      rmSync(tmp, { recursive: true, force: true })
    }
    const ok = ['no-agenda', 'few-sections', 'no-closing'].every((id) => ids.includes(id))
      && lintSlides(mk(['Cover', 'A', 'A', 'A', 'A', 'B'])).some((h) => h.id === 'repeat')
      && lintSlides(mk(['Cover', 'A', 'B', 'C', 'D', 'E'], [1, 2, 3])).some((h) => h.id === 'builds')
      && lintSlides(mk(['Cover', 'Agenda', 'SectionBreak', ...Array(8).fill(0).flatMap((_, i) => [`T${i}`, `U${i}`]), 'SectionBreak', 'X', 'Y', 'Closing'])).length === 0
      && readSlides("{ id: 'a', build: 'reveal', render: () => (\n <Cover x />) }, { id: 'b', render: () => <Agenda /> }").map((s) => `${s.comp}${s.build}`).join() === 'Covertrue,Agendafalse'
      && modOk
    console.log(ok ? 'PASS  deck lint self-test' : `FAIL  deck lint self-test ${ids} modOk=${modOk}`)
    process.exit(ok ? 0 : 1)
  }
  const hints = deckLint(arg)
  for (const h of hints) console.log(`hint  ${h.code}  ${h.file}:${h.line}  "${h.text}"\n      ${h.hint}`)
  if (!hints.length) console.log('no structure hints')
}
