// Deterministic audit for dist/index.html (PRD §6.1). Exit code 1 on any hard failure.
// usage: node scripts/qa.mjs [--frames]   → qa/report.json + qa/*.png
import { launchChromium } from './playwright.mjs'
import { missingCjk } from './font-coverage.mjs'
import { mkdirSync, readFileSync, statSync, writeFileSync, readdirSync, existsSync, unlinkSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve, join, relative } from 'node:path'
import { homedir, availableParallelism } from 'node:os'
import { pathToFileURL } from 'node:url'

const ROOT = resolve(import.meta.dirname, '..')
const DIST = join(ROOT, 'dist', 'index.html')
const STUDIO = join(ROOT, 'dist', 'studio.html')
const OUT = join(ROOT, 'qa')
const URL = pathToFileURL(DIST).href
// Gallery screenshots stay in Chinese whatever the browser language.
const STUDIO_URL = `${pathToFileURL(STUDIO).href}?lang=zh`
const FRAMES = process.argv.includes('--frames')
// Default: deck checks only. `--kit` runs the component-gallery checks, which
// `npm run qa:kit` uses; `npm run check:engine` runs both.
const KIT_ONLY = process.argv.includes('--kit')
if (KIT_ONLY) console.log('deck checks skipped (--kit)')
const jobsAt = process.argv.indexOf('--jobs')
const DEFAULT_JOBS = Math.min(4, Math.max(1, Math.floor(availableParallelism() / 2)))
const JOBS = jobsAt >= 0 ? Math.max(1, Number(process.argv[jobsAt + 1]) || DEFAULT_JOBS) : DEFAULT_JOBS
/** Loud failure threshold for a slide that never reports `data-settled`. */
const SETTLE_TIMEOUT = 4000
/** A Bento detail must open or close within this; a timeout is a normal failure, not a crash. */
const DETAIL_TIMEOUT = 3000
const SETTLE_HINT = 'something on it keeps changing; mark a live element with data-settle-ignore'
// Deck shape is discovered from the page, so this audit works for any deck built from the kit.
let SLIDES = 0
let BENTO_N = 0 // slide number holding a Bento overview, 0 if none
let CHECK_N = 0 // slide number holding a Checklist, 0 if none
let CARDS = []
const card = (id) => `.card[data-card="${id}"]`
const SHOT_VIEWPORTS = ['1920x1080', '1366x768']
const VIEWPORTS = [
  [1920, 1080],
  [1366, 768],
  [2560, 1440],
  [1440, 900],
]

mkdirSync(OUT, { recursive: true })
// Wall-clock per QA phase, printed at the end so a slow run says where time went.
const timing = {}
let phaseAt = Date.now()
const phase = (name) => {
  timing[name] = +((Date.now() - phaseAt) / 1000).toFixed(1)
  phaseAt = Date.now()
}
const failures = []
const REPORT_TARGET = KIT_ONLY ? STUDIO : DIST
if (KIT_ONLY && !existsSync(STUDIO)) {
  console.error('qa:kit needs dist/studio.html. Run `npm run build` first.')
  process.exit(1)
}
const report = { file: REPORT_TARGET, bytes: statSync(REPORT_TARGET).size, viewports: {}, roundTrips: {}, failures }
const fail = (msg) => failures.push(msg)
// Soft findings: printed and saved, but they do not fail the run.
const warnings = []
report.warnings = warnings
const missingGlyphs = missingCjk(readFileSync(DIST, 'utf8'))
if (missingGlyphs.length) warnings.push(`characters missing from the committed font subsets: ${missingGlyphs.join(' ')}. The browser falls back to a system font; maintainers can add them with npm run fonts, then run npm run fonts:verify.`)


// ── Partial and changed-only checks ───────────────────────────────────────────
// `--slides 3,5` audits those slides only. `--changed` audits slides whose deck
// source hash differs from the last passing run; any shared input falls back to
// a full check. A partial run never counts as the delivery check.
const argv = process.argv.slice(2)
const argValue = (name) => {
  const i = argv.indexOf(name)
  if (i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--')) return argv[i + 1]
  const pre = `${name}=`
  return argv.find((a) => a.startsWith(pre))?.slice(pre.length)
}
const SLIDES_ARG = argValue('--slides')
const CHANGED = argv.includes('--changed')
const EXPLAIN = argv.includes('--explain')
if (KIT_ONLY && (SLIDES_ARG || CHANGED)) {
  console.error('qa: --slides and --changed check the deck; they cannot be combined with --kit.')
  process.exit(2)
}
const sha = (text) => createHash('sha256').update(text).digest('hex').slice(0, 20)
const read = (file) => readFileSync(file, 'utf8')
const CACHE_FILE = join(OUT, '.check-cache.json')

function walkFiles(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'qa' || name === 'dist' || name === '.git') continue
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walkFiles(full, out)
    else out.push(full)
  }
  return out
}

/** Engine, templates, styles, fonts, scripts and deck assets. A change here forces a full check. */
function sharedFingerprint() {
  const files = []
  for (const rel of ['src/deck', 'src/engine', 'src/kit', 'src/styles', 'src/assets']) walkFiles(join(ROOT, rel), files)
  for (const rel of ['cli/pcafe.mjs', 'scripts/qa.mjs', 'vite.config.ts', 'vite.studio.config.ts', 'index.html', 'package.json']) {
    const full = join(ROOT, rel)
    if (existsSync(full)) files.push(full)
  }
  // Deck-local assets (images, fonts, data files) are shared by the whole deck;
  // .ts/.tsx files change per slide and are compared through rendered signatures.
  for (const full of walkFiles(join(ROOT, 'src', 'decks'))) {
    if (!/\.(ts|tsx)$/.test(full) && !full.endsWith('/active.ts')) files.push(full)
  }
  const parts = files.sort().map((f) => `${relative(ROOT, f)}=${sha(readFileSync(f))}`)
  return { engine: sha(parts.join('\n')), files: parts.length }
}

/** Cheap pass over the built deck: count, real ids and theme/style settings, without settling. */
async function probeDeck() {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
  const page = await context.newPage()
  try {
    await page.goto(`${URL}#/1`)
    await page.waitForSelector('.slide-frame', { timeout: 5000 })
    const total = await page.locator('.progress__seg').count()
    const settings = await page.evaluate(() =>
      // Theme and style are written as CSS variables on the root; do not sample a
      // heading here, because a reordered deck starts with a different template.
      [document.documentElement.getAttribute('style') ?? '', document.body.className].join('\n'),
    )
    const ids = await page.$$eval('.progress__seg', (els) => els.map((e) => e.dataset.slideId ?? ''))
    const slides = Array.from({ length: total }, (_, i) => ({ n: i + 1, id: ids[i] || String(i + 1), hash: null }))
    return { total, ids, slides, settings }
  } finally {
    await context.close()
  }
}

/** Settle and hash the requested slides in up to four parallel pages. */
async function probeSignatures(numbers) {
  const list = [...new Set(numbers)].sort((a, b) => a - b)
  if (!list.length) return new Map()
  const workers = Math.min(4, list.length)
  const chunks = Array.from({ length: workers }, () => [])
  list.forEach((n, i) => chunks[i % workers].push(n))
  const results = new Map()
  await Promise.all(
    chunks.filter((c) => c.length).map(async (chunk) => {
      const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
      const page = await context.newPage()
      const frameAt = (n) => `.slide-frame[data-slide-number="${n}"]`
      try {
        await page.goto(`${URL}#/1`)
        await page.waitForSelector('.slide-frame', { timeout: 5000 })
        let current = 1
        for (const n of chunk) {
          if (n !== current) {
            await page.evaluate((i) => (location.hash = `#/${i}`), n)
            current = n
          }
          try {
            await page.waitForFunction(
              ({ n: number, selector }) => {
                const frame = document.querySelector(selector)
                return location.hash === `#/${number}` && !!frame && frame.dataset.settled === 'true'
              },
              { n, selector: frameAt(n) },
              { timeout: SETTLE_TIMEOUT, polling: 50 },
            )
          } catch {
            throw new Error(`slide ${n} did not settle while probing`)
          }
          const data = await page.evaluate(({ selector }) => {
            const frame = document.querySelector(selector)
            if (!frame) return null
            const clean = (el) => {
              el.removeAttribute('data-settled')
              if (el.hasAttribute('style')) {
                for (const prop of ['transform', 'opacity', 'filter', 'clip-path', 'will-change', 'translate', 'scale', 'rotate']) el.style.removeProperty(prop)
                if (!el.getAttribute('style')?.trim()) el.removeAttribute('style')
              }
            }
            const clone = frame.cloneNode(true)
            clean(clone)
            for (const el of clone.querySelectorAll('*')) clean(el)
            return { id: frame.dataset.slide ?? '', html: clone.outerHTML }
          }, { selector: frameAt(n) })
          if (!data) throw new Error(`slide ${n} disappeared while probing`)
          results.set(n, { id: data.id, hash: sha(data.html) })
        }
      } finally {
        await context.close()
      }
    }),
  )
  return results
}

function readCache() {
  try {
    return JSON.parse(readFileSync(CACHE_FILE, 'utf8'))
  } catch {
    return null
  }
}

const newest = (dir, filter = () => true) => {
  let newestAt = 0
  for (const file of walkFiles(dir)) if (filter(file)) newestAt = Math.max(newestAt, statSync(file).mtimeMs)
  return newestAt
}

/** Pick the slides to audit; every full-run fallback prints its reason. */
async function chooseSlides() {
  // Cheap first pass: count, real ids and theme/style settings, without settling.
  let probe
  try {
    probe = await probeDeck()
  } catch (error) {
    console.log(`full check: could not read the built deck (${error.message}); running every slide`)
    return { all: true, fp: null }
  }
  const shared = sharedFingerprint()
  const fp = {
    engine: shared.engine,
    settings: sha(probe.settings),
    ids: probe.ids,
    slides: probe.slides,
    build: existsSync(DIST) ? sha(readFileSync(DIST)) : null,
    total: probe.total,
  }
  const sign = async (numbers) => {
    const list = numbers === 'all' ? Array.from({ length: fp.total }, (_, i) => i + 1) : numbers
    try {
      const signed = await probeSignatures(list)
      for (const [n, data] of signed) {
        const slide = fp.slides[n - 1]
        slide.id = data.id || slide.id
        slide.hash = data.hash
      }
      return true
    } catch (error) {
      console.log(`full check: could not read the built deck (${error.message}); running every slide`)
      return false
    }
  }
  if (SLIDES_ARG) {
    const wanted = SLIDES_ARG.split(',').map((x) => Number(x.trim())).filter((x) => Number.isInteger(x) && x > 0)
    const bad = wanted.filter((n) => n > fp.total)
    if (!wanted.length) {
      console.error('qa: --slides needs one or more slide numbers, e.g. --slides 3,5.')
      process.exit(2)
    }
    if (bad.length) {
      console.error(`qa: --slides ${bad.join(',')}: the deck has ${fp.total} slides.`)
      process.exit(2)
    }
    const selected = [...new Set(wanted)].sort((a, b) => a - b)
    if (!(await sign(selected))) return { all: true, fp }
    return { all: selected.length === fp.total, selected, fp }
  }
  if (!CHANGED) return { all: true, fp }
  const cache = readCache()
  if (!cache) {
    console.log('full check: no cache; running every slide')
    return { all: true, fp }
  }
  if (cache.version !== 1) {
    console.log('full check: cache version changed; running every slide')
    return { all: true, fp }
  }
  if (cache.engine !== fp.engine) {
    console.log('full check: engine, shared styles or fonts changed; running every slide')
    return { all: true, fp }
  }
  if (cache.settings !== fp.settings) {
    console.log('full check: theme or style changed; running every slide')
    return { all: true, fp }
  }
  if (cache.ids.join('\u0000') !== fp.ids.join('\u0000')) {
    console.log('full check: slide order or count changed; running every slide')
    return { all: true, fp }
  }
  // active.ts is rewritten by `pcafe check` after each run; slide ids and
  // signatures already cover what it selects, so its time is not compared.
  const deckSourceAt = Math.max(newest(join(ROOT, 'src', 'decks'), (f) => !f.endsWith('/active.ts')), newest(join(ROOT, 'src', 'kit')), newest(join(ROOT, 'src', 'styles')))
  if (!fp.build || statSync(DIST).mtimeMs < deckSourceAt) {
    console.log('full check: build output is older than the deck source; running every slide')
    return { all: true, fp }
  }
  if (!(await sign('all'))) return { all: true, fp }
  const changed = fp.slides.filter((s) => cache.slides?.[`${s.n}:${s.id}`] !== s.hash)
  if (!changed.length) {
    if (cache.build !== fp.build) {
      console.log('full check: the build changed but no slide shows it; running every slide')
      return { all: true, fp }
    }
    return { all: false, selected: [], fp, noChanges: true }
  }
  console.log(`changed: slides ${changed.map((s) => s.n).join(', ')} of ${fp.total}`)
  return { all: false, selected: changed.map((s) => s.n), fp }
}

function writeCache(fp, checked, full) {
  if (!fp) return
  const old = readCache()
  // A partial run may carry untouched hashes only when the shared fingerprint,
  // theme/style settings and slide order all match the old cache. After a
  // shared change, every unchecked slide must look changed.
  const sameShared =
    old?.version === 1 &&
    old.engine === fp.engine &&
    old.settings === fp.settings &&
    old.ids.join('\u0000') === fp.ids.join('\u0000')
  const slides = full ? {} : { ...(sameShared ? old.slides : {}) }
  for (const slide of fp.slides) if (slide.hash && checked.includes(slide.n)) slides[`${slide.n}:${slide.id}`] = slide.hash
  const data = { version: 1, last: full ? 'full' : 'partial', engine: fp.engine, settings: fp.settings, ids: fp.ids, build: fp.build, slides }
  writeFileSync(CACHE_FILE, JSON.stringify(data, null, 1))
}

function findChromium() {
  const base = join(homedir(), '.cache', 'ms-playwright')
  const dirs = existsSync(base) ? readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort() : []
  for (const d of dirs.reverse()) {
    for (const sub of ['chrome-linux-arm64/chrome', 'chrome-linux/chrome', 'chrome-linux64/chrome']) {
      const p = join(base, d, sub)
      if (existsSync(p)) return p
    }
  }
  return undefined
}

const twoFrames = (page) => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))

const browser = await launchChromium({ executablePath: findChromium() })

const selection = KIT_ONLY ? { all: true, fp: null } : await chooseSlides()
const CHECK_ALL = selection.all
const SELECTED = CHECK_ALL ? null : selection.selected
const PARTIAL = !CHECK_ALL
if (selection.fp) SLIDES = selection.fp.total
if (selection.noChanges) {
  report.slides = SLIDES
  report.checked = []
  report.partial = { slides: [], total: SLIDES }
  writeFileSync(join(OUT, 'report.json'), JSON.stringify(report, null, 2))
  await browser.close()
  console.log('changed: no slides changed since the last passing check')
  console.log('run a full check before delivery')
  if (EXPLAIN) {
    console.log('explain: no slides would run')
    console.log('PASS — explain only; no checks run')
    process.exit(0)
  }
  console.log('PASS — no slides changed since the last passing check (partial)')
  process.exit(0)
}
if (EXPLAIN) {
  console.log(`explain: would run ${CHECK_ALL ? 'a full check' : `a partial check: slides ${SELECTED.join(', ')} of ${SLIDES}`}`)
  console.log('PASS — explain only; no checks run')
  await browser.close()
  process.exit(0)
}


/**
 * Put every continuous animation in `selector` at the same time offset the
 * batch-2 baseline captured. Infinite CSS loops never settle, so their phase
 * would otherwise depend on CPU speed; pinning makes the screenshots
 * deterministic and keeps them comparable with the baseline.
 */
const pinSlide = async (page, frameMs, backdropMs) => {
  await pinPhase(page, frameMs, '.slide-frame')
  await pinPhase(page, backdropMs, '.backdrop-layer', true)
}

const pinPhase = (page, ms, selector = '.stage', pause = false) =>
  page.evaluate(
    ({ ms, selector, pause }) => {
      for (const root of document.querySelectorAll(selector))
        for (const a of root.getAnimations?.({ subtree: true }) ?? []) {
          const end = a.effect?.getComputedTiming?.().endTime
          if (a.effect && (!Number.isFinite(end ?? Infinity) || (end ?? 0) > 5000)) {
            try {
              a.currentTime = ms
              if (pause) a.pause()
            } catch {
              /* an animation without a usable current time stays as it is */
            }
          }
        }
    },
    { ms, selector },
  )

/**
 * Wait for the deck's own settle signal, then fonts and two frames. `phaseMs`
 * pins continuous animations to the phase the fixed batch-2 waits used.
 */
async function settleFrame(page, label, reportFail = fail) {
  try {
    await page.waitForSelector('.slide-frame', { timeout: SETTLE_TIMEOUT })
    await page.waitForFunction(() => document.querySelector('.slide-frame')?.dataset.settled === 'true', null, { timeout: SETTLE_TIMEOUT, polling: 50 })
  } catch {
    reportFail(`${label}: slide never settled within ${SETTLE_TIMEOUT} ms: ${SETTLE_HINT}`)
    return false
  }
  await page.evaluate(() => document.fonts.ready)
  await twoFrames(page)
  return true
}

async function openPage(viewport, opts = {}, hash = `#/${BENTO_N || 1}`, base = URL, reportFail = fail) {
  const context = await browser.newContext({ viewport: { width: viewport[0], height: viewport[1] }, ...opts })
  await context.setOffline(true)
  const page = await context.newPage()
  const external = []
  const errors = []
  page.on('request', (r) => {
    const u = r.url()
    if (!u.startsWith('file:') && !u.startsWith('data:') && !u.startsWith('blob:')) external.push(u)
  })
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.goto(base + hash)
  await page.waitForSelector('.slide, .kit')
  if (base === STUDIO_URL) {
    // Gallery: previews render their final state under reduced motion; keep the
    // batch-2 capture phase so gallery-top screenshots stay identical.
    await page.waitForTimeout(1900) // gallery capture phase, not an animation wait
  } else {
    await settleFrame(page, `open ${viewport.join('x')}`, reportFail)
  }
  return { context, page, external, errors }
}

async function goSlide(page, n, reportFail = fail) {
  const before = await page.evaluate(() => ({ hash: location.hash, slide: document.querySelector('.slide-frame')?.dataset.slide ?? null }))
  if (before.hash === `#/${n}`) return
  await page.evaluate((n) => (location.hash = `#/${n}`), n)
  try {
    const numbered = await page.evaluate(() => document.querySelector('.slide-frame')?.dataset.slideNumber !== undefined)
    await page.waitForFunction(
      (arg) => {
        const frame = document.querySelector('.slide-frame')
        if (!frame || frame.dataset.settled !== 'true') return false
        // Slide ids may repeat (a deck built by combining example decks), so match the number when present.
        return arg.numbered ? frame.dataset.slideNumber === String(arg.n) : frame.dataset.slide !== arg.prev
      },
      { numbered, n, prev: before.slide },
      { timeout: SETTLE_TIMEOUT, polling: 50 },
    )
  } catch {
    reportFail(`slide ${n} never settled within ${SETTLE_TIMEOUT} ms: ${SETTLE_HINT}`)
    return
  }
  await page.evaluate(() => document.fonts.ready)
  await twoFrames(page)
}

/**
 * The phase the old fixed waits produced at the screenshot moment, minus the
 * two frames between pin and capture. Slide 1 includes the 1900 ms open; a
 * backdrop that survived from an earlier slide has run for the whole old time.
 */
async function backdropPhase(page, n) {
  return page.evaluate((slide) => {
    const layer = document.querySelector('.backdrop-layer')
    const anims = layer?.getAnimations({ subtree: true }) ?? []
    if (!anims.length) return 0
    if (slide === 1) return 3618
    const now = Number(document.timeline?.currentTime ?? performance.now())
    const oldest = Math.min(...anims.map((a) => Number(a.startTime)).filter((x) => Number.isFinite(x)))
    const persistent = Number.isFinite(oldest) && now - oldest > 2000
    return persistent ? 1900 + slide * 1700 + 30 : 1661
  }, n)
}

/** Whole-slide checks: safe area, clipping, collisions between text blocks. */
async function slideAudit(page) {
  return page.evaluate(() => {
    const issues = []
    const stage = document.querySelector('.stage').getBoundingClientRect()
    const u = stage.width / 1920
    const frame = document.querySelector('.slide-frame')
    const lines = []
    const walker = document.createTreeWalker(frame, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) {
      const node = walker.currentNode
      const el = node.parentElement
      // Decorative text (aria-hidden: background words, avatars) may sit under real text.
      if (!node.textContent.trim() || el.closest('.numeral') || el.closest('[aria-hidden]')) continue
      if (getComputedStyle(el).visibility === 'hidden') continue
      const range = document.createRange()
      range.selectNodeContents(node)
      // CJK content areas are taller than tight line-heights, so collisions are
      // measured on the em box (font-size tall, centred) rather than the raw rect.
      const em = parseFloat(getComputedStyle(el).fontSize)
      for (const r of range.getClientRects()) {
        if (r.width < 1) continue
        const mid = (r.top + r.bottom) / 2, h = Math.min(r.height, em)
        lines.push({ el, r: { left: r.left, right: r.right, width: r.width, top: mid - h / 2, bottom: mid + h / 2, height: h }, text: node.textContent.trim().slice(0, 20) })
        const x0 = (r.left - stage.left) / u, x1 = (r.right - stage.left) / u
        const y0 = (r.top - stage.top) / u, y1 = (r.bottom - stage.top) / u
        // Decorative glyphs (aria-hidden, e.g. Question's giant mark) may bleed off the slide.
        if (!el.closest('[aria-hidden]') && (x0 < 48 || x1 > 1872 || y0 < 24 || y1 > 1060)) issues.push(`text "${node.textContent.trim().slice(0, 20)}" outside the safe area (${x0.toFixed(0)},${y0.toFixed(0)})-(${x1.toFixed(0)},${y1.toFixed(0)})`)
      }
    }
    // Text collisions: line boxes of different elements may not overlap.
    for (let i = 0; i < lines.length; i++)
      for (let j = i + 1; j < lines.length; j++) {
        const a = lines[i], b = lines[j]
        if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue
        const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left)
        const h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top)
        if (w <= 0 || h <= 0) continue
        const area = Math.min(a.r.width * a.r.height, b.r.width * b.r.height)
        if ((w * h) / area > 0.12) issues.push(`text collision: "${a.text}" × "${b.text}"`)
      }
    for (const el of frame.querySelectorAll('*')) {
      const cs = getComputedStyle(el)
      if ((cs.overflowX !== 'visible' || cs.overflowY !== 'visible') && !el.classList.contains('numeral__mask') && !el.classList.contains('life__seg') && !el.closest('.detail') && !el.hasAttribute('data-crop'))
        if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) issues.push(`${el.tagName.toLowerCase()}.${el.className} clips content`)
      if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
        const px = parseFloat(cs.fontSize) / u
        if (px < 16.5) issues.push(`font ${px.toFixed(1)}u too small: "${el.textContent.trim().slice(0, 20)}"`)
      }
    }
    for (const seg of frame.querySelectorAll('.life__seg'))
      if (seg.scrollWidth > seg.clientWidth + 1) issues.push(`lifecycle label "${seg.textContent}" does not fit its bar`)
    return [...new Set(issues)]
  })
}

/** Every text-bearing element must sit inside its card and inside the stage, unclipped. */
async function layoutAudit(page, scope) {
  return page.evaluate((scope) => {
    const issues = []
    const stage = document.querySelector('.stage').getBoundingClientRect()
    const u = stage.width / 1920
    const containers = [...document.querySelectorAll(scope)]
    for (const box of containers) {
      const b = box.getBoundingClientRect()
      const name = box.className.split(' ').slice(0, 2).join('.')
      if (b.right > stage.right + 1 || b.bottom > stage.bottom + 1 || b.left < stage.left - 1 || b.top < stage.top - 1)
        issues.push(`${name} leaves the stage`)
      const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT)
      while (walker.nextNode()) {
        const node = walker.currentNode
        if (!node.textContent.trim()) continue
        // Display numerals: the font line box is far taller than the glyphs; the
        // mask box below is the real clip region, so audit that instead.
        if (node.parentElement.closest('.numeral')) continue
        const range = document.createRange()
        range.selectNodeContents(node)
        for (const r of range.getClientRects()) {
          if (r.width === 0) continue
          const tol = 2 * u
          if (r.right > b.right - 8 * u + tol || r.left < b.left + 8 * u - tol || r.bottom > b.bottom - 4 * u + tol || r.top < b.top - tol)
            issues.push(`${name}: text "${node.textContent.trim().slice(0, 24)}" touches/overflows its container`)
        }
      }
      for (const m of box.querySelectorAll('.numeral__mask')) {
        const r = m.getBoundingClientRect()
        if (r.left < b.left || r.right > b.right || r.top < b.top || r.bottom > b.bottom) issues.push(`${name}: hero numeral leaves its card`)
      }
      for (const el of box.querySelectorAll('*')) {
        const cs = getComputedStyle(el)
        if ((cs.overflowX !== 'visible' || cs.overflowY !== 'visible') && !el.classList.contains('numeral__mask'))
          if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1)
            issues.push(`${name}: ${el.tagName.toLowerCase()}.${el.className} clips content (${el.scrollWidth}×${el.scrollHeight} > ${el.clientWidth}×${el.clientHeight})`)
      }
    }
    // Minimum size: nothing below 17 design px.
    for (const el of document.querySelectorAll(`${scope} *`)) {
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue
      const px = parseFloat(getComputedStyle(el).fontSize) / u
      if (px < 16.5) issues.push(`font ${px.toFixed(1)}u too small: "${el.textContent.trim().slice(0, 20)}"`)
    }
    const fonts = {
      geist: document.fonts.check('500 40px Geist'),
      mono: document.fonts.check('400 40px "Geist Mono"'),
      serif: document.fonts.check('italic 400 40px "Instrument Serif"'),
      cjk400: document.fonts.check('400 40px "Deck Sans SC"', '中'),
      cjk500: document.fonts.check('500 40px "Deck Sans SC"', '中'),
    }
    return { issues: [...new Set(issues)], fonts, stage: { w: stage.width, h: stage.height, ratio: +(stage.width / stage.height).toFixed(4) } }
  }, scope)
}

/** How far down the slide the content reaches, ignoring header, footer source and display numerals. */
async function contentDepth(page) {
  return page.evaluate(() => {
    const stage = document.querySelector('.stage').getBoundingClientRect()
    const u = stage.width / 1920
    let bottom = 0
    for (const el of document.querySelectorAll('.slide-frame *')) {
      if (el.closest('.s-source, .numeral, .slide-header, .hard__num')) continue
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue
      bottom = Math.max(bottom, (el.getBoundingClientRect().bottom - stage.top) / u)
    }
    // Templates whose lower area is filled by a display numeral (NumberedColumns,
    // Teaser) may end their text higher; the reference deck sets these floors.
    // Statement is centred on purpose and has no floor.
    const q = (sel) => document.querySelector(`.slide-frame ${sel}`)
    const min = q('.statement') || q('.tabshot__view') || q('.s-thanks') || q('.folders') ? 0 : q('.hard__cols') ? 520 : q('.forky__num') ? 640 : 760
    return { depth: Math.round(bottom), min }
  })
}

const rect = (page, sel) => page.locator(sel).evaluate((el) => el.getBoundingClientRect().toJSON())

// 1 ─ Every slide at every viewport ──────────────────────────────────────
let speakerNotes = ''
if (!KIT_ONLY) {
  /** Run `fn` over `items` with at most `limit` in flight; results keep input order. */
  async function mapLimit(items, limit, fn) {
    const out = new Array(items.length)
    let next = 0
    const worker = async () => {
      for (;;) {
        const i = next++
        if (i >= items.length) return
        out[i] = await fn(items[i], i)
      }
    }
    await Promise.all(Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, worker))
    return out
  }

  /**
   * One viewport, one context. Everything it learns stays local so viewports can
   * run at the same time; the caller merges the results in a fixed order.
   */
  async function auditViewport(vp) {
    const key = vp.join('x')
    const result = { key, slides: 0, bentoN: 0, checkN: 0, cards: [], issues: {}, warnings: [], failures: [] }
    const wfail = (m) => result.failures.push(m)
    const { context, page, external, errors } = await openPage(vp, {}, '#/1', URL, wfail)
    result.slides = await page.locator('.progress__seg').count()
    if (SLIDES && result.slides !== SLIDES) {
      result.failures.push(`viewport ${key} found ${result.slides} slides, expected ${SLIDES}`)
    }
    result.checked = SELECTED ?? Array.from({ length: result.slides }, (_, i) => i + 1)
    for (const n of result.checked) {
      await goSlide(page, n, wfail)
      if (key === '1920x1080') {
        const html = await page.evaluate(() => {
          const frame = document.querySelector('.slide-frame')
          if (!frame) return ''
          const clean = (el) => {
            el.removeAttribute('data-settled')
            if (el.hasAttribute('style')) {
              for (const prop of ['transform', 'opacity', 'filter', 'clip-path', 'will-change', 'translate', 'scale', 'rotate']) el.style.removeProperty(prop)
              if (!el.getAttribute('style')?.trim()) el.removeAttribute('style')
            }
          }
          const clone = frame.cloneNode(true)
          clean(clone)
          for (const el of clone.querySelectorAll('*')) clean(el)
          return clone.outerHTML
        })
        result.hashes ??= {}
        result.hashes[n] = html ? sha(html) : null
      }
      const issues = await slideAudit(page)
      if (n === 1) {
        // Fonts are checked on every deck, not only on decks with a Bento.
        const fonts = await page.evaluate(async () => {
          const specs = ['500 40px Geist', '400 40px "Geist Mono"', 'italic 400 40px "Instrument Serif"', '400 40px "Deck Sans SC"', '500 40px "Deck Sans SC"']
          await Promise.all(specs.map((f) => document.fonts.load(f, '中a').catch(() => null)))
          return {
          geist: document.fonts.check('500 40px Geist'),
          mono: document.fonts.check('400 40px "Geist Mono"'),
          serif: document.fonts.check('italic 400 40px "Instrument Serif"'),
          cjk400: document.fonts.check('400 40px "Deck Sans SC"', '中'),
          cjk500: document.fonts.check('500 40px "Deck Sans SC"', '中'),
          }
        })
        Object.entries(fonts).forEach(([k, ok]) => ok || result.failures.push(`${key}: font ${k} not loaded`))
      }
      if (await page.locator('.slide-frame .prep__item').count()) result.checkN = n
      if (await page.locator('.slide-frame .bento').count()) {
        result.bentoN = n
        result.cards = await page.$$eval('.card[data-card]', (els) => els.map((e) => e.dataset.card))
        const audit = await layoutAudit(page, '.card')
        issues.push(...audit.issues)
        if (Math.abs(audit.stage.ratio - 16 / 9) > 0.002) result.failures.push(`${key}: stage ratio ${audit.stage.ratio}`)
      }
      if (key === '1920x1080') {
        const { depth, min } = await contentDepth(page)
        if (depth < min) result.warnings.push(`slide ${n}: content ends at y=${depth} of 1080, the lower part looks empty (add an optional block or more items, see docs/zh-CN/README.md §8)`)
      }
      result.issues[n] = issues
      issues.forEach((i) => result.failures.push(`${key} slide ${n}: ${i}`))
      if (SHOT_VIEWPORTS.includes(key)) {
        // Pin after the audit, so the audit sees the settled frame, and immediately before the shot.
        await pinSlide(page, n === 1 ? 3600 : 1700, await backdropPhase(page, n))
        await page.screenshot({ path: join(OUT, `slide-${String(n).padStart(2, '0')}-${key}.png`) })
      }
    }
    if (external.length) result.failures.push(`${key}: external requests ${external.join(', ')}`)
    if (errors.length) result.failures.push(`${key}: console errors ${errors.join(' | ')}`)
    await context.close()
    return result
  }

  const viewportResults = await mapLimit(VIEWPORTS, JOBS, auditViewport)
  const primary = viewportResults.find((r) => r.key === '1920x1080') ?? viewportResults[0]
  if (selection.fp && primary.hashes) {
    for (const slide of selection.fp.slides) {
      const hash = primary.hashes[slide.n]
      if (hash) slide.hash = hash
    }
  }
  SLIDES = primary.slides
  BENTO_N = primary.bentoN || viewportResults.find((r) => r.bentoN)?.bentoN || 0
  CHECK_N = primary.checkN || viewportResults.find((r) => r.checkN)?.checkN || 0
  CARDS = primary.cards.length ? primary.cards : (viewportResults.find((r) => r.cards.length)?.cards ?? [])
  for (const r of viewportResults) {
    if (r.slides !== SLIDES) fail(`viewports disagree on slide count: ${r.key} reports ${r.slides}, ${primary.key} reports ${SLIDES}`)
    report.viewports[r.key] = r.issues
    r.warnings.forEach((w) => warnings.push(w))
    r.failures.forEach((f) => fail(f))
  }
  phase('slides')

  // Contact sheet: every 1920x1080 slide in one image, built from the screenshots
  // above (no extra deck page loads). Full runs only; a partial sheet would lie.
  if (!PARTIAL) {
    const cells = []
    for (let n = 1; n <= SLIDES; n++) {
      const file = join(OUT, `slide-${String(n).padStart(2, '0')}-1920x1080.png`)
      if (existsSync(file)) cells.push(`<figure><img src="${pathToFileURL(file).href}" alt="slide ${n}"><figcaption>${String(n).padStart(2, '0')}</figcaption></figure>`)
    }
    if (cells.length) {
      const htmlFile = join(OUT, '.contact.html')
      writeFileSync(htmlFile, `<!doctype html><meta charset="utf-8"><style>
        *{box-sizing:border-box}body{margin:0;padding:24px;background:#111;color:#eee;font:14px/1.2 system-ui,sans-serif}
        main{display:grid;grid-template-columns:repeat(5,360px);gap:16px 18px}
        figure{margin:0}img{display:block;width:360px;height:202px;object-fit:cover;border:1px solid #333;background:#000}
        figcaption{padding-top:4px;color:#aaa;font-variant-numeric:tabular-nums}
      </style><main>${cells.join('')}</main>`)
      const sheet = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
      await sheet.goto(pathToFileURL(htmlFile).href)
      await sheet.waitForFunction(() => [...document.images].every((img) => img.complete), null, { timeout: 5000 }).catch(() => {})
      await sheet.screenshot({ path: join(OUT, 'contact-sheet.png'), fullPage: true })
      await sheet.close()
      unlinkSync(htmlFile)
    }
  }

  // A partial check stops after the selected slides: navigation, details,
  // presenter, keyboard and overview tests are deck-wide and cannot be limited.
  if (!PARTIAL) {
  // 1b ─ Deck navigation ─────────────────────────────────────────────────────
  const waitHash = (page, want) => page.waitForFunction((w) => location.hash === w, want, { timeout: 2000, polling: 50 })

  /** Wait for finite document animations (overlays, morphs) to finish, then two frames. */
  async function settleMotion(page) {
    try {
      await page.waitForFunction(() => !document.getAnimations().some((a) => a.playState === 'running' && Number.isFinite(a.effect?.getComputedTiming?.().endTime ?? Infinity)), null, { timeout: 2000, polling: 50 })
    } catch {
      // A JS-driven layout animation may not show up here; the caller still checks the result.
    }
    await twoFrames(page)
  }

  /** Wait until an element's box stops changing between polls (covers JS-driven layout animations). */
  async function waitRectStable(page, selector, timeout = 2000) {
    const box = () => page.evaluate((s) => document.querySelector(s)?.getBoundingClientRect().toJSON() ?? null, selector)
    const started = Date.now()
    let last = await box()
    while (Date.now() - started < timeout) {
      await page.waitForTimeout(50) // poll interval for the box check, not an animation wait
      const now = await box()
      if (!now || !last) return
      if (['x', 'y', 'width', 'height'].every((k) => Math.abs(now[k] - last[k]) < 0.01)) return
      last = now
    }
  }


  {
    const { context, page } = await openPage([1366, 768], {}, '#/1')
    const hash = () => page.evaluate(() => location.hash)
    const expect = async (want, what) => {
      const got = await hash()
      if (got !== want) fail(`navigation: ${what} → ${got}, expected ${want}`)
    }
    await page.keyboard.press('ArrowRight'); await waitHash(page, '#/2').catch(() => {}); await expect('#/2', 'ArrowRight')
    if (BENTO_N) {
      await goSlide(page, BENTO_N)
      await page.click(card(CARDS[1]))
      const opened = await page.waitForSelector('.detail', { timeout: DETAIL_TIMEOUT }).then(() => true).catch(() => false)
      if (!opened) fail(`detail ${CARDS[1]}: did not open`)
      await settleMotion(page)
      if (opened) {
        await page.keyboard.press('ArrowRight'); await page.keyboard.press('PageDown'); await settleMotion(page)
        await expect(`#/${BENTO_N}`, 'arrows inside an open Bento detail')
        await page.keyboard.press('Escape')
        const closed = await page.waitForSelector('.detail', { state: 'detached', timeout: DETAIL_TIMEOUT }).then(() => true).catch(() => false)
        if (!closed) fail(`detail ${CARDS[1]}: did not close`)
        await settleMotion(page)
      }
    }
    await page.keyboard.press('End'); await waitHash(page, `#/${SLIDES}`).catch(() => {}); await expect(`#/${SLIDES}`, 'End')
    await page.keyboard.press('Home'); await waitHash(page, '#/1').catch(() => {}); await expect('#/1', 'Home')
    await page.keyboard.press('Space'); await waitHash(page, '#/2').catch(() => {}); await expect('#/2', 'Space')
    await page.keyboard.press('ArrowLeft'); await waitHash(page, '#/1').catch(() => {}); await expect('#/1', 'ArrowLeft')
    const target = CHECK_N || SLIDES
    await page.click(`.progress__seg:nth-child(${target})`); await waitHash(page, `#/${target}`).catch(() => {}); await expect(`#/${target}`, 'progress click')
    if (CHECK_N) {
      // Checklist toggles must not page away (Space on a focused checkbox).
      await page.click('.prep__item >> nth=0'); await page.keyboard.press('Space'); await settleMotion(page)
      await expect(`#/${CHECK_N}`, 'Space on a focused checklist item')
    }
    await context.close()
  }

  phase('navigation')

  // 1c ─ Keyboard walk-through: builds step, then advance; morph ghosts clean up; overview ─
  {
    const { context, page, errors } = await openPage([1366, 768], {}, '#/1')
    const state = () =>
      page.evaluate(() => ({
        hash: location.hash,
        pending: document.querySelectorAll('.slide-frame [data-build-state="pending"]').length,
        ghosts: document.querySelectorAll('.morph-ghost').length,
      }))
    let presses = 0
    let steps = 0
    let builds = 0
    for (let guard = 0; guard < SLIDES * 12; guard++) {
      const before = await state()
      if (before.hash === `#/${SLIDES}` && !before.pending) break
      await page.keyboard.press('ArrowRight')
      try {
        // Only the revealed count and the slide number matter here, not motion:
        // both change with React's commit, so this is a state wait (no settle).
        await page.waitForFunction(
          (prev) => location.hash !== prev.hash || document.querySelectorAll('.slide-frame [data-build-state="pending"]').length !== prev.pending,
          { hash: before.hash, pending: before.pending },
          { timeout: 800, polling: 50 },
        )
      } catch {
        // No advance: the check below reports it with the same message as before.
      }
      presses++
      const after = await state()
      if (after.hash === before.hash) {
        // Grouped steps may reveal several elements at once; each press must reveal something.
        if (after.pending >= before.pending) fail(`builds: → on ${before.hash} neither advanced nor revealed anything`)
        steps++
      } else if (after.pending) builds++
    }
    const end = await state()
    if (end.hash !== `#/${SLIDES}`) fail(`builds: keyboard walk-through stopped at ${end.hash}`)
    await page.waitForFunction(() => !document.querySelector('.morph-ghost'), null, { timeout: 2000 }).catch(() => {})
    if ((await state()).ghosts) fail('morph: ghost elements left in the morph layer')
    report.walkthrough = { presses, steps, buildSlides: builds }

    // Overview: G opens every slide as a thumbnail; → then Enter opens the next one.
    await goSlide(page, 1)
    await twoFrames(page)
    await page.keyboard.press('g')
    await page.waitForSelector('.ov')
    // Phase hold, not an animation wait: overview-1366x768.png was captured 900 ms
    // after G in the batch-2 baseline, and its thumbnails run continuous animations.
    await page.waitForTimeout(900) // fixed capture phase for overview-1366x768.png (see comment above)
    const thumbs = await page.locator('.ov__item').count()
    if (thumbs !== SLIDES) fail(`overview: ${thumbs}/${SLIDES} thumbnails`)
    await page.screenshot({ path: join(OUT, 'overview-1366x768.png') })
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('Enter')
    await page.waitForSelector('.ov', { state: 'detached' })
    if (await page.locator('.ov').count()) fail('overview: Enter did not close it')
    const picked = await page.evaluate(() => location.hash)
    if (picked !== '#/2') fail(`overview: → Enter opened ${picked}, expected #/2`)
    await page.keyboard.press('g')
    await page.waitForSelector('.ov')
    await page.keyboard.press('Escape')
    await page.waitForSelector('.ov', { state: 'detached' }).catch(() => {})
    if (await page.locator('.ov').count()) fail('overview: Esc did not close it')
    // Presenter controls: hidden until the pointer moves; the next button advances.
    const shownBefore = await page.locator('.controls.is-shown').count()
    if (shownBefore) fail('controls: visible before any pointer movement')
    await page.mouse.move(600, 400)
    await page.mouse.move(700, 420)
    await page.waitForSelector('.controls.is-shown', { timeout: 1500 }).catch(() => {})
    if (!(await page.locator('.controls.is-shown').count())) fail('controls: did not appear on pointer move')
    const ctlPrev = await page.evaluate(() => document.querySelector('.slide-frame')?.dataset.slide ?? null)
    await page.evaluate(() => (location.hash = '#/1'))
    await page.waitForFunction(
      (prev) => {
        const f = document.querySelector('.slide-frame')
        return location.hash === '#/1' && !!f && f.dataset.slide !== prev && f.dataset.settled === 'true'
      },
      ctlPrev,
      { timeout: SETTLE_TIMEOUT, polling: 50 },
    ).catch(() => {})
    await twoFrames(page)
    await page.mouse.move(650, 410)
    await page.waitForSelector('.controls.is-shown', { timeout: 1500 }).catch(() => {})
    await page.locator('.controls button[aria-label="下一步"]').click()
    await waitHash(page, '#/2').catch(() => {})
    const ctlHash = await page.evaluate(() => location.hash)
    if (ctlHash !== '#/2') fail(`controls: next opened ${ctlHash}, expected #/2`)
    if (errors.length) fail(`walk-through console errors: ${errors.join(' | ')}`)
    await context.close()
  }

  phase('walkthrough')

  // 2 ─ Every detail view + 3× open/close round trips ───────────────────────
  if (BENTO_N) {
    const { context, page, errors } = await openPage([1920, 1080])
    for (const id of CARDS) {
      const sel = card(id)
      const before = await rect(page, sel)
      const drift = []
      for (let n = 0; n < 3; n++) {
        await page.click(sel)
        const opened = await page.waitForSelector('.detail', { timeout: DETAIL_TIMEOUT }).then(() => true).catch(() => false)
        if (!opened) {
          fail(`detail ${id}: did not open`)
          break
        }
        await settleMotion(page)
        await waitRectStable(page, '.detail')
        // Pin continuous animations to the batch-2 capture phase (this long after the click).
        await pinPhase(page, n === 0 ? 1500 : 1000, '.detail')
        await twoFrames(page)
        if (n === 0) {
          const audit = await layoutAudit(page, '.detail')
          audit.issues.forEach((i) => fail(`detail ${id}: ${i}`))
          await page.screenshot({ path: join(OUT, `detail-${id}.png`) })
        }
        const focused = await page.evaluate(() => document.activeElement?.className ?? '')
        if (!focused.includes('detail__close')) fail(`detail ${id}: focus not on close button (${focused})`)
        // Arrow keys must not escape the sub-scene.
        await page.keyboard.press('ArrowRight')
        if (!(await page.locator('.detail').count())) fail(`detail ${id}: ArrowRight closed the sub-scene`)
        await page.keyboard.press('Escape')
        const closed = await page.waitForSelector('.detail', { state: 'detached', timeout: DETAIL_TIMEOUT }).then(() => true).catch(() => false)
        if (!closed) {
          fail(`detail ${id}: did not close`)
          break
        }
        await waitRectStable(page, sel)
        const after = await rect(page, sel)
        drift.push(Math.max(...['x', 'y', 'width', 'height'].map((k) => Math.abs(after[k] - before[k]))))
        const back = await page.evaluate(() => document.activeElement?.getAttribute('data-card') ?? document.activeElement?.className)
        if (back !== id) fail(`detail ${id}: focus not restored to card (${back})`)
      }
      report.roundTrips[id] = drift.map((d) => +d.toFixed(2))
      if (Math.max(...drift) > 0.5) fail(`detail ${id}: card did not return to its slot (drift ${drift})`)
    }
    if (errors.length) fail(`interaction console errors: ${errors.join(' | ')}`)

    if (FRAMES) {
      // Mid-morph frames for visual review of the shared-element transition.
      const frames = async (prefix, marks) => {
        let t0 = 0
        for (const t of marks) {
          await page.waitForTimeout(t - t0) // intentional: --frames samples exact morph times
          t0 = t
          await page.screenshot({ path: join(OUT, `${prefix}-${t}ms.png`) })
        }
      }
      await page.click(card(CARDS[2]))
      await frames('morph-stack', [90, 180, 300, 600])
      await page.waitForTimeout(600) // --frames: let the open morph finish before closing
      await page.keyboard.press('Escape')
      await frames('morph-back', [120, 260, 420])
      await page.waitForTimeout(900) // --frames: let the close morph finish
      await page.click(card(CARDS[0]))
      await frames('morph-release', [160, 300])
      await page.keyboard.press('Escape')
      await page.waitForTimeout(1100) // --frames: settle before hover states
      // Hover states, cropped to each card.
      for (const id of CARDS) {
        const box = await page.locator(card(id)).boundingBox()
        await page.mouse.move(box.x + box.width * 0.72, box.y + box.height * 0.3)
        await page.waitForTimeout(650) // --frames: hover transition before the clipped screenshot
        await page.screenshot({ path: join(OUT, `hover-${id}.png`), clip: box })
      }
      await page.mouse.move(2, 2)
    }
    await context.close()
  }

  if (FRAMES && BENTO_N) {
    // Intro choreography on a fresh load.
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
    const page = await context.newPage()
    await page.goto(`${URL}#/${BENTO_N}`)
    await page.waitForSelector('.card')
    let t0 = 0
    for (const t of [150, 450, 800]) {
      await page.waitForTimeout(t - t0) // intentional: --frames samples exact intro times
      t0 = t
      await page.screenshot({ path: join(OUT, `intro-${t}ms.png`) })
    }
    await context.close()
  }

  phase('details')

  // 3 ─ Keyboard-only path and reduced motion, on a fresh page ──────────────
  {
    // Every deck: arrow keys step through slides under reduced motion without errors.
    const { context, page, errors } = await openPage([1366, 768], { reducedMotion: 'reduce' }, '#/1')
    for (let i = 0; i < Math.min(SLIDES, 4) + 3; i++) {
      await page.keyboard.press('ArrowRight')
      await page.waitForTimeout(200) // minimum gap between presses: this tests key handling, not animation
    }
    if (SLIDES > 1 && (await page.evaluate(() => location.hash)) === '#/1') fail('keyboard: ArrowRight did not advance')
    if (errors.length) fail(`reduced-motion console errors: ${errors.join(' | ')}`)
    await context.close()
  }
  if (BENTO_N) {
    const { context, page, errors } = await openPage([1366, 768], { reducedMotion: 'reduce' })
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    await page.waitForSelector('.detail', { timeout: 2000 }).catch(() => {})
    if (!(await page.locator('.detail').count())) fail('keyboard: Tab+Enter did not open the first card')
    await page.keyboard.press('Escape')
    await page.waitForSelector('.detail', { state: 'detached', timeout: 2000 }).catch(() => {})
    await page.click(card(CARDS[Math.min(3, CARDS.length - 1)]))
    await page.waitForSelector('.detail', { timeout: 2000 }).catch(() => {})
    if (!(await page.locator('.detail').count())) fail('reduced-motion: card did not open')
    await page.screenshot({ path: join(OUT, 'reduced-riscv-1366x768.png') })
    await page.keyboard.press('Escape')
    await page.waitForSelector('.detail', { state: 'detached', timeout: 2000 }).catch(() => {})
    if (await page.locator('.detail').count()) fail('reduced-motion: Esc did not close')
    if (errors.length) fail(`reduced-motion console errors: ${errors.join(' | ')}`)
    await context.close()
  }
  phase('reduced-motion')

  // ═══ BEGIN presenter tools: B/W blank, H freeze, ? key help, presenter sync, notes summary ═══
  // Self-contained; it only adds failures and the `speakerNotes` summary printed at the end.
  {
    const { context, page, errors } = await openPage([1366, 768], {}, '#/1')
    const count = (sel) => page.locator(sel).count()
    const blankColour = () => page.evaluate(() => {
      const el = document.querySelector('.screen-blank')
      return el ? getComputedStyle(el).backgroundColor : null
    })
    const live = () => page.evaluate(() => ({
      hash: location.hash,
      pending: document.querySelectorAll('body .slide-frame [data-build-state="pending"]').length,
    }))

    // Notes and planned time, read from the progress bar (data-notes / data-seconds). Never a failure.
    const meta = await page.$$eval('.progress__seg', (els) => els.map((e) => ({ notes: e.hasAttribute('data-notes'), seconds: Number(e.dataset.seconds) || 0 })))
    const withNotes = meta.filter((m) => m.notes).length
    const planned = meta.filter((m) => m.seconds > 0)
    const secs = planned.reduce((a, m) => a + m.seconds, 0)
    speakerNotes = `speaker notes on ${withNotes}/${meta.length} slides` +
      (planned.length ? `; planned time on ${planned.length}/${meta.length} slides, ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')} in total` : '; no planned time (SlideDef.seconds)')
    report.speakerNotes = { withNotes, slides: meta.length, plannedSlides: planned.length, plannedSeconds: secs }

    // B / W: black and white screen over the whole window; the same key again restores the slide.
    await page.keyboard.press('b'); await page.waitForTimeout(250) // let the key handler paint the blank layer
    if ((await blankColour()) !== 'rgb(0, 0, 0)') fail(`blank: B gave ${await blankColour()}, expected a black screen`)
    const box = await page.locator('.screen-blank').boundingBox().catch(() => null)
    if (!box || box.width < 1366 || box.height < 768) fail('blank: B does not cover the window')
    await page.keyboard.press('w'); await page.waitForTimeout(250) // let the key handler paint the blank layer
    if ((await blankColour()) !== 'rgb(255, 255, 255)') fail(`blank: W gave ${await blankColour()}, expected a white screen`)
    await page.keyboard.press('w'); await page.waitForTimeout(250) // let the key handler paint the blank layer
    if (await count('.screen-blank')) fail('blank: second W did not restore the slide')
    await page.keyboard.press('b'); await page.waitForTimeout(150) // two quick presses: checks the toggle, not motion
    await page.keyboard.press('b'); await page.waitForTimeout(250) // let the key handler paint the blank layer
    if (await count('.screen-blank')) fail('blank: second B did not restore the slide')

    // H: the audience picture holds while the deck moves on underneath; H again catches up.
    if (SLIDES > 1) {
      await page.mouse.move(2, 2)
      await page.keyboard.press('h'); await page.waitForTimeout(400) // freeze IPC: the held picture must be identical, so wait for the state to land
      if (!(await count('.screen-frozen'))) fail('freeze: H did not freeze the picture')
      const held = await page.screenshot()
      const before = await live()
      for (let i = 0; i < 3; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(450) } // while frozen this only moves the deck; the held picture is compared
      const behind = await live()
      if (behind.hash === before.hash && behind.pending === before.pending) fail('freeze: → did nothing while frozen')
      if (!held.equals(await page.screenshot())) fail('freeze: the audience picture changed while frozen')
      await page.keyboard.press('h'); await page.waitForTimeout(500) // freeze IPC handshake
      if (await count('.screen-frozen')) fail('freeze: second H did not lift the freeze')
      const after = await live()
      if (after.hash !== behind.hash || after.pending !== behind.pending)
        fail(`freeze: after H the deck shows ${after.hash} (${after.pending} pending), expected ${behind.hash} (${behind.pending} pending)`)
      if (held.equals(await page.screenshot())) fail('freeze: the picture did not catch up after H')
    }

    // ?: key list opens and closes with Esc, and lists the new keys.
    await page.keyboard.press('?'); await page.waitForTimeout(250) // key-list overlay state
    if (!(await count('.key-help'))) fail('key help: ? did not open it')
    else {
      const keys = await page.$$eval('.key-help kbd', (els) => els.map((e) => e.textContent))
      for (const k of ['B', 'W', 'H', 'S', 'G', 'P']) if (!keys.includes(k)) fail(`key help: ${k} is not listed`)
    }
    await page.keyboard.press('Escape'); await page.waitForTimeout(250) // key-list overlay state
    if (await count('.key-help')) fail('key help: Esc did not close it')

    // Presenter window (S): connects, and B pressed there blanks the audience.
    const popup = await Promise.all([context.waitForEvent('page', { timeout: 5000 }), page.keyboard.press('s')]).then(([p]) => p).catch(() => null)
    if (!popup) fail('presenter: S did not open the presenter window')
    else {
      const pvErrors = []
      popup.on('console', (m) => m.type() === 'error' && pvErrors.push(m.text()))
      popup.on('pageerror', (e) => pvErrors.push(String(e)))
      const linked = await popup.waitForSelector('.pv__link.is-on', { timeout: 6000 }).then(() => true).catch(() => false)
      if (!linked) fail('presenter: the presenter window did not connect to the deck')
      else {
        await popup.keyboard.press('b'); await page.waitForTimeout(500) // presenter-to-deck IPC round trip
        if (!(await count('.screen-blank'))) fail('presenter: B in the presenter window did not blank the audience')
        if (!(await popup.locator('.pv__cover').count())) fail('presenter: the presenter window does not show that the audience is blanked')
        await popup.keyboard.press('b'); await page.waitForTimeout(500) // presenter-to-deck IPC round trip
        if (await count('.screen-blank')) fail('presenter: second B in the presenter window did not restore the audience')
      }
      await popup.close()
      if (pvErrors.length) fail(`presenter window console errors: ${pvErrors.join(' | ')}`)
    }
    if (errors.length) fail(`presenter tools console errors: ${errors.join(' | ')}`)
    await context.close()
  }
  // ═══ END presenter tools ═══
  }
}
phase('presenter')


if (KIT_ONLY) {
  // 4 ─ Component gallery (#/kit): every preview mounts, no overflow ─────────
  for (const vp of [[1440, 900], [390, 844]]) {
    const key = vp.join('x')
    // Reduced motion: previews render their final state at once, so each can be measured as soon as it is in view.
    const { context, page, external, errors } = await openPage(vp, { reducedMotion: 'reduce' }, '#/kit', STUDIO_URL)
    const entries = await page.$$eval('.kit-entry', (els) => els.map((e) => e.id))
    // Previews far off screen unmount again (memory), so each one is checked while it is in view:
    // it mounted, and nothing escapes its screen.
    const unmounted = []
    const escaped = []
    for (const id of entries) {
      await page.evaluate((id) => document.querySelector(`#${id} .kit-preview`).scrollIntoView({ block: 'center' }), id)
      // Wait for the preview to mount (up to 2 s); a fixed 250 ms flaked on a busy machine.
      await page.waitForFunction((id) => !!document.querySelector(`#${id} .kit-preview__screen .kit-stage`), id, { timeout: 2000, polling: 50 }).catch(() => {})
      const r = await page.evaluate((id) => {
        const screen = document.querySelector(`#${id} .kit-preview__screen`)
        return { mounted: !!screen?.querySelector('.kit-stage'), escaped: !!screen && (screen.scrollWidth > screen.clientWidth + 1 || screen.scrollHeight > screen.clientHeight + 1) }
      }, id)
      if (!r.mounted) unmounted.push(id)
      if (r.escaped) escaped.push(id)
    }
    if (unmounted.length) fail(`gallery ${key}: ${entries.length - unmounted.length}/${entries.length} previews mounted (missing ${unmounted.slice(0, 8).join(', ')})`)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    if (overflow > 0) fail(`gallery ${key}: horizontal overflow ${overflow}px`)
    if (escaped.length) fail(`gallery ${key}: preview overflow in ${escaped.join(', ')}`)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(300) // scroll to top before the gallery screenshot
    await page.screenshot({ path: join(OUT, `gallery-top-${key}.png`) })
    for (const id of entries.slice(0, 2)) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded()
      await page.evaluate((id) => document.getElementById(id).scrollIntoView({ block: 'start' }), id)
      await page.waitForTimeout(400) // scrollIntoView before the per-entry screenshot
      await page.screenshot({ path: join(OUT, `gallery-${id}-${key}.png`) })
    }
    if (external.length) fail(`gallery ${key}: external requests ${external.join(', ')}`)
    if (errors.length) fail(`gallery ${key}: console errors ${errors.join(' | ')}`)
    await context.close()
  }

}
await browser.close()
if (!KIT_ONLY) {
  if (PARTIAL) report.partial = { slides: SELECTED, total: SLIDES }
  if (!failures.length) writeCache(selection.fp, SELECTED ?? Array.from({ length: SLIDES }, (_, i) => i + 1), CHECK_ALL)
}
writeFileSync(join(OUT, KIT_ONLY ? 'report-kit.json' : 'report.json'), JSON.stringify(report, null, 2))
if (KIT_ONLY) {
  console.log('deck checks skipped (--kit)')
  console.log(`gallery checks: ${STUDIO}`)
  console.log(`gallery failures: ${failures.length}`)
} else {
  console.log(`bundle ${(report.bytes / 1024 / 1024).toFixed(2)} MB`)
  if (!PARTIAL) {
    console.log('round trips (max px drift):', JSON.stringify(report.roundTrips))
    console.log('keyboard walk-through:', JSON.stringify(report.walkthrough))
  }
  console.log(`viewports: ${Object.keys(report.viewports).length} (${JOBS} job${JOBS === 1 ? '' : 's'})`)
  console.log('timing (s):', Object.entries(timing).map(([k, v]) => `${k}=${v}`).join(' '))
  if (speakerNotes) console.log(`note: ${speakerNotes}`)
}
if (PARTIAL) {
  console.log(`partial check: slides ${SELECTED.join(', ')} of ${SLIDES}; navigation, presenter and keyboard checks not run`)
  console.log('run a full check before delivery')
}
if (warnings.length) console.log(`WARN (${warnings.length})\n- ${warnings.join('\n- ')}`)
console.log(failures.length ? `FAIL (${failures.length})\n- ${failures.join('\n- ')}` : 'PASS — all deterministic checks')
process.exit(failures.length ? 1 : 0)
