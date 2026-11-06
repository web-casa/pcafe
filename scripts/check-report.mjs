// Turns the output of a `pcafe check` into a machine-readable report with stable issue codes,
// and works out the next step for `pcafe status`. The QA scripts keep printing for people;
// this file reads what they print (and their report.json files) so they don't have to change.
//
//   node scripts/check-report.mjs --self-test   every known QA message must get a specific code
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

/** Where each format keeps its sources and the images a person must look at. */
export const FORMATS = {
  deck: { dir: 'decks', report: () => 'qa/report.json', shots: (n) => [['qa', /^slide-\d+-1920x1080\.png$/]] },
  paper: { dir: 'papers', report: (n) => `qa/${n}/report.json`, shots: (n) => [[`qa/${n}`, /^page-\d+\.png$/]] },
  cards: { dir: 'cardsets', report: (n) => `qa/cards/${n}/report.json`, shots: (n) => [[`dist/cards/${n}`, /\.png$/], [`qa/cards/${n}`, /^feed-.*\.png$/]] },
  video: { dir: 'videos', report: () => null, shots: (n) => [[`qa/video/${n}`, /^contact\.png$/]] },
  course: { dir: 'courses', report: (n) => `qa/course/${n}/report.json`, shots: (n) => [[`qa/course/${n}/desktop`, /\.png$/], [`qa/course/${n}/phone`, /\.png$/]] },
  screen: { dir: 'screens', report: (n) => `qa/screen/${n}/report.json`, shots: (n) => [[`qa/screen/${n}`, /\.png$/]] },
  print: { dir: 'prints', report: (n) => `qa/print/${n}/report.json`, shots: (n) => [[`dist/print/${n}`, /\.png$/], [`qa/print/${n}`, /\.png$/]] },
}

/**
 * First match wins, so specific rules come before broad ones. The code is `<area>.<what>`;
 * The guide in each docs language lists them. Change a code only together with those docs.
 */
const CODES = [
  ['setup.missing', /no file at|run video-render first|poppler|not found: .*Install|could not write|was not written|not in the QA table|not found in its template|asked for and not written/i],
  ['security.secret', /looks like a key|run as a script/i],
  ['size.file', /MB is too big|too big for one file/i],
  ['fonts.fallback', /fell back|system font|font .* not loaded|not embedded|glyphs? fell/i],
  ['offline.external-request', /network request|external request|remote (?:file|resource)|left the single file|request left/i],
  ['runtime.console-error', /console error|page error|QA stopped at line|async error was not/i],
  ['media.image', /image failed to load|image with no alt/i],
  ['source.missing', /no source|empty source|cites sources|citation .* no entry|of .* sources|source list|SourceList/i],
  ['content.sample', /sample content|sample label|sample data|not labelled|placeholder|negative test fixture/i],
  ['text.contrast', /contrast/i],
  ['print.preset', /preset|hides \S+ mm at the bottom|targetDpi|visible area .* mm|trim height|safe margin/i],
  ['print.slices', /slice|xhs|wechat/i],
  ['print.crop-marks', /crop mark/i],
  ['print.size', /full PNG|PDF would be .* tall|pages rendered, this format|dpi of the finished/i],
  ['text.too-small', /too small|mm tall, under|smaller than|text under \S+px|under \d+px|is \S+ ?px at|reaches the eye at|small print|under the \S+ (?:pt|px) floor|\bunder \S+ (?:mm|pt|px)\b/i],
  ['text.unsettled', /still changing|frozen for|is frozen|ignores reduced motion|did not settle/i],
  ['layout.sideways-scroll', /scrolls sideways|wider than the screen|page scrolls by/i],
  ['layout.stage', /stage ratio/i],
  ['layout.safe-area', /safe area|safe zone|outside the sa|falls outside|outside the sheet|leaves the stage|off screen|off the (?:screen|trim)|outside the trim|hidden (?:area|bottom)|behind the top bar|closer than .* to the side|past the live area|too wide\.|bleed/i],
  ['layout.overlap', /collision|overlap|runs into|touches|on top of|text crosses/i],
  ['layout.overflow', /clips content|clipped|cut off by its box|overflow|too tall|wider than the column|below the text area|does not fit|leaves its card|cut content/i],
  ['layout.widow', /left alone|alone at the foot|single word|orphan/i],
  ['layout.empty', /empty sheet|did not render|nothing rendered|no sheets|no scenes|blank page|blank picture|frame is blank|lower half looks empty|rendered empty/i],
  ['interaction.detail', /did not return to its slot|card did not open|previews mounted|detail /i],
  ['a11y.target-size', /24×24|target under/i],
  ['a11y.focus', /focus|Tab key|arrow keys|cursor is visible/i],
  ['a11y.label', /WCAG|no name|status region|no text label|h1 headings/i],
  ['nav.keys', /navigation|keyboard|ArrowRight|Escape|Esc |Enter |overview|controls:|deep link|drawer|walk-through|did not advance|did not pause|does not open|contents link/i],
  ['build.reveal', /builds?:|build groups|build items|steps for/i],
  ['print.geometry', /BleedBox|TrimBox|PDF page .* mm|mm, it must|fold|panel/i],
  ['print.raster', /ppi|raster/i],
  ['pdf.pages', /PDF has \S+ pages|pages, the limit|has \S+ pages|pages, expected/i],
  ['pdf.text', /PDF text|cannot be extracted|heading missing from PDF|outlined/i],
  ['paper.plain', /plain version/i],
  ['video.encoding', /H\.264|bitrate|moov|faststart|codec|audio|duration|video stream|profile|manifest|partial render/i],
  ['video.flash', /flash/i],
  ['video.caption', /caption/i],
  ['video.timing', /nothing moves|cut only|identical picture|maxHold/i],
  ['screen.clock', /clock|midnight|out of its hours|now\/next/i],
  ['screen.data', /data|stale|HTTP \d+|JSON/i],
  ['screen.resilience', /fault|holding card|loop stopped/i],
  ['screen.rotation', /rotate=/i],
  ['screen.definition', /duplicate scene ids|no clock/i],
  ['screen.schedule', /schedule|skipped|burn-in|soak|heap|memory|wake lock|\d+ s on screen|need \S+ s/i],
  ['course.scoring', /score|results?|retry|right|wrong|answer|review round|flashcard|concept|questions/i],
  ['course.progress', /reload|progress|resume|reopening|start over|survive/i],
  ['course.task', /task|step \S+|scripted|worked example|ordering|option|pairs|simulation|feedback|explanation|explain/i],
  ['cards.cover', /cover|headline/i],
  ['morph.ghost', /ghost/i],
]

export function codeFor(format, message) {
  for (const [code, re] of CODES) if (re.test(message)) return code
  return `${format}.other`
}

/** Slide, page, card or scene a message points at, when it names one. */
function where(message) {
  const m = message.match(/\b(slide|page|card|scene|step|panel)\s+(\d+|[a-z][\w-]*)/i)
  return m ? `${m[1].toLowerCase()} ${m[2]}` : undefined
}

/** Issues from a check's combined output, plus failures a QA script only wrote to report.json. */
export function parseOutput(format, output, root, name, since) {
  const issues = []
  const add = (level, code, message, extra = {}) => {
    message = message.trim()
    if (!message || issues.some((i) => i.message === message && i.level === level)) return
    issues.push({ level, code, message, where: where(message), ...extra })
  }
  const lines = output.replace(/\x1b\[[0-9;]*m/g, '').split('\n')
  let block = null
  for (const line of lines) {
    // tsc prints `file(l,c): error TSn: …`, or `file:l:c - error TSn: …` when pretty.
    const ts = line.match(/^(.+?)\((\d+),\d+\): error (TS\d+): (.*)$/) ?? line.match(/^(.+?):(\d+):\d+ - error (TS\d+): (.*)$/)
    if (ts) { add('fail', `typecheck.${ts[3]}`, ts[4], { file: `${ts[1]}:${ts[2]}` }); continue }
    if (/^(?:error\b(?!s)|\[vite\]|✗ Build failed|Error:)/i.test(line) && !/console error/i.test(line)) { add('fail', 'build.error', line); continue }
    const head = line.match(/^(FAIL|WARN) \(\d+\)$/)
    if (head) { block = head[1] === 'FAIL' ? 'fail' : 'warn'; continue }
    if (block && line.startsWith('- ')) { add(block, codeFor(format, line.slice(2)), line.slice(2)); continue }
    block = null
    const f = line.match(/^FAIL(?::|\s{2})\s*(.+)$/)
    if (f && !/^and \d+ more/.test(f[1])) { add('fail', codeFor(format, f[1]), f[1]); continue }
    const w = line.match(/^WARN(?::|\s{2})\s*(.+)$/)
    if (w) { add('warn', codeFor(format, w[1]), w[1]); continue }
    const h = line.match(/^hint {2}((?:copy|deck)\.[\w.-]+) {2}(\S+) {2}(.*)$/)
    if (h) { add('hint', h[1], h[3], { file: h[2] }); continue }
  }
  const rel = FORMATS[format].report(name)
  const file = rel && join(root, rel)
  if (file && existsSync(file) && statSync(file).mtimeMs >= since) {
    try {
      const r = JSON.parse(readFileSync(file, 'utf8'))
      for (const m of r.failures ?? []) add('fail', codeFor(format, String(m)), String(m))
    } catch {}
  }
  return issues
}

export function screenshots(root, format, name) {
  return FORMATS[format].shots(name).flatMap(([dir, re]) => {
    const abs = join(root, dir)
    if (!existsSync(abs)) return []
    const walk = (d) => readdirSync(join(root, d)).sort().flatMap((f) => (statSync(join(root, d, f)).isDirectory() ? walk(join(d, f)) : re.test(f) ? [join(d, f)] : []))
    return walk(dir)
  })
}

/** Newest modification time of the item's sources. */
export function sourceTime(root, format, name) {
  const walk = (p) => {
    const st = statSync(p)
    if (!st.isDirectory()) return st.mtimeMs
    return Math.max(0, ...readdirSync(p).map((f) => walk(join(p, f))))
  }
  const dir = join(root, 'src', FORMATS[format].dir, name)
  return existsSync(dir) ? walk(dir) : 0
}

export function command(format, name) {
  return format === 'deck' ? `npx pcafe check ${name}` : `npx pcafe ${format} check ${name}`
}

/**
 * One next step for whoever runs the project (a person or an agent):
 *   run_check     sources are newer than the last check, or there is none
 *   fix           the check failed; issues are grouped by code, fix them and run `rerun`
 *   review        the check passed; look at every screenshot, then confirm with the user
 */
export function nextStep(root, format, name, report) {
  const rerun = command(format, name)
  const src = sourceTime(root, format, name)
  if (!report) return { action: 'run_check', command: rerun, reason: 'no check has run yet' }
  if (src > report.finishedAt) return { action: 'run_check', command: rerun, reason: 'sources changed after the last check' }
  if (!report.ok) {
    const fails = report.issues.filter((i) => i.level === 'fail')
    const byCode = {}
    for (const i of fails) (byCode[i.code] ??= []).push(i.message)
    return { action: 'fix', path: `src/${FORMATS[format].dir}/${name}/`, issues: byCode, rerun, docs: 'docs/<lang>/guide.md, section "Fixing QA errors"' }
  }
  return {
    action: 'review',
    screenshots: report.screenshots,
    hints: report.issues.filter((i) => i.level !== 'fail'),
    then: 'Look at every screenshot at full size. Fix what reads badly, then show the result to the user; the user decides when it is done.',
  }
}

export function relativeTo(root, p) { return relative(root, p) }

function selfTest() {
  const here = new URL('.', import.meta.url).pathname
  const files = ['qa', 'paper-qa', 'cards-qa', 'video-qa', 'course-qa', 'screen-qa', 'print-qa']
  const formatOf = { qa: 'deck', 'paper-qa': 'paper', 'cards-qa': 'cards', 'video-qa': 'video', 'course-qa': 'course', 'screen-qa': 'screen', 'print-qa': 'print' }
  const other = []
  let total = 0
  for (const f of files) {
    const src = readFileSync(join(here, `${f}.mjs`), 'utf8')
    for (const m of src.matchAll(/(?:fail|issues\.push|problems\.push)\((`[^`]*`|'[^']*')/g)) {
      const msg = m[1].slice(1, -1).replace(/\$\{[^}]*\}/g, 'x')
      // Templates that only wrap another message ("x slide x: x") get their code at run time.
      if (msg.replace(/\bx\b|\[x\]|[^a-z ]/gi, ' ').trim().split(/\s+/).filter((w) => w.length > 2).length < 2) continue
      total++
      if (codeFor(formatOf[f], msg).endsWith('.other')) other.push(`${f}: ${msg.slice(0, 90)}`)
    }
  }
  const sample = parseOutput('deck', 'Errors  Files\nsrc/decks/a/index.tsx:3:5 - error TS2322: Type x\nFAIL (2)\n- deck slide 4: font 12.0u too small: "x"\n- external requests https://x\nhint  copy.zh.filler  src/decks/a/index.tsx:9  "值得注意的是"\nPASS', '/nonexistent', 'a', 0)
  const want = ['typecheck.TS2322', 'text.too-small', 'offline.external-request', 'copy.zh.filler']
  const got = sample.map((i) => i.code)
  const other2 = parseOutput('print', 'note: x\nFAIL: poster: text runs off the trim: "Moon"\nFAIL: and 3 more, see qa/print/a/report.json\nFAIL', '/nonexistent', 'a', 0)
  const okParse = want.every((c, i) => got[i] === c) && sample[1].where === 'slide 4' && other2.length === 1 && other2[0].code === 'layout.safe-area'
  const share = other.length / total
  console.log(`${total} QA messages, ${other.length} without a specific code (${(share * 100).toFixed(1)}%)`)
  other.slice(0, 200).forEach((o) => console.log(`  other  ${o}`))
  if (!okParse) console.log(`parse: got ${JSON.stringify(sample)}`)
  const ok = okParse && share <= 0.05
  console.log(ok ? 'PASS  check-report self-test' : 'FAIL  check-report self-test')
  return ok ? 0 : 1
}

if (import.meta.url === `file://${process.argv[1]}` && process.argv[2] === '--self-test') process.exit(selfTest())
