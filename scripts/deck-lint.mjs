// Whole-deck structure hints for long decks: printed with `check`, never a failure.
// Reads the deck source, so it sees which template each slide uses.
// usage: node scripts/deck-lint.mjs <deck-folder> | --self-test
import { existsSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const LONG = 20
const AGENDA = /^(Agenda|PillAgenda|IndexStack|ChapterProgress)$/
const SECTION = /^(SectionBreak|RibbonSection|ChapterProgress)$/
const CLOSING = /Closing$/

/** Slides in source order: the first JSX component each render returns, its line, and whether it builds. */
export function readSlides(src) {
  const out = []
  const re = /render:\s*\(\)\s*=>\s*\(?\s*<([A-Z][A-Za-z0-9]*)/g
  for (const m of src.matchAll(re)) {
    const before = src.slice(Math.max(0, m.index - 400), m.index)
    const own = before.slice(before.lastIndexOf('{'))
    out.push({ comp: m[1], line: src.slice(0, m.index).split('\n').length, build: /build:\s*'(reveal|focus)'/.test(own) })
  }
  return out
}

export function lintSlides(slides, file = 'deck') {
  const hints = []
  const n = slides.length
  const add = (id, line, text, hint) => hints.push({ id, code: `deck.${id}`, file, line, text, hint })
  if (n >= LONG) {
    if (!slides.some((s) => AGENDA.test(s.comp))) add('no-agenda', slides[0]?.line ?? 1, `${n} slides, no agenda`, 'A long deck needs a map: add Agenda, PillAgenda or IndexStack after the cover.')
    const sec = slides.filter((s) => SECTION.test(s.comp)).length
    if (sec < 2) add('few-sections', slides[0]?.line ?? 1, `${n} slides, ${sec} section break${sec === 1 ? '' : 's'}`, 'Split it into 3–5 chapters, each opened by SectionBreak, so listeners know where they are.')
    if (!CLOSING.test(slides[n - 1]?.comp ?? '')) add('no-closing', slides[n - 1]?.line ?? 1, `last slide is ${slides[n - 1]?.comp}`, 'End a long deck with a Closing slide that repeats the 2–3 takeaways.')
  }
  let run = 1
  for (let i = 1; i <= n; i++) {
    if (i < n && slides[i].comp === slides[i - 1].comp) { run += 1; continue }
    if (run >= 4) add('repeat', slides[i - run].line, `${slides[i - 1].comp} ${run} times in a row`, 'Several slides in a row look the same: vary the template or merge them.')
    run = 1
  }
  const builds = slides.filter((s) => s.build).length
  if (n >= 6 && builds > n / 3) add('builds', slides.find((s) => s.build).line, `${builds} of ${n} slides use build`, 'Keep build steps to at most a third of the slides, or the speaker presses too often.')
  return hints
}

export function deckLint(dir, root = process.cwd()) {
  const f = join(dir, 'index.tsx')
  if (!existsSync(f)) return []
  return lintSlides(readSlides(readFileSync(f, 'utf8')), relative(root, f))
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const arg = process.argv[2]
  if (arg === '--self-test') {
    const mk = (comps, build = []) => comps.map((comp, i) => ({ comp, line: i + 1, build: build.includes(i) }))
    const long = mk(['Cover', ...Array(20).fill('BigStat').map((c, i) => (i % 3 ? c : 'Funnel'))])
    const ids = lintSlides(long).map((h) => h.id)
    const ok = ['no-agenda', 'few-sections', 'no-closing'].every((id) => ids.includes(id))
      && lintSlides(mk(['Cover', 'A', 'A', 'A', 'A', 'B'])).some((h) => h.id === 'repeat')
      && lintSlides(mk(['Cover', 'A', 'B', 'C', 'D', 'E'], [1, 2, 3])).some((h) => h.id === 'builds')
      && lintSlides(mk(['Cover', 'Agenda', 'SectionBreak', ...Array(8).fill(0).flatMap((_, i) => [`T${i}`, `U${i}`]), 'SectionBreak', 'X', 'Y', 'Closing'])).length === 0
      && readSlides("{ id: 'a', build: 'reveal', render: () => (\n <Cover x />) }, { id: 'b', render: () => <Agenda /> }").map((s) => `${s.comp}${s.build}`).join() === 'Covertrue,Agendafalse'
    console.log(ok ? 'PASS  deck lint self-test' : `FAIL  deck lint self-test ${ids}`)
    process.exit(ok ? 0 : 1)
  }
  const hints = deckLint(arg)
  for (const h of hints) console.log(`hint  ${h.code}  ${h.file}:${h.line}  "${h.text}"\n      ${h.hint}`)
  if (!hints.length) console.log('no structure hints')
}
