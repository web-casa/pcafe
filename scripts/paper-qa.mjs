// Deterministic audit for a report or résumé. Exit code 1 on any hard failure.
// usage: node scripts/paper-qa.mjs <name>   reads dist/<name>.html, writes dist/<name>.pdf and qa/<name>/
import { launchChromium } from './playwright.mjs'
import { missingCjk } from './font-coverage.mjs'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = resolve(import.meta.dirname, '..')
const name = process.argv[2]
if (!name) { console.error('usage: paper-qa <name>'); process.exit(2) }
const FILE = join(ROOT, 'dist', `${name}.html`)
const PDF = join(ROOT, 'dist', `${name}.pdf`)
const OUT = join(ROOT, 'qa', name)
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const failures = []
const notes = []
const fail = (m) => failures.push(m)
const missingGlyphs = existsSync(FILE) ? missingCjk(readFileSync(FILE, 'utf8')) : []
if (missingGlyphs.length) {
  notes.push(`characters missing from the committed font subsets: ${missingGlyphs.join(' ')}. The browser falls back to a system font; maintainers can add them with npm run fonts, then run npm run fonts:verify.`)
}

function findChromium() {
  const base = join(homedir(), '.cache', 'ms-playwright')
  const dirs = existsSync(base) ? readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort() : []
  for (const d of dirs.reverse()) {
    for (const sub of ['chrome-linux-arm64/chrome', 'chrome-linux/chrome', 'chrome-linux64/chrome', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium', 'chrome-win/chrome.exe']) {
      const p = join(base, d, sub)
      if (existsSync(p)) return p
    }
  }
  return undefined
}

const browser = await launchChromium({ executablePath: findChromium() })
const url = pathToFileURL(FILE).href

async function open(width, height, query = '') {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' })
  page.on('pageerror', (e) => fail(`page error: ${e.message.slice(0, 160)}`))
  page.on('console', (m) => { if (m.type() === 'error') fail(`console error: ${m.text().slice(0, 160)}`) })
  page.on('request', (r) => { if (/^https?:/.test(r.url())) fail(`network request: ${r.url()}`) })
  await page.goto(url + query, { waitUntil: 'load' })
  await page.waitForFunction(() => document.documentElement.dataset.ready === 'true', null, { timeout: 30000 })
  await page.waitForTimeout(400)
  return page
}

// ---- sheets ----
const paper = await open(1440, 1000, '?view=paper')
const kind = await paper.evaluate(() => document.documentElement.dataset.paper)
const runAudit = (page) => page.evaluate(() => {
  const out = { sheets: 0, problems: [], minFont: 99, minText: '', fills: [] }
  const sheets = [...document.querySelectorAll('.sheet')]
  out.sheets = sheets.length
  sheets.forEach((sheet, i) => {
    const n = i + 1
    const box = sheet.getBoundingClientRect()
    // Everything must sit inside the paper, and flow content inside the text area.
    const area = sheet.querySelector('.sheet-flow') ?? sheet
    const limit = area.getBoundingClientRect()
    let bottom = limit.top
    const walker = document.createTreeWalker(sheet, NodeFilter.SHOW_TEXT)
    for (let t = walker.nextNode(); t; t = walker.nextNode()) {
      if (!t.textContent.trim()) continue
      const el = t.parentElement
      // Slide thumbnails are pictures. A kit part used as content must be readable like any other text.
      if (el.closest('.r-thumb') || (el.closest('.stage') && !el.closest('.kit-part'))) continue
      if (getComputedStyle(el).visibility === 'hidden' || !el.getClientRects().length || el.closest('[aria-hidden="true"]')) continue
      const range = document.createRange()
      range.selectNodeContents(t)
      for (const r of range.getClientRects()) {
        if (r.right > box.right + 0.5 || r.left < box.left - 0.5 || r.bottom > box.bottom + 0.5) out.problems.push(`page ${n}: text outside the sheet: "${t.textContent.trim().slice(0, 24)}"`)
        if (area !== sheet && area.contains(el)) {
          if (r.bottom > limit.bottom + 1) out.problems.push(`page ${n}: text below the text area: "${t.textContent.trim().slice(0, 24)}"`)
          if (r.right > limit.right + 1) out.problems.push(`page ${n}: text wider than the column: "${t.textContent.trim().slice(0, 24)}"`)
          bottom = Math.max(bottom, r.bottom)
        }
      }
      const size = parseFloat(getComputedStyle(el).fontSize)
      if (size < out.minFont) { out.minFont = size; out.minText = t.textContent.trim().slice(0, 20) }
    }
    // Résumé pages have no separate text area: their page box must not overflow.
    for (const col of sheet.querySelectorAll('.r-page, .r-grid, .r-main, .r-aside')) {
      const end = col.getBoundingClientRect().bottom - parseFloat(getComputedStyle(col).paddingBottom)
      const over = Math.max(...[...col.children].map((c) => c.getBoundingClientRect().bottom)) - end
      if (over > 1) out.problems.push(`page ${n}: résumé content (${col.className}) is ${Math.ceil(over)}px too tall. Cut content or move a section to page 2.`)
    }
    // The footnote sits at the bottom whatever happens above it, so check that nothing runs into it.
    const note = sheet.querySelector('.r-note')?.getBoundingClientRect()
    if (note) {
      const hit = [...sheet.querySelectorAll('.r-section li, .r-section p, .r-section h4')].find((el) => { const r = el.getBoundingClientRect(); return r.bottom > note.top + 1 && r.top < note.bottom })
      if (hit) out.problems.push(`page ${n}: text runs into the footnote: "${hit.textContent.trim().slice(0, 20)}"`)
    }
    if (area !== sheet && !sheet.classList.contains('is-land')) {
      const fill = (bottom - limit.top) / limit.height
      out.fills.push(Math.round(fill * 100))
      const last = area.lastElementChild?.querySelector('h2,h3')
      if (last && area.lastElementChild.matches('.b-h1,.b-h2')) out.problems.push(`page ${n}: heading left alone at the foot: "${last.textContent}"`)
      if (!area.children.length) out.problems.push(`page ${n}: empty sheet`)
    }
    if (sheet.classList.contains('is-land') && !sheet.querySelector('.slide')) out.problems.push(`page ${n}: slide did not render`)
  })
  for (const m of document.querySelectorAll('[data-missing]')) out.problems.push(`citation "${m.getAttribute('data-missing')}" has no entry in sources`)
  if (document.querySelector('.doc-cite') && !document.querySelector('.b-sources')) out.problems.push('the report cites sources but has no <SourceList />')
  for (const b of document.querySelectorAll('.b-figure, .b-table, .b-slide, .b-stats')) {
    if (b.dataset.source !== 'continues' && !b.querySelector('.doc-source')?.textContent.trim()) out.problems.push(`a figure or table has an empty source: "${b.querySelector('figcaption')?.textContent.slice(0, 24) ?? ''}"`)
  }
  return out
})
const audit = await runAudit(paper)
audit.problems.forEach(fail)
if (audit.minFont < 10.5) fail(`text smaller than 8pt (${audit.minFont}px): "${audit.minText}"`)
if (audit.sheets < 1) fail('no sheets rendered')
if (kind === 'resume' && audit.sheets > 2) fail(`résumé has ${audit.sheets} pages, the limit is 2`)
audit.fills.forEach((f, i) => { if (f < 30 && i < audit.fills.length - 1) notes.push(`page fill ${f}% on a text sheet (${i + 1} of the text sheets)`) })

await paper.addStyleTag({ content: '.doc-bar{display:none!important}' })
for (const el of await paper.locator('.sheet').all()) {
  const n = await el.getAttribute('data-page')
  await el.screenshot({ path: join(OUT, `page-${String(n).padStart(2, '0')}.png`) })
}

// ---- pdf ----
await paper.pdf({ path: PDF, preferCSSPageSize: true, printBackground: true, tagged: true, outline: true })
const pdfinfo = spawnSync('pdfinfo', [PDF], { encoding: 'utf8' })
let pdfPages = null
if (pdfinfo.status === 0) {
  pdfPages = Number(pdfinfo.stdout.match(/Pages:\s+(\d+)/)?.[1])
  if (pdfPages !== audit.sheets) fail(`PDF has ${pdfPages} pages, the document has ${audit.sheets} sheets`)
  const text = spawnSync('pdftotext', ['-layout', PDF, '-'], { encoding: 'utf8', maxBuffer: 1 << 26 }).stdout ?? ''
  const fonts = spawnSync('pdffonts', [PDF], { encoding: 'utf8' }).stdout ?? ''
  const unembedded = fonts.split('\n').slice(2).filter((l) => l.trim() && !/\byes\s+(yes|no)\s+(yes|no)\s+\d+\s+\d+\s*$/.test(l))
  if (unembedded.length) fail(`fonts not embedded in the PDF: ${unembedded[0].trim().slice(0, 50)}`)
  const stray = fonts.split('\n').slice(2).filter((l) => l.trim() && !/OTS-derived|geist|instrument|anton|jakarta|silkscreen/i.test(l))
  if (stray.length) notes.push(`system fallback font in PDF (a glyph is missing from the subset): ${stray[0].trim().slice(0, 40)}`)
  const title = await paper.evaluate(() => (document.querySelector('.doc-cover h1, .r h1')?.textContent ?? '').replace(/\s/g, ''))
  if (title && !text.replace(/\s/g, '').includes(title)) fail(`PDF text does not contain "${title}": text may be outlined or broken`)
  if (kind === 'resume') {
    // A screening system reads the PDF as plain text, so the order has to make sense.
    const heads = await paper.evaluate(() => [...document.querySelectorAll('.r h3')].map((h) => h.textContent))
    const flat = spawnSync('pdftotext', [PDF, '-'], { encoding: 'utf8', maxBuffer: 1 << 26 }).stdout ?? ''
    for (const h of heads) if (!flat.includes(h)) fail(`résumé heading missing from PDF text: ${h}`)
    if (!/@/.test(flat)) notes.push('no email address found in the PDF text')
  }
} else {
  notes.push('pdfinfo not found: PDF page count not verified')
}
await paper.close()

// ---- plain version of a designed résumé ----
let plainBytes = null
if (kind === 'resume' && (await hasPlain())) {
  const page = await open(1440, 1000, '?plain=1')
  const plainAudit = await runAudit(page)
  plainAudit.problems.forEach((p) => fail(`plain version, ${p}`))
  if (plainAudit.sheets > 2) fail(`plain version has ${plainAudit.sheets} pages, the limit is 2`)
  await page.locator('.sheet').first().screenshot({ path: join(OUT, 'plain-01.png') })
  const file = join(ROOT, 'dist', `${name}-plain.pdf`)
  await page.pdf({ path: file, preferCSSPageSize: true, printBackground: true, tagged: true, outline: true })
  plainBytes = statSync(file).size
  if (pdfinfo.status === 0) {
    const flat = (spawnSync('pdftotext', [file, '-'], { encoding: 'utf8', maxBuffer: 1 << 26 }).stdout ?? '').replace(/\s+/g, '')
    // Name first, then every heading and employer in the order a reader meets them.
    const order = await page.evaluate(() => [document.querySelector('.r h1').textContent, ...[...document.querySelectorAll('.r h3, .r-work h4 b')].map((e) => e.textContent)])
    let at = -1
    for (const t of order) {
      const i = flat.indexOf(t.replace(/\s+/g, ''), at + 1)
      if (i < 0) { fail(`plain version reads out of order at "${t}"`); break }
      at = i
    }
  }
  await page.close()
}

// ---- article view ----
if (kind === 'report') {
  for (const [w, h, tag] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
    const page = await open(w, h, '?view=read')
    const m = await page.evaluate(() => {
      const doc = document.documentElement
      const wide = [...document.querySelectorAll('.doc-article svg, .doc-article .doc-bars, .doc-article .doc-stack')].filter((e) => !e.closest('.doc-slidebox') && e.getBoundingClientRect().right > innerWidth + 1).length
      return { over: doc.scrollWidth - doc.clientWidth, wide, heads: document.querySelectorAll('.doc-article h2, .doc-article h3').length }
    })
    if (m.over > 0) fail(`article view scrolls sideways by ${m.over}px at ${w}px wide`)
    if (m.wide) fail(`${m.wide} charts wider than the screen at ${w}px wide`)
    await page.screenshot({ path: join(OUT, `read-${tag}.png`), fullPage: tag === 'mobile' })
    await page.close()
  }
} else {
  const page = await open(390, 844)
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  if (over > 0) fail(`résumé page scrolls sideways by ${over}px on a phone`)
  await page.screenshot({ path: join(OUT, 'mobile.png') })
  await page.close()
}
await browser.close()

async function hasPlain() {
  const page = await open(800, 600)
  const yes = await page.evaluate(() => /showcase|console|portfolio/.test(document.querySelector('.sheet')?.className ?? ''))
  await page.close()
  return yes
}

const report = { name, kind, plainBytes, bytes: statSync(FILE).size, sheets: audit.sheets, pdfPages, pdfBytes: statSync(PDF).size, minFontPx: audit.minFont, fills: audit.fills, notes, failures }
writeFileSync(join(OUT, 'report.json'), JSON.stringify(report, null, 2))
console.log(`${name}: ${audit.sheets} sheets, PDF ${(report.pdfBytes / 1048576).toFixed(2)} MB, HTML ${(report.bytes / 1048576).toFixed(2)} MB, smallest text ${audit.minFont}px`)
notes.forEach((n) => console.log(`note: ${n}`))
const unique = [...new Set(failures)]
// One overflow reports every line it pushes out: name the cause first and keep the list short.
const ordered = [...unique.filter((f) => !f.includes('text outside')), ...unique.filter((f) => f.includes('text outside'))]
ordered.slice(0, 8).forEach((f) => console.log(`FAIL: ${f}`))
if (ordered.length > 8) console.log(`FAIL: and ${ordered.length - 8} more, see qa/${name}/report.json`)
console.log(failures.length ? 'FAIL' : 'PASS — all deterministic checks')
process.exit(failures.length ? 1 : 0)
