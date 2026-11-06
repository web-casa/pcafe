// Selftest for the PowerPoint export. Last line is PASS or FAIL.
// usage: node scripts/pptx-selftest.mjs [deck ...] [--no-export] [--no-negative]
//
// For each deck (default kit-intro):
//   - negative test: export with one text run deliberately left in the background; the export
//     must refuse (exit 1) and name it, so the duplicate check is known to work;
//   - real export, then checks that do not trust the exporter's own bookkeeping:
//     slide count from the built HTML's progress bar = slides in the .pptx = slides in the report;
//     every slide has a background picture; the text boxes in the XML are the report's boxes;
//     no text box sits on background text with the same words; no box's glyphs stayed in the
//     background (pixel check); CJK runs carry an East Asian font; one <a:pPr> per paragraph;
//     notes in the report are in the notes slides.
import { launchChromium } from './playwright.mjs'
import JSZip from 'jszip'
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = resolve(import.meta.dirname, '..')
const argv = process.argv.slice(2)
const decks = argv.filter((a) => !a.startsWith('--'))
if (!decks.length) decks.push('kit-intro')
const failures = []
const fail = (deck, msg) => failures.push(`${deck}: ${msg}`)

function exportDeck(deck, env = {}) {
  const r = spawnSync(process.execPath, [join(ROOT, 'scripts', 'pptx-export.mjs'), deck], { cwd: ROOT, env: { ...process.env, ...env }, encoding: 'utf8' })
  return { code: r.status, out: `${r.stdout}\n${r.stderr}` }
}

function findChromium() {
  const base = join(homedir(), '.cache', 'ms-playwright')
  const dirs = existsSync(base) ? readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort() : []
  for (const d of dirs.reverse())
    for (const sub of ['chrome-linux-arm64/chrome', 'chrome-linux/chrome', 'chrome-linux64/chrome']) {
      const p = join(base, d, sub)
      if (existsSync(p)) return p
    }
  return undefined
}

const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&')
const norm = (s) => s.replace(/\s+/g, '')
const overlapArea = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y))

for (const deck of decks) {
  if (!argv.includes('--no-negative')) {
    const neg = exportDeck(deck, { PPTX_SELFTEST_LEAVE_TEXT: '1' })
    const caught = neg.code === 1 && /also visible in the background/.test(neg.out) && /DUPLICATE/.test(neg.out)
    if (!caught) fail(deck, `negative test: text left in the background was not reported (exit ${neg.code})`)
    else console.log(`${deck}: negative test caught the planted duplicate`)
  }
  if (!argv.includes('--no-export')) {
    const r = exportDeck(deck)
    process.stdout.write(r.out.split('\n').filter((l) => /^(slide|wrote|pptx)/.test(l)).join('\n') + '\n')
    if (r.code !== 0) fail(deck, `export exited with ${r.code}`)
  }
  const pptxFile = join(ROOT, 'dist', `${deck}.pptx`)
  const reportFile = `${pptxFile}.json`
  if (!existsSync(pptxFile) || !existsSync(reportFile)) {
    fail(deck, 'dist/<deck>.pptx or its report is missing')
    continue
  }
  const report = JSON.parse(readFileSync(reportFile, 'utf8'))
  const zip = await JSZip.loadAsync(readFileSync(pptxFile))

  // Slide count, from three independent places.
  const browser = await launchChromium({ executablePath: findChromium() })
  let htmlSlides = 0
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' })
    await page.goto(`${pathToFileURL(join(ROOT, 'dist', `${deck}.html`)).href}#/1`)
    await page.waitForSelector('.progress__seg', { timeout: 30000 })
    htmlSlides = await page.locator('.progress__seg').count()
  } finally {
    await browser.close()
  }
  const slideFiles = Object.keys(zip.files).filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f)).sort((a, b) => parseInt(a.match(/\d+/)) - parseInt(b.match(/\d+/)))
  const listed = ((await zip.file('ppt/presentation.xml').async('string')).match(/<p:sldId /g) ?? []).length
  if (!(htmlSlides > 0 && htmlSlides === slideFiles.length && listed === htmlSlides && report.slides.length === htmlSlides))
    fail(deck, `slide counts differ: HTML ${htmlSlides}, pptx files ${slideFiles.length}, presentation.xml ${listed}, report ${report.slides.length}`)

  let boxes = 0
  for (const [i, f] of slideFiles.entries()) {
    const n = i + 1
    const xml = await zip.file(f).async('string')
    const s = report.slides[i]
    if (!s) continue
    if (!/<p:bg><p:bgPr><a:blipFill/.test(xml)) fail(deck, `slide ${n}: no background picture`)
    if (xml.includes('||')) fail(deck, `slide ${n}: font marker left in the XML`)
    for (const p of xml.match(/<a:p>[\s\S]*?<\/a:p>/g) ?? []) if ((p.match(/<a:pPr\b/g) ?? []).length > 1) fail(deck, `slide ${n}: a paragraph has more than one <a:pPr>`)
    // Text boxes in the file, in order, against the report.
    const shapes = (xml.match(/<p:sp>[\s\S]*?<\/p:sp>/g) ?? []).filter((sp) => sp.includes('<p:txBody>'))
    const texts = shapes.map((sp) => decode((sp.match(/<a:t>([^<]*)<\/a:t>/g) ?? []).map((t) => t.slice(5, -6)).join('')))
    const want = s.editable.map((e) => e.text)
    if (texts.length !== want.length || texts.some((t, k) => norm(t) !== norm(want[k]))) fail(deck, `slide ${n}: ${texts.length} text boxes in the file, ${want.length} in the report, or their text differs`)
    boxes += texts.length
    // Runs with CJK text must name an East Asian font.
    for (const run of xml.match(/<a:r>[\s\S]*?<\/a:r>/g) ?? []) {
      const t = decode(run.match(/<a:t>([^<]*)<\/a:t>/)?.[1] ?? '')
      if (/\p{Script=Han}/u.test(t) && !/<a:ea typeface="Noto (Sans|Serif) SC[^"]*"\/>/.test(run)) fail(deck, `slide ${n}: CJK run "${t.slice(0, 12)}" has no Noto East Asian font`)
    }
    // Pixel evidence recorded during export.
    if (!s.checks.stable) fail(deck, `slide ${n}: render was not stable, the pixel check did not run`)
    for (const t of [...s.checks.notRemoved, ...s.checks.duplicates]) fail(deck, `slide ${n}: "${t}" is both a text box and in the background`)
    // Same words in the background under a box.
    for (const e of s.editable)
      for (const b of s.backgroundText) {
        const a = overlapArea(e.rect, b.rect)
        if (a > 0.5 * e.rect.w * e.rect.h && norm(b.text).includes(norm(e.text))) fail(deck, `slide ${n}: "${e.text.slice(0, 30)}" is also kept in the background (${b.reason})`)
      }
    // Notes.
    if (s.notes) {
      const rels = (await zip.file(`ppt/slides/_rels/slide${parseInt(f.match(/\d+/))}.xml.rels`)?.async('string')) ?? ''
      const target = rels.match(/Target="\.\.\/notesSlides\/(notesSlide\d+\.xml)"/)?.[1]
      const notes = target ? decode(((await zip.file(`ppt/notesSlides/${target}`).async('string')).match(/<a:t>([^<]*)<\/a:t>/g) ?? []).map((t) => t.slice(5, -6)).join('')) : ''
      if (!norm(notes).includes(norm(s.notes))) fail(deck, `slide ${n}: speaker notes missing from the notes page`)
    }
  }
  if (report.notesWarning) fail(deck, report.notesWarning)
  console.log(`${deck}: ${slideFiles.length} slides (HTML ${htmlSlides}), ${boxes} text boxes, ${report.summary.backgroundText} text runs in the background, ${report.summary.slidesWithNotes} slides with notes`)
}

for (const f of failures) console.log(`  FAIL ${f}`)
console.log(failures.length ? 'FAIL' : 'PASS')
process.exit(failures.length ? 1 : 0)
