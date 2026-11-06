// Deterministic audit for a display screen. Exit code 1 on any hard failure; the last line is PASS or FAIL.
// usage: node scripts/screen-qa.mjs <name> [--quick] [--file <html>]
//   reads dist/screen/<name>.html, writes qa/screen/<name>/. Rules and sources: plans/research-screen.md.
import { launchChromium } from './playwright.mjs'
import { createServer } from 'node:http'
import { copyFileSync, existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { missingCjk } from './font-coverage.mjs'

const ROOT = resolve(import.meta.dirname, '..')
const args = process.argv.slice(2)
const name = args.find((a) => !a.startsWith('--'))
if (!name) { console.error('usage: screen-qa <name> [--quick]'); process.exit(2) }
const QUICK = args.includes('--quick')
const FILE = join(ROOT, 'dist', 'screen', `${name}.html`)
const OUT = join(ROOT, 'qa', 'screen', name)
if (!existsSync(FILE)) { console.error(`not built: ${FILE}`); console.log('FAIL'); process.exit(1) }
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const failures = []
const notes = []
const warnings = []
const fail = (m) => { failures.push(m) }
const warn = (m) => { warnings.push(m) }
const step = (m) => console.log(`· ${m}`)

// ---- the rules, recomputed here so a mistake in src/screen/legibility.ts cannot pass itself ----

/** 2010 ADA Standards for Accessible Design, Table 703.5.5. Height of an uppercase "I" in mm. */
function adaMinMm(distanceMm, baselineMm) {
  const per = (over) => (Math.max(0, over) / 305) * 3.2
  if (baselineMm <= 1780) return distanceMm < 1830 ? 16 : 16 + per(distanceMm - 1830)
  if (baselineMm <= 3050) return distanceMm < 4570 ? 51 : 51 + per(distanceMm - 4570)
  return distanceMm < 6400 ? 75 : 75 + per(distanceMm - 6400)
}
/** Zhang, Liu, Jasti, Suryakumar & Bullimore 2020, Optometry and Vision Science 97(10): Chinese needs 1.54 times the size. */
const CJK_FACTOR = 1.54
/** Chen et al. 2023 (Automotive Digest): 16 arcmin floor for simplified Chinese. Applied to small print at the near distance. */
const FINE_ARCMIN = 16
/** Project rule, no external source: enough pixels for a stroke on a coarse panel. */
const FINE_MIN_DESIGN_PX = 20
/** WCAG 2.2 SC 1.4.3 minimum for normal text, applied to everything: signage has no "large text" discount here. */
const MIN_CONTRAST = 4.5
const CJK_PER_SECOND = 260 / 60 // Wang, Lin & Guo 2019, Brain and Behavior: 259.5 characters/min maximum for young readers
const WORDS_PER_SECOND = 238 / 60 // Brysbaert 2019, J. Memory and Language: English non-fiction silent reading
const ORIENT_SECONDS = 2 // project allowance for finding the text after a scene change, no external source
const MIN_DWELL = 6
const RULE_NAME = `ADA 2010 Table 703.5.5 × ${CJK_FACTOR} for Chinese (Zhang et al. 2020)`

const longEdgeMm = (v) => v.longEdgeMm ?? (v.diagonalIn ?? 55) * 25.4 * (16 / Math.hypot(16, 9))
const CJK = /[㐀-鿿豈-﫿]/g
function neededSeconds(text) {
  const cjk = (text.match(CJK) ?? []).length
  const words = (text.replace(CJK, ' ').match(/[A-Za-z0-9][A-Za-z0-9.,:'’-]*/g) ?? []).length
  return { cjk, words, seconds: Math.max(MIN_DWELL, ORIENT_SECONDS + cjk / CJK_PER_SECOND + words / WORDS_PER_SECOND) }
}

// ---- browser ----

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
const seen = { console: new Set(), network: new Set(), page: new Set() }

async function open(width, height, query = '', opts = {}) {
  const context = await browser.newContext({ viewport: { width, height } }) // fresh storage for every run
  const page = await context.newPage()
  if (!opts.allowLoad) {
    page.on('pageerror', (e) => { seen.page.add(e.message.slice(0, 160)) })
    page.on('console', (m) => { if (m.type() === 'error') seen.console.add(m.text().slice(0, 160)) })
    page.on('request', (r) => { if (/^(https?|wss?):/.test(r.url())) seen.network.add(r.url().slice(0, 120)) })
  }
  await page.goto((opts.url ?? url) + (query ? `?${query}` : ''), { waitUntil: 'load' })
  await page.waitForFunction(() => document.documentElement.dataset.ready === 'true' && window.__screen, null, { timeout: 30000 })
  return page
}
const close = (page) => page.context().close()

// ---- what the screen says about itself ----

const probe = await open(1920, 1080, 'qa=1')
const def = await probe.evaluate(() => window.__screen.describe())
// Where accelerated pages start their clock. Left on the real time, a run started in the evening walks
// into the nightly reload a few minutes later and dies with "execution context destroyed", so the result
// would depend on the time of day. 09:00 also puts a schedule's sessions inside the soak.
const CLEAR = (() => {
  const [h, m] = (def.reloadAt ?? '04:00').split(':').map(Number)
  const at = h * 60 + m
  if (at < 9 * 60 || at >= 15 * 60) return '09:00'
  const t = at + 60
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
})()
const env = await probe.evaluate(() => ({ secure: isSecureContext, wake: window.__screen.state().wake, memory: !!performance.memory }))
await close(probe)
notes.push(`file:// page: secure context ${env.secure}, wake lock ${env.wake}`)
if (def.scenes.length < 1) fail('no scenes')
if (new Set(def.scenes.map((s) => s.id)).size !== def.scenes.length) fail('duplicate scene ids')

const V = def.venue
const mmPerPx = longEdgeMm(V) / 1920
const adaMm = adaMinMm(V.distanceM * 1000, (V.baselineM ?? 1.4) * 1000)
const fineMm = 2 * (V.nearM ?? 1.5) * 1000 * Math.tan(((FINE_ARCMIN / 60) * Math.PI) / 360)
console.log(`${name}: ${def.scenes.length} scenes, ${V.distanceM} m, ${longEdgeMm(V).toFixed(0)} mm long edge`)
console.log(`rule: ${RULE_NAME}: Latin ≥ ${adaMm.toFixed(1)} mm, Chinese ≥ ${(adaMm * CJK_FACTOR).toFixed(1)} mm; small print ≥ ${fineMm.toFixed(1)} mm (${FINE_ARCMIN} arcmin at ${V.nearM ?? 1.5} m)`)

const LAND = [[1920, 1080, '1080p'], [3840, 2160, '4k']]
const PORT = [[1080, 1920, 'portrait'], [2160, 3840, 'portrait4k']]
const SIZES = (def.orientation === 'both' ? [...LAND, PORT[0]] : def.orientation === 'portrait' ? PORT : LAND)

// ---- per-scene audit, run in the page ----

const auditScene = () => {
  const out = { problems: [], minRead: null, minFine: null, read: '', fine: 0, hasSource: false, sample: false, clock: null, textNodes: [] }
  const root = document.querySelector('.scr-root').getBoundingClientRect()
  const u = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--u'))
  const layer = [...document.querySelectorAll('.scr-layer:not(.is-out)')].pop() ?? document.querySelector('[data-idle]')
  const scopes = [layer, document.querySelector('.scr-chrome')].filter(Boolean)
  const mx = root.width * 0.05
  const my = root.height * 0.05
  const canvas = document.createElement('canvas').getContext('2d')
  const nodes = []
  for (const scope of scopes) {
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT)
    for (let t = walker.nextNode(); t; t = walker.nextNode()) {
      const text = t.textContent.trim()
      if (!text) continue
      const el = t.parentElement
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none') continue
      const range = document.createRange()
      range.selectNodeContents(t)
      // A line box from the font's ascent and descent is far taller than the glyphs (about 1.45 em for
      // Noto CJK), so judge position on the em box. Otherwise every tight heading looks like an overlap.
      const em = parseFloat(cs.fontSize)
      const rects = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0).map((r) => {
        const mid = (r.top + r.bottom) / 2
        return { left: r.left, right: r.right, top: mid - em / 2, bottom: mid + em / 2, x: r.left, y: mid - em / 2, width: r.width, height: em }
      })
      if (!rects.length) continue
      nodes.push({ t, el, cs, text, rects, chrome: scope !== layer, tier: el.closest('[data-tier]')?.dataset.tier ?? 'read' })
    }
  }
  const glyph = (cs, ch) => {
    canvas.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
    const m = canvas.measureText(ch)
    return m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
  }
  for (const n of nodes) {
    const label = n.text.slice(0, 24)
    for (const r of n.rects) {
      if (r.left < root.left - 1 || r.right > root.right + 1 || r.top < root.top - 1 || r.bottom > root.bottom + 1) out.problems.push(`text off the screen: "${label}"`)
      else if (r.left < root.left + mx - 12 * u || r.right > root.right - mx + 12 * u || r.top < root.top + my - 12 * u || r.bottom > root.bottom - my + 12 * u) out.problems.push(`text outside the title-safe area (SMPTE ST 2046-1, 90%): "${label}"`)
    }
    const hasCjk = /[㐀-鿿豈-﫿]/.test(n.text)
    const designPx = glyph(n.cs, hasCjk ? '国' : 'I') / u
    const entry = { designPx, text: label, hasCjk, size: parseFloat(n.cs.fontSize) / u }
    if (n.tier === 'fine') {
      if (!out.minFine || designPx < out.minFine.designPx) out.minFine = entry
      out.fine += n.text.length
    } else {
      const key = hasCjk ? 'minRead' : 'minLatin'
      if (!out[key] || designPx < out[key].designPx) out[key] = entry
      if (!n.chrome) out.read += ` ${n.text}`
    }
    // Clipped text.
    for (let a = n.el; a && a !== document.body; a = a.parentElement) {
      const ov = getComputedStyle(a)
      if ((ov.overflowX !== 'visible' || ov.overflowY !== 'visible') && !a.classList.contains('sc') && !a.classList.contains('scr-root')) {
        const box = a.getBoundingClientRect()
        if (n.rects.some((r) => r.right > box.right + 1 || r.bottom > box.bottom + 1 || r.left < box.left - 1 || r.top < box.top - 1)) out.problems.push(`text clipped by .${a.className}: "${label}"`)
      }
    }
    out.textNodes.push({ text: label, tier: n.tier, color: n.cs.color, opacity: (() => { let o = 1; for (let a = n.el; a; a = a.parentElement) o *= parseFloat(getComputedStyle(a).opacity); return o })(), rects: n.rects.slice(0, 6).map((r) => ({ x: r.x, y: r.y, w: r.width, h: r.height })) })
  }
  // Text on top of other text.
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i]
      const b = nodes[j]
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue
      const hit = a.rects.some((p) => b.rects.some((q) => Math.min(p.right, q.right) - Math.max(p.left, q.left) > 2 * u && Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top) > 4 * u))
      if (hit) out.problems.push(`text overlaps text: "${a.text.slice(0, 18)}" and "${b.text.slice(0, 18)}"`)
    }
  }
  // Content running past the scene's own box.
  const body = layer?.querySelector('.sc-body')
  if (body) {
    const box = body.getBoundingClientRect()
    for (const c of body.querySelectorAll('*')) {
      const r = c.getBoundingClientRect()
      // Boxes, not scrollHeight: bottom-aligned content overflows upward, where scrollHeight cannot see it.
      if (r.width && (r.top < box.top - 2 * u || r.bottom > box.bottom + 2 * u)) { out.problems.push(`content is ${Math.ceil(Math.max(box.top - r.top, r.bottom - box.bottom) / u)} design px too tall for the scene, at "${c.textContent.trim().slice(0, 18)}". Cut words.`); break }
    }
  }
  const source = layer?.querySelector('.sc-fine')
  out.hasSource = !!source?.textContent.trim()
  out.sourceText = source?.textContent.trim() ?? ''
  out.sample = !!document.querySelector('.scr-sample')?.textContent.trim()
  out.images = [...(layer?.querySelectorAll('img') ?? [])].map((i) => ({ ok: i.complete && i.naturalWidth > 0, w: i.getBoundingClientRect().width, nw: i.naturalWidth }))
  return out
}

// A page that does nothing but read pixels out of screenshots.
const pixelPage = await browser.newPage()
await pixelPage.setContent('<!doctype html><title>pixels</title><canvas id="c"></canvas>')
await pixelPage.evaluate(() => {
  window.loadPng = async (b64) => {
    const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob())
    const c = new OffscreenCanvas(bmp.width, bmp.height)
    const x = c.getContext('2d', { willReadFrequently: true })
    x.drawImage(bmp, 0, 0)
    return x
  }
  const lin = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 }
  window.lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  window.toRgb = (css) => {
    const c = new OffscreenCanvas(1, 1).getContext('2d')
    c.fillStyle = css
    c.fillRect(0, 0, 1, 1)
    return [...c.getImageData(0, 0, 1, 1).data]
  }
  // Worst-case background luminance under each rect: the extremes the text has to be readable against.
  window.contrast = async (b64, items) => {
    const x = await window.loadPng(b64)
    return items.map((it) => {
      const [r, g, b] = window.toRgb(it.color)
      const a = it.opacity
      let worst = 99
      for (const q of it.rects) {
        const w = Math.max(1, Math.floor(q.w))
        const h = Math.max(1, Math.floor(q.h))
        const data = x.getImageData(Math.floor(q.x), Math.floor(q.y), w, h).data
        const lums = []
        const step = Math.max(1, Math.floor((w * h) / 4000))
        for (let i = 0; i < data.length; i += 4 * step) lums.push(window.lum(data[i], data[i + 1], data[i + 2]))
        lums.sort((p, q2) => p - q2)
        const lo = lums[Math.floor(lums.length * 0.02)]
        const hi = lums[Math.floor(lums.length * 0.98)]
        for (const bg of [lo, hi]) {
          // Text colour blended over this background by its alpha and the opacity of its ancestors.
          const fg = window.lum(r, g, b) * a + bg * (1 - a)
          const ratio = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05)
          worst = Math.min(worst, ratio)
        }
      }
      return worst
    })
  }
  window.minLuma = async (shots, width) => {
    let min = null
    let w = 0
    let h = 0
    for (const b64 of shots) {
      const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob())
      w = width
      h = Math.round((bmp.height * width) / bmp.width)
      const c = new OffscreenCanvas(w, h)
      const x = c.getContext('2d', { willReadFrequently: true })
      x.drawImage(bmp, 0, 0, w, h)
      const d = x.getImageData(0, 0, w, h).data
      if (!min) min = new Float32Array(w * h).fill(1)
      for (let i = 0; i < w * h; i++) min[i] = Math.min(min[i], 0.2126 * d[i * 4] / 255 + 0.7152 * d[i * 4 + 1] / 255 + 0.0722 * d[i * 4 + 2] / 255)
    }
    let lit = 0
    for (let i = 0; i < w * h; i++) if (min[i] > 0.25) lit++
    return { lit: lit / (w * h), samples: shots.length, w, h }
  }
})

const expectPx = {
  // A glyph has to clear the rule, in design pixels of this venue.
  latin: adaMm / mmPerPx,
  cjk: (adaMm * CJK_FACTOR) / mmPerPx,
  fine: Math.max(FINE_MIN_DESIGN_PX * 0.8, fineMm / mmPerPx),
}

const seenRead = { smallestCjk: null, smallestLatin: null, smallestFine: null }
const sceneTimes = {}

/** Fonts actually used for each text node. Anything not embedded would differ on the player. */
async function systemFonts(page) {
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('DOM.enable')
  await cdp.send('CSS.enable')
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 })
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: '.scr-layer:not(.is-out) *, .scr-chrome *' })
  const stray = new Set()
  for (const nodeId of nodeIds.slice(0, 200)) {
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId })
    for (const f of fonts) if (!f.isCustomFont) stray.add(f.familyName)
  }
  await cdp.detach()
  return [...stray]
}

async function auditPinned(page, id, tag, { first, stateLabel }) {
  await page.evaluate((x) => window.__screen.pin(x), id)
  await page.waitForFunction((x) => document.querySelector(`.scr-layer[data-scene="${x}"]:not(.is-out)`) && document.querySelectorAll('.scr-layer').length === 1, id, { timeout: 8000 }).catch(() => fail(`[${tag}] scene ${id} did not settle`))
  await page.waitForTimeout(QUICK ? 900 : 1300)
  // The ticker turns its page on its own schedule. Caught mid-fade, its text reads as low contrast and
  // the run fails or passes by chance, so let any running fade finish before reading the scene.
  await page.evaluate(() => Promise.race([
    Promise.all(document.getAnimations().filter((x) => x.playState === 'running' && x.effect?.getTiming().iterations !== Infinity).map((x) => x.finished.catch(() => {}))),
    new Promise((r) => setTimeout(r, 3000)),
  ]))
  const a = await page.evaluate(auditScene)
  const where = `[${tag}${stateLabel ? ` · ${stateLabel}` : ''}] ${id}`
  for (const p of new Set(a.problems)) fail(`${where}: ${p}`)
  if (!a.hasSource) fail(`${where}: no source shown on screen`)
  if (def.sample && !a.sample) fail(`${where}: sample data is not labelled`)
  for (const i of a.images) if (!i.ok) fail(`${where}: an image failed to load`)
  if (a.minRead && a.minRead.designPx + 0.25 < expectPx.cjk) fail(`${where}: "${a.minRead.text}" is ${(a.minRead.designPx * mmPerPx).toFixed(1)} mm tall, under the ${(adaMm * CJK_FACTOR).toFixed(1)} mm that ${RULE_NAME} needs at ${V.distanceM} m`)
  if (a.minLatin && a.minLatin.designPx + 0.25 < expectPx.latin) fail(`${where}: "${a.minLatin.text}" is ${(a.minLatin.designPx * mmPerPx).toFixed(1)} mm tall, under the ${adaMm.toFixed(1)} mm that ADA 2010 Table 703.5.5 needs at ${V.distanceM} m`)
  if (a.minFine) {
    if (a.minFine.designPx + 0.25 < expectPx.fine) fail(`${where}: small print "${a.minFine.text}" is ${(a.minFine.designPx * mmPerPx).toFixed(1)} mm tall, under ${fineMm.toFixed(1)} mm (${FINE_ARCMIN} arcmin at the near distance)`)
    if (a.minFine.size < FINE_MIN_DESIGN_PX) fail(`${where}: small print is ${a.minFine.size.toFixed(0)} design px, under the ${FINE_MIN_DESIGN_PX} px floor`)
    if (!seenRead.smallestFine || a.minFine.designPx < seenRead.smallestFine.designPx) seenRead.smallestFine = a.minFine
  }
  if (a.minRead && (!seenRead.smallestCjk || a.minRead.designPx < seenRead.smallestCjk.designPx)) seenRead.smallestCjk = a.minRead
  if (a.minLatin && (!seenRead.smallestLatin || a.minLatin.designPx < seenRead.smallestLatin.designPx)) seenRead.smallestLatin = a.minLatin
  if (a.fine > 200) fail(`${where}: ${a.fine} characters of small print. Sources belong in small print, content does not.`)

  // Enough time to read it.
  const scene = def.scenes.find((s) => s.id === id)
  const need = neededSeconds(a.read)
  sceneTimes[id] = { seconds: scene.seconds, cjk: need.cjk, words: need.words, need: Math.max(sceneTimes[id]?.need ?? 0, need.seconds) }
  if (scene.seconds + 0.01 < need.seconds) fail(`${where}: ${scene.seconds} s on screen, ${need.cjk} characters and ${need.words} words need ${need.seconds.toFixed(1)} s (2 s to find it + 260 characters/min + 238 words/min)`)

  const shotName = `${tag}${stateLabel ? `-${stateLabel}` : ''}-${id}.png`
  await page.screenshot({ path: join(OUT, shotName) })

  if (first) {
    const stray = await systemFonts(page)
    if (stray.length) {
      const missing = missingCjk(await page.evaluate(() => document.body.innerText))
      const chars = missing.length ? ` Missing from the committed subsets: ${missing.join(' ')}.` : ''
      warn(`${where}: text is falling back to a system font (${stray.join(', ')}).${chars} The screen still renders; maintainers can add the characters with npm run fonts (Python, fonttools, Noto CJK sources).`)
    }
    // Contrast against the real pixels behind the text, read with the text itself hidden.
    const style = await page.addStyleTag({ content: '.scr-root *{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}' })
    await page.waitForTimeout(40)
    const png = (await page.screenshot({ type: 'png' })).toString('base64')
    await style.evaluate((n) => n.remove())
    const ratios = await pixelPage.evaluate(([b, items]) => window.contrast(b, items), [png, a.textNodes])
    ratios.forEach((r, i) => {
      if (r < MIN_CONTRAST) fail(`${where}: contrast ${r.toFixed(2)}:1 on "${a.textNodes[i].text}", under ${MIN_CONTRAST}:1 (WCAG 2.2 SC 1.4.3)`)
    })
    const lowest = Math.min(...ratios)
    if (!seenRead.contrast || lowest < seenRead.contrast) seenRead.contrast = lowest
  }
  return a
}

// ---- 1. every scene at every resolution ----
step('every scene at every resolution')
let firstSize = true
for (const [w, h, tag] of SIZES) {
  const page = await open(w, h, 'qa=1')
  for (const s of def.scenes) await auditPinned(page, s.id, tag, { first: firstSize })
  const over = await page.evaluate(() => ({ x: document.documentElement.scrollWidth - innerWidth, y: document.documentElement.scrollHeight - innerHeight, cursor: getComputedStyle(document.documentElement).cursor, panel: !!document.querySelector('[data-status-panel]') }))
  if (over.x > 0 || over.y > 0) fail(`[${tag}] the page scrolls by ${over.x}×${over.y}`)
  if (over.cursor !== 'none') fail(`[${tag}] the cursor is visible`)
  if (over.panel) fail(`[${tag}] operator panel is visible by default`)
  await close(page)
  firstSize = false
}

// ---- 2. time states ----
for (const st of def.states) {
  step(`time state ${st.at} ${st.label}`)
  for (const [w, h, tag] of SIZES.filter((s) => !s[2].includes('4k'))) {
    const page = await open(w, h, `qa=1&now=${st.at}`)
    const shown = await page.evaluate(() => window.__screen.describe().scenes.map((s) => s.id))
    const eligible = def.scenes.filter((s) => inWindowQa(s.when, st.at)).map((s) => s.id)
    if (!eligible.length) fail(`[${st.at}] no scene is scheduled`)
    for (const id of eligible) if (shown.includes(id)) await auditPinned(page, id, tag, { first: false, stateLabel: st.at.replace(':', '') })
    await close(page)
  }
}

function minutesQa(hhmm) { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m }
/** The QA's own reading of a time window, so an engine mistake shows up as a disagreement. Day and date filters are not modelled. */
function inWindowQa(when, hhmm) {
  if (!when) return true
  const t = minutesQa(hhmm)
  return (Array.isArray(when) ? when : [when]).some((w) => {
    const a = minutesQa(w.from)
    const b = minutesQa(w.to)
    return a > b ? t >= a || t < b : t >= a && t < b
  })
}

// ---- 3. the clock drives what is on screen ----
step('schedule follows the clock')
{
  const fmt = (m) => `${String(Math.floor(((m + 1440) % 1440) / 60)).padStart(2, '0')}:${String(((m + 1440) % 1440) % 60).padStart(2, '0')}`
  // Each edge of each window, one minute either side. Compared against this script's own reading of the windows.
  const edges = new Set(def.scenes.flatMap((s) => (s.when ? (Array.isArray(s.when) ? s.when : [s.when]).flatMap((w) => [w.from, w.to]) : [])))
  const times = [...new Set([...edges].flatMap((e) => [fmt(minutesQa(e) - 1), fmt(minutesQa(e) + 1)]))]
  for (const at of times) {
    const page = await open(1280, 720, `qa=1&now=${at}`)
    const expected = def.scenes.filter((s) => inWindowQa(s.when, at)).map((s) => s.id).sort().join()
    const got = (await page.evaluate(() => window.__screen.eligible())).sort().join()
    if (got !== expected) fail(`at ${at} the engine schedules [${got}], expected [${expected}]`)
    // Stepping the loop must only ever land on scheduled scenes.
    const visited = new Set()
    for (let i = 0; i < def.scenes.length + 2; i++) {
      visited.add(await page.evaluate(() => window.__screen.state().scene))
      await page.evaluate(() => window.__screen.next())
    }
    for (const id of visited) if (!expected.split(',').includes(id)) fail(`at ${at} the loop showed ${id}, which is out of its hours`)
    await close(page)
  }
  // The clock element, with no reload: a minute rollover and a midnight rollover.
  const page = await open(1280, 720, 'qa=1&now=2026-03-14T23:59:50&speed=4')
  const before = await page.evaluate(() => document.querySelector('.scr-clock')?.dataset)
  await page.waitForTimeout(3500)
  const after = await page.evaluate(() => document.querySelector('.scr-clock')?.dataset)
  if (before && after) {
    if (after.date !== '2026-03-15') fail(`clock did not roll over midnight: ${before.date} → ${after.date}`)
    if (after.minutes !== '0') fail(`clock minutes after midnight: ${after.minutes}`)
  } else if (def.clock !== false) fail('no clock on screen')
  await close(page)

  if (def.hasAgenda) {
    // Phase must change live as time passes, without a reload.
    const live = await open(1280, 720, `qa=1&pin=now&now=08:59:40&speed=4`)
    const p0 = await live.evaluate(() => document.querySelector('.sc-now')?.dataset.phase)
    await live.waitForFunction(() => document.querySelector('.sc-now')?.dataset.phase === 'during', null, { timeout: 12000 }).catch(() => {})
    const p1 = await live.evaluate(() => document.querySelector('.sc-now')?.dataset.phase)
    if (p0 !== 'before' || p1 !== 'during') fail(`now/next did not follow the clock: ${p0} → ${p1}`)
    await close(live)
  }
}

// ---- 4. a scene that throws is skipped and the loop continues ----
step('a failing scene is skipped')
{
  const ids = def.scenes.map((s) => s.id)
  for (const kind of ['render', 'effect', 'blank']) {
    const page = await open(1280, 720, `qa=1&speed=120&now=${CLEAR}`)
    const bad = ids[Math.min(1, ids.length - 1)]
    await page.evaluate(([id, k]) => window.__screen.fault(id, k), [bad, kind])
    const c0 = await page.evaluate(() => window.__screen.state().changes)
    await page.waitForFunction(({ c }) => window.__screen.state().changes > c + 20, { c: c0 }, { timeout: 25000 }).catch(() => fail(`loop stopped after a ${kind} fault in ${bad}`))
    const st = await page.evaluate(() => window.__screen.state())
    if (!(st.counts.scene >= 1)) fail(`a ${kind} fault in ${bad} was not recorded`)
    // Bad scene rests: it must not be on screen now, and the screen must not be empty.
    const painted = await page.evaluate(() => (document.querySelector('.scr-stage')?.textContent ?? '').trim().length)
    if (!painted) fail(`screen empty after a ${kind} fault`)
    await close(page)
  }
  // Every scene fails: hold, then come back when the fault clears.
  const page = await open(1280, 720, `qa=1&speed=60&now=${CLEAR}`)
  await page.evaluate((list) => { for (const id of list) window.__screen.fault(id, 'render') }, ids)
  await page.waitForFunction(() => window.__screen.state().idle && document.querySelector('[data-idle]'), null, { timeout: 25000 }).catch(() => fail('all scenes failing did not reach the holding card'))
  await page.screenshot({ path: join(OUT, 'holding-card.png') })
  await page.evaluate(() => window.__screen.clearFaults())
  await page.waitForFunction(() => !window.__screen.state().idle && document.querySelector('.scr-layer'), null, { timeout: 25000 }).catch(() => fail('the loop did not recover after the fault cleared'))
  // An async failure is recorded, is not fatal, and stays out of the console.
  const c1 = await page.evaluate(() => { Promise.reject(new Error('qa async fault')); setTimeout(() => { throw new Error('qa timer fault') }, 0); return window.__screen.state().changes })
  await page.waitForFunction((c) => window.__screen.state().changes > c + 5, c1, { timeout: 15000 }).catch(() => fail('loop stopped after an async error'))
  const counts = await page.evaluate(() => window.__screen.state().counts)
  if (!(counts.async >= 1)) fail('an async error was not recorded')
  await close(page)
}

// ---- 5. operator keys ----
step('operator keys')
{
  const page = await open(1280, 720, 'qa=1&speed=1')
  const s0 = await page.evaluate(() => window.__screen.state())
  await page.keyboard.press('n')
  await page.waitForTimeout(100)
  const s1 = await page.evaluate(() => window.__screen.state())
  if (s1.changes !== s0.changes + 1) fail('N did not advance')
  await page.keyboard.press(' ')
  const s2 = await page.evaluate(() => window.__screen.state())
  if (!s2.paused) fail('Space did not pause')
  await page.keyboard.press(' ')
  await page.keyboard.press('i')
  await page.waitForSelector('[data-status-panel]', { timeout: 2000 }).catch(() => fail('I did not open the status panel'))
  await page.screenshot({ path: join(OUT, 'operator-panel.png') })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(50)
  if (await page.locator('[data-status-panel]').count()) fail('Esc did not close the status panel')
  await close(page)
}

// ---- 6. data feed: a real file beside a copy of the page ----
if (def.hasData) {
  step('data feed: local file, bad data, stale state')
  const dir = mkdtempSync(join(tmpdir(), 'screen-qa-'))
  const copy = join(dir, `${name}.html`)
  copyFileSync(FILE, copy)
  const dataPath = join(dir, 'feed.data.js')
  const tag = `QA-${Date.now()}`
  const baseValue = JSON.parse(process.env.SCREEN_QA_DATA ?? 'null') ?? { sessions: [{ start: '00:00', end: '23:59', title: tag, who: '', room: '' }], notices: [{ text: tag }] }
  writeFileSync(dataPath, `window.__screenData(${JSON.stringify(baseValue)})`)
  const copyUrl = pathToFileURL(copy).href
  const page = await open(1280, 720, `qa=1&pin=now&speed=20&now=${CLEAR}&data=feed.data.js`, { url: copyUrl, allowLoad: true })
  await page.waitForFunction((t) => document.body.textContent.includes(t), tag, { timeout: 8000 }).catch(() => fail('a local data file was not applied'))
  const live = await page.evaluate(() => window.__screen.state().data)
  if (live?.status !== 'live') fail(`data status after a good poll: ${live?.status}`)
  writeFileSync(dataPath, 'window.__screenData({"nonsense":true})')
  await page.waitForFunction(() => window.__screen.state().data.fails >= 1, null, { timeout: 8000 }).catch(() => fail('malformed data was not rejected'))
  if (!(await page.evaluate((t) => document.body.textContent.includes(t), tag))) fail('malformed data replaced the last good data')
  writeFileSync(dataPath, 'this is not javascript (')
  await page.waitForTimeout(1500)
  if (!(await page.evaluate((t) => document.body.textContent.includes(t), tag))) fail('a corrupt data file replaced the last good data')
  rmSync(dataPath)
  await page.waitForFunction(() => window.__screen.state().data.status === 'stale', null, { timeout: 20000 }).catch(() => fail('no stale state after the data file went away'))
  const notice = await page.evaluate(() => document.querySelector('.scr-feed')?.textContent ?? '')
  if (!notice.includes('过期')) fail(`stale state is not visible on screen: "${notice}"`)
  await page.screenshot({ path: join(OUT, 'data-stale.png') })
  if (!(await page.evaluate((t) => document.body.textContent.includes(t), tag))) fail('last good data was lost when the source went away')
  const stale = await page.evaluate(auditScene)
  for (const p of new Set(stale.problems)) fail(`[stale notice] ${p}`)
  // Comes back by itself.
  writeFileSync(dataPath, `window.__screenData(${JSON.stringify(baseValue)})`)
  await page.waitForFunction(() => window.__screen.state().data.status === 'live', null, { timeout: 40000 }).catch(() => fail('data feed did not recover'))
  // A reload during an outage keeps the last good data.
  rmSync(dataPath)
  await page.reload({ waitUntil: 'load' })
  await page.waitForFunction(() => window.__screen && document.documentElement.dataset.ready === 'true')
  await page.waitForFunction((t) => document.body.textContent.includes(t), tag, { timeout: 6000 }).catch(() => fail('last good data did not survive a reload'))
  await close(page)

  // JSON over http, from a server that fails on demand. Remote data never runs as code.
  let mode = 'ok'
  const server = createServer((req, res) => {
    if (req.url.startsWith('/feed.json')) {
      if (mode === 'down') { res.statusCode = 503; res.end('down'); return }
      res.setHeader('content-type', 'application/json')
      res.setHeader('access-control-allow-origin', '*')
      res.end(JSON.stringify(baseValue))
      return
    }
    if (req.url.startsWith('/evil.js')) { res.setHeader('content-type', 'text/javascript'); res.end('window.__evil = 1'); return }
    res.setHeader('content-type', 'text/html')
    res.end(readFileSync(FILE))
  })
  await new Promise((r) => server.listen(0, '127.0.0.1', r))
  const base = `http://127.0.0.1:${server.address().port}`
  const http = await open(1280, 720, `qa=1&pin=now&speed=20&now=${CLEAR}&data=${encodeURIComponent(`${base}/feed.json`)}`, { url: copyUrl, allowLoad: true })
  await http.waitForFunction((t) => document.body.textContent.includes(t), tag, { timeout: 8000 }).catch(() => fail('JSON from a URL was not applied to a file:// page'))
  mode = 'down'
  await http.waitForFunction(() => window.__screen.state().data.status === 'stale', null, { timeout: 25000 }).catch(() => fail('HTTP 503 did not lead to the stale state'))
  await close(http)
  const evil = await open(1280, 720, `qa=1&speed=20&now=${CLEAR}&data=${encodeURIComponent(`${base}/evil.js`)}`, { url: copyUrl, allowLoad: true })
  await evil.waitForTimeout(800)
  if (await evil.evaluate(() => window.__evil === 1)) fail('a remote URL was run as a script')
  await close(evil)
  server.close()
  rmSync(dir, { recursive: true, force: true })
}

// ---- 7. nightly reload and the memory guard ----
step('nightly reload and memory guard')
{
  const at = def.reloadAt
  if (at) {
    const [h, m] = at.split(':').map(Number)
    const before = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    const page = await open(1280, 720, `qa=1&now=${before}&speed=60`)
    await page.waitForFunction(() => Number(sessionStorage.getItem('screen:reloads') ?? 0) >= 1 && document.documentElement.dataset.ready === 'true' && window.__screen, null, { timeout: 25000 }).catch(() => fail('nightly reload did not happen'))
    await page.waitForTimeout(1500)
    const st = await page.evaluate(() => ({ r: Number(sessionStorage.getItem('screen:reloads') ?? 0), log: window.__screen.log().map((e) => e.kind), changes: window.__screen.state().changes }))
    if (st.r !== 1) fail(`nightly reload ran ${st.r} times, expected once`)
    if (!st.log.includes('reload')) fail('nightly reload not in the log after the reload')
    if (!(st.changes >= 1)) fail('loop did not resume after the reload')
    await close(page)
  } else {
    notes.push('no reloadAt set: nightly reload not tested')
  }
  const mem = await open(1280, 720, `qa=1&speed=60&now=${CLEAR}&memlimit=1`)
  await mem.waitForFunction(() => Number(sessionStorage.getItem('screen:reloads') ?? 0) >= 1 && document.documentElement.dataset.ready === 'true' && window.__screen, null, { timeout: 25000 }).catch(() => fail('memory guard did not reload'))
  await mem.waitForTimeout(1500)
  const m = await mem.evaluate(() => ({ r: Number(sessionStorage.getItem('screen:reloads') ?? 0), kinds: window.__screen.log().map((e) => e.kind) }))
  if (m.r !== 1) fail(`memory guard reloaded ${m.r} times: it must not loop`)
  if (!m.kinds.includes('memory')) fail('memory reload not recorded')
  await close(mem)
}

// ---- 8. rotated output ----
if (def.orientation !== 'landscape') {
  step('rotated output on a landscape signal')
  for (const rot of [90, 270]) {
    const page = await open(1920, 1080, `qa=1&rotate=${rot}`)
    const m = await page.evaluate(() => ({ orient: document.documentElement.dataset.orient, r: document.querySelector('.scr-root').getBoundingClientRect() }))
    if (m.orient !== 'portrait') fail(`rotate=${rot}: layout is ${m.orient}`)
    if (Math.round(m.r.width) !== 1920 || Math.round(m.r.height) !== 1080 || Math.round(m.r.left) !== 0 || Math.round(m.r.top) !== 0) fail(`rotate=${rot}: picture does not fill the signal (${m.r.width}×${m.r.height} at ${m.r.left},${m.r.top})`)
    await page.waitForTimeout(1200)
    await page.screenshot({ path: join(OUT, `rotate-${rot}.png`) })
    await close(page)
  }
}

// ---- 9. burn-in: pixels that stay lit through a whole loop ----
step('burn-in: pixels lit through the whole loop')
{
  const [w, h] = SIZES[0]
  const loop = def.scenes.reduce((a, s) => a + s.seconds, 0)
  const speed = Math.max(30, Math.round(loop / 12))
  const page = await open(w, h, `qa=1&speed=${speed}&now=10:00`)
  const shots = []
  const total = Math.max(40, Math.ceil(((loop + 660) / speed) / 0.5))
  const count = Math.min(total, 40)
  const gap = Math.max(250, (((loop + 660) * 1000) / speed) / count)
  let flips = new Set()
  for (let i = 0; i < count; i++) {
    shots.push((await page.screenshot({ type: 'png' })).toString('base64'))
    flips.add(await page.evaluate(() => window.__screen.state().flip))
    await page.waitForTimeout(gap)
  }
  const r = await pixelPage.evaluate(([s, width]) => window.minLuma(s, width), [shots, 480])
  const pct = r.lit * 100
  console.log(`  ${pct.toFixed(2)}% of pixels stayed above 25% brightness across ${r.samples} samples (static layout flipped: ${flips.size > 1})`)
  // Project threshold, not a standard. Vendors give no number for this (research §5).
  if (pct > 1) fail(`burn-in: ${pct.toFixed(2)}% of the screen stayed bright through a whole loop (project limit 1%)`)
  if (flips.size < 2 && def.scenes.length > 1) fail('burn-in: the static layout never moved during a long run')
  await close(page)
}

// ---- 10. soak ----
step('soak: accelerated scene changes')
const soak = { target: QUICK ? 150 : 800, samples: [] }
{
  const [w, h] = SIZES[0]
  const avg = def.scenes.reduce((a, s) => a + s.seconds, 0) / def.scenes.length
  const speed = Math.max(60, Math.round((avg * 1000) / 90)) // about 90 ms a scene
  const page = await open(w, h, `qa=1&speed=${speed}&now=${CLEAR}`)
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Performance.enable')
  await cdp.send('HeapProfiler.enable')
  // Always measure on the same scene. Scenes differ in size, so node counts taken wherever the loop
  // happens to be swing by a third (76 to 136 nodes on apollo11) with no leak at all.
  const anchor = def.scenes[0].id
  const sample = async () => {
    await page.evaluate((x) => window.__screen.pin(x), anchor)
    await page.waitForFunction((x) => document.querySelector(`.scr-layer[data-scene="${x}"]:not(.is-out)`) && document.querySelectorAll('.scr-layer').length === 1, anchor, { timeout: 8000 }).catch(() => fail(`soak: scene ${anchor} did not settle for measuring`))
    await page.waitForTimeout(60)
    await cdp.send('HeapProfiler.collectGarbage')
    await page.waitForTimeout(100)
    const { metrics } = await cdp.send('Performance.getMetrics')
    const get = (k) => metrics.find((x) => x.name === k)?.value ?? 0
    const st = await page.evaluate(() => window.__screen.state())
    await page.evaluate(() => window.__screen.pin(null))
    return { changes: st.changes, heap: get('JSHeapUsedSize'), nodes: get('Nodes'), listeners: get('JSEventListeners'), layouts: get('LayoutObjects') }
  }
  const every = Math.ceil(soak.target / 16)
  const t0 = Date.now()
  let next = every
  soak.samples.push(await sample())
  while (Date.now() - t0 < 300000) {
    const c = await page.evaluate(() => window.__screen.state().changes)
    if (c >= next) {
      soak.samples.push(await sample())
      next += every
      if (c >= soak.target) break
    }
    await page.waitForTimeout(100)
  }
  const st = await page.evaluate(() => window.__screen.state())
  soak.changes = st.changes
  soak.seconds = Math.round((Date.now() - t0) / 1000)
  soak.virtualHours = (st.changes * avg) / 3600
  soak.speed = speed
  await cdp.detach()
  if (st.changes < soak.target) fail(`soak reached only ${st.changes} of ${soak.target} scene changes`)
  if (st.counts.scene) fail(`soak: ${st.counts.scene} scene errors during a clean run`)
  // Skip warm-up: allocation settles in the first few samples. Compare later thirds and the trend.
  const tail = soak.samples.slice(2)
  const third = Math.max(1, Math.floor(tail.length / 3))
  const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)]
  const first = tail.slice(0, third)
  const last = tail.slice(-third)
  const growth = (k) => (med(last.map((s) => s[k])) - med(first.map((s) => s[k]))) / Math.max(1, med(first.map((s) => s[k])))
  // Least-squares slope in bytes per 1000 scene changes.
  const n = tail.length
  const mx = tail.reduce((a, s) => a + s.changes, 0) / n
  const my = tail.reduce((a, s) => a + s.heap, 0) / n
  const slope = tail.reduce((a, s) => a + (s.changes - mx) * (s.heap - my), 0) / Math.max(1, tail.reduce((a, s) => a + (s.changes - mx) ** 2, 0))
  soak.heapGrowthPct = growth('heap') * 100
  soak.nodeGrowthPct = growth('nodes') * 100
  soak.listenerGrowthPct = growth('listeners') * 100
  soak.bytesPer1000 = slope * 1000
  soak.heapFirstMb = med(first.map((s) => s.heap)) / 1048576
  soak.heapLastMb = med(last.map((s) => s.heap)) / 1048576
  console.log(`  ${st.changes} scene changes in ${soak.seconds} s real time (${soak.virtualHours.toFixed(1)} h of schedule at ×${speed}). Heap ${soak.heapFirstMb.toFixed(1)} → ${soak.heapLastMb.toFixed(1)} MB (${soak.heapGrowthPct.toFixed(1)}%), ${(soak.bytesPer1000 / 1024).toFixed(0)} KB per 1000 changes. DOM nodes ${soak.nodeGrowthPct.toFixed(1)}%, listeners ${soak.listenerGrowthPct.toFixed(1)}%`)
  if (soak.heapGrowthPct > 10 && soak.bytesPer1000 > 256 * 1024) fail(`soak: heap grows without bound: ${soak.heapFirstMb.toFixed(1)} → ${soak.heapLastMb.toFixed(1)} MB, about ${(soak.bytesPer1000 / 1048576).toFixed(1)} MB per 1000 scene changes`)
  if (soak.nodeGrowthPct > 10) fail(`soak: DOM nodes grow without bound (${soak.nodeGrowthPct.toFixed(1)}%)`)
  if (soak.listenerGrowthPct > 10) fail(`soak: event listeners grow without bound (${soak.listenerGrowthPct.toFixed(1)}%)`)
  await page.screenshot({ path: join(OUT, 'after-soak.png') })
  await close(page)
}

// ---- 11. the file itself ----
step('single offline file')
{
  const html = readFileSync(FILE, 'utf8')
  const remote = html.match(/(?:src|href)=["']https?:\/\/[^"']+|@import\s+url\(["']?https?:[^)]+|fonts\.googleapis[^"']*/)
  if (remote) fail(`references a remote resource: ${remote[0].slice(0, 80)}`)
  if (/UNSPLASH_ACCESS_KEY=\w|sk-[A-Za-z0-9]{20}/.test(html)) fail('the file contains what looks like a key')
  const mb = statSync(FILE).size / 1048576
  if (mb > 30) fail(`${mb.toFixed(1)} MB is too big for one file`)
  notes.push(`file size ${mb.toFixed(1)} MB`)
}

await pixelPage.close()
await browser.close()

for (const e of seen.console) fail(`console error: ${e}`)
for (const e of seen.page) fail(`page error: ${e}`)
for (const e of seen.network) fail(`network request: ${e}`)

const times = Object.entries(sceneTimes).map(([id, t]) => `${id} ${t.seconds}s/${t.need.toFixed(1)}s`)
const report = { name, venue: V, rule: RULE_NAME, minMm: { latin: adaMm, cjk: adaMm * CJK_FACTOR, fine: fineMm }, smallest: seenRead, sceneTimes, soak, notes, warnings, failures: [...new Set(failures)] }
writeFileSync(join(OUT, 'report.json'), JSON.stringify(report, null, 2))

const mm = (x) => (x ? `${(x.designPx * mmPerPx).toFixed(1)} mm` : 'none')
console.log(`smallest text: Chinese ${mm(seenRead.smallestCjk)}, Latin ${mm(seenRead.smallestLatin)}, small print ${mm(seenRead.smallestFine)}. Lowest contrast ${seenRead.contrast?.toFixed(1)}:1`)
console.log(`time on screen / time needed: ${times.join(', ')}`)
notes.forEach((n) => console.log(`note: ${n}`))
for (const w of new Set(warnings)) console.log(`WARN: ${w}`)
const unique = [...new Set(failures)]
unique.slice(0, 14).forEach((f) => console.log(`FAIL: ${f}`))
if (unique.length > 14) console.log(`FAIL: and ${unique.length - 14} more, see qa/screen/${name}/report.json`)
console.log(unique.length ? 'FAIL' : 'PASS')
process.exit(unique.length ? 1 : 0)
