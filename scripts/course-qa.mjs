// Plays a whole lesson in Chromium, with no human, and decides PASS or FAIL. The last line is the verdict.
// usage: node scripts/course-qa.mjs <name | path/to/file.html>
//   <name> reads dist/course/<name>.html. Screenshots and report.json go to qa/course/<name>/.
//
// Runs, each in a fresh offline browser context:
//   desktop right, desktop wrong (mouse, 1440px), phone right, phone wrong (touch, 390px), keyboard only,
//   reload and resume, storage throwing on access, storage throwing on write, corrupted storage,
//   contents and deep links. The wrong run also plays "retry only what was wrong".
import { launchChromium } from './playwright.mjs'
import { missingCjk } from './font-coverage.mjs'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = resolve(import.meta.dirname, '..')
const arg = process.argv[2] ?? 'object-storage'
const FILE = arg.endsWith('.html') ? resolve(arg) : join(ROOT, 'dist', 'course', `${arg}.html`)
const name = basename(FILE, '.html')
if (!existsSync(FILE)) {
  console.error(`not found: ${FILE}`)
  console.log('FAIL')
  process.exit(1)
}
const OUT = join(ROOT, 'qa', 'course', name)
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const failures = []
const notes = []
const missingGlyphs = missingCjk(readFileSync(FILE, 'utf8'))
if (missingGlyphs.length) {
  notes.push(`characters missing from the committed font subsets: ${missingGlyphs.join(' ')}. The browser falls back to a system font; maintainers can add them with npm run fonts, then run npm run fonts:verify.`)
}
// A crash in this script is still a verdict: the last line must always be PASS or FAIL.
process.on('uncaughtException', (e) => {
  failures.slice(0, 20).forEach((f) => console.log(`FAIL: ${f}`))
  const at = String(e.stack ?? '').match(/course-qa\.mjs:(\d+)/)?.[1]
  const waiting = String(e.message ?? '').match(/waiting for (.+)/)?.[1]
  console.log(`FAIL: QA stopped at line ${at}: ${String(e.message ?? e).split('\n')[0].slice(0, 160)}${waiting ? ` (${waiting.slice(0, 80)})` : ''}`)
  console.log('FAIL')
  process.exit(1)
})
process.on('unhandledRejection', (e) => {
  throw e
})
const fail = (m) => {
  if (failures.includes(m)) return
  failures.push(m)
  if (process.env.QA_VERBOSE) console.log(`  ! ${m}`)
}
const url = pathToFileURL(FILE).href

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

const DESKTOP = { viewport: { width: 1440, height: 900 } }
const PHONE = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }

async function context(run, device, init) {
  const ctx = await browser.newContext({ ...device, offline: true, reducedMotion: 'reduce' })
  ctx.setDefaultTimeout(8000)
  if (init) await ctx.addInitScript(init)
  ctx.on('page', (page) => {
    page.on('pageerror', (e) => fail(`[${run}] page error: ${e.message.slice(0, 200)}`))
    page.on('console', (m) => {
      if (m.type() === 'error') fail(`[${run}] console error: ${m.text().slice(0, 200)}`)
    })
    page.on('request', (r) => {
      const u = r.url()
      if (u.startsWith('data:') || u.startsWith('blob:')) return
      if (u.split('#')[0].split('?')[0] !== url) fail(`[${run}] request left the single file: ${u.slice(0, 120)}`)
    })
  })
  return ctx
}

async function open(ctx, hash = '') {
  const page = await ctx.newPage()
  await page.goto(url + hash, { waitUntil: 'load' })
  await ready(page)
  return page
}

async function ready(page) {
  await page.waitForFunction(() => document.documentElement.dataset.ready === 'true', null, { timeout: 30000 })
}

/* ---------- input: a click, a tap or a key press on the same control ---------- */

const mouse = {
  name: 'mouse',
  press: (page, sel) => page.locator(sel).first().click(),
  type: async (page, sel, text) => {
    await page.locator(sel).first().click()
    await page.locator(sel).first().fill('')
    await page.keyboard.type(text)
  },
  select: (page, sel) => page.locator(sel).first().click(),
}
const touch = {
  name: 'touch',
  press: (page, sel) => page.locator(sel).first().tap(),
  type: async (page, sel, text) => {
    await page.locator(sel).first().tap()
    await page.locator(sel).first().fill('')
    await page.keyboard.type(text)
  },
  select: (page, sel) => page.locator(sel).first().tap(),
}

async function tabTo(page, sel, run) {
  const handle = await page.locator(sel).first().elementHandle({ timeout: 5000 })
  for (let i = 0; i < 160; i++) {
    if (await handle.evaluate((el) => el === document.activeElement)) {
      const ring = await handle.evaluate((el) => {
        const target = el.matches('input[type=radio],input[type=checkbox]') ? (el.closest('label') ?? el) : el
        return getComputedStyle(target).outlineStyle
      })
      if (ring === 'none') fail(`[${run}] no visible focus ring on ${sel}`)
      return true
    }
    await page.keyboard.press('Tab')
  }
  fail(`[${run}] cannot reach ${sel} with the Tab key`)
  return false
}

const keyboard = {
  name: 'keyboard',
  press: async (page, sel, run = 'keyboard') => {
    if (await tabTo(page, sel, run)) await page.keyboard.press('Enter')
  },
  type: async (page, sel, text, run = 'keyboard') => {
    if (await tabTo(page, sel, run)) await page.keyboard.type(text)
  },
  /** Choice tiles: a radio group takes one Tab stop and arrow keys; a checkbox takes Space. */
  select: async (page, sel, run = 'keyboard') => {
    const input = `${sel} input`
    const type = await page.locator(input).first().getAttribute('type')
    if (type === 'checkbox') {
      if (await tabTo(page, input, run)) await page.keyboard.press('Space')
      return
    }
    for (let i = 0; i < 160; i++) {
      if (await page.evaluate(() => document.activeElement?.matches?.('input[type=radio]'))) break
      await page.keyboard.press('Tab')
    }
    for (let i = 0; i < 8; i++) {
      if (await page.locator(input).first().isChecked()) return
      await page.keyboard.press('ArrowDown')
    }
    fail(`[${run}] arrow keys do not reach ${sel}`)
  },
}

/* ---------- what is true of every screen ---------- */

async function audit(page, run, label, device) {
  const r = await page.evaluate(
    ({ phone }) => {
      const out = { over: 0, wide: [], small: [], lowContrast: [], unnamed: [], tiny: [], under44: [], slideText: 99, h1: 0, noAlt: 0, minFont: 99 }
      const doc = document.documentElement
      out.over = doc.scrollWidth - doc.clientWidth
      out.h1 = document.querySelectorAll('h1').length
      const scope = document.querySelector('main') ?? document.body
      const inSlide = (el) => !!el.closest('.c-slidefig__box')
      for (const el of scope.querySelectorAll('*')) {
        if (inSlide(el) || el.closest('.c-sr') || el.matches('input[type=radio],input[type=checkbox]')) continue
        const b = el.getBoundingClientRect()
        if (b.width && (b.right > innerWidth + 1 || b.left < -1)) out.wide.push(el.className || el.tagName)
      }
      // A live slide is drawn at a small unit, so its text can end up tiny.
      const walk = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT)
      for (let t = walk.nextNode(); t; t = walk.nextNode()) {
        const el = t.parentElement
        if (!t.textContent.trim() || !inSlide(el)) continue
        out.slideText = Math.min(out.slideText, parseFloat(getComputedStyle(el).fontSize))
      }
      for (const img of scope.querySelectorAll('img')) if (!img.hasAttribute('alt')) out.noAlt++
      const controls = document.querySelectorAll('button, a[href], input:not([type=radio]):not([type=checkbox]), label:has(input[type=radio]), label:has(input[type=checkbox])')
      for (const c of controls) {
        const b = c.getBoundingClientRect()
        if (!b.width || !b.height || inSlide(c) || getComputedStyle(c).visibility === 'hidden') continue
        const name = (c.getAttribute('aria-label') ?? '') + (c.textContent ?? '') + (c.getAttribute('title') ?? '')
        if (!name.trim() && !c.matches('input')) out.unnamed.push(c.outerHTML.slice(0, 70))
        if (c.matches('input') && !c.getAttribute('aria-label') && !c.closest('label')) out.unnamed.push(c.outerHTML.slice(0, 70))
        const inline = c.closest('.c-source, .c-sources li, .c-resumed, .c-start__foot')
        if (inline) continue
        if (phone && !c.closest('.c-contents') && (b.width < 44 || b.height < 44)) out.under44.push(`${c.tagName} ${(c.textContent ?? '').trim().slice(0, 12)} ${Math.round(b.width)}x${Math.round(b.height)}`)
        if (b.width < 24 || b.height < 24) out.tiny.push(`${c.tagName} ${(c.textContent ?? '').trim().slice(0, 16)} ${Math.round(b.width)}x${Math.round(b.height)}`)
      }
      // Contrast and size of every visible text run.
      const rgb = (v) => {
        if (!v) return null
        let m = v.match(/^rgba?\(([^)]+)\)$/)
        if (m) {
          const p = m[1].split(/[ ,/]+/).map(Number)
          return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 }
        }
        m = v.match(/^color\(srgb ([^)]+)\)$/)
        if (m) {
          const p = m[1].split(/[ /]+/).map(Number)
          return { r: p[0] * 255, g: p[1] * 255, b: p[2] * 255, a: p[3] ?? 1 }
        }
        return null
      }
      const bgOf = (el) => {
        let stack = []
        for (let e = el; e; e = e.parentElement) {
          const s = getComputedStyle(e)
          if (s.backgroundImage !== 'none') return null
          const c = rgb(s.backgroundColor)
          if (c && c.a > 0) {
            stack.push(c)
            if (c.a === 1) break
          }
        }
        let out = { r: 255, g: 255, b: 255 }
        for (const c of stack.reverse()) out = { r: c.r * c.a + out.r * (1 - c.a), g: c.g * c.a + out.g * (1 - c.a), b: c.b * c.a + out.b * (1 - c.a) }
        return out
      }
      const lum = ({ r, g, b }) => {
        const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
      }
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      for (let t = walker.nextNode(); t; t = walker.nextNode()) {
        if (!t.textContent.trim()) continue
        const el = t.parentElement
        if (inSlide(el) || el.closest('.c-sr, script, style, [hidden], dialog:not([open])')) continue
        const box = el.getBoundingClientRect()
        const s = getComputedStyle(el)
        if (!box.width || s.visibility === 'hidden' || s.display === 'none') continue
        const size = parseFloat(s.fontSize)
        if (size < out.minFont) out.minFont = size
        if (size < 11) out.small.push(t.textContent.trim().slice(0, 16))
        const fg = rgb(s.color)
        const bg = bgOf(el)
        if (!fg || !bg || el.closest('[aria-disabled="true"]')) continue
        const a = lum(fg)
        const b = lum(bg)
        const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
        const large = size >= 24 || (size >= 18.66 && Number(s.fontWeight) >= 700)
        if (ratio < (large ? 3 : 4.5)) out.lowContrast.push(`${t.textContent.trim().slice(0, 16)} (${ratio.toFixed(2)}:1, ${Math.round(size)}px)`)
      }
      return out
    },
    { phone: device === PHONE },
  )
  const w = device === PHONE ? 390 : 1440
  if (r.over > 0) fail(`[${run}] ${label}: scrolls sideways by ${r.over}px at ${w}px`)
  if (r.wide.length) fail(`[${run}] ${label}: wider than the screen at ${w}px: ${[...new Set(r.wide)].slice(0, 3).join(', ')}`)
  if (r.h1 !== 1) fail(`[${run}] ${label}: ${r.h1} h1 headings, expected 1`)
  if (r.unnamed.length) fail(`[${run}] ${label}: control with no name: ${r.unnamed[0]}`)
  if (r.tiny.length) fail(`[${run}] ${label}: target under 24×24 (WCAG 2.5.8): ${r.tiny[0]}`)
  if (r.small.length) fail(`[${run}] ${label}: text under 11px: "${r.small[0]}"`)
  if (r.lowContrast.length) fail(`[${run}] ${label}: low contrast: ${r.lowContrast[0]}`)
  if (r.noAlt) fail(`[${run}] ${label}: image with no alt`)
  for (const u of r.under44) stats.under44.add(u)
  if (r.slideText < 99) stats.slideText = Math.min(stats.slideText, r.slideText)
  if (r.slideText < 9.5) fail(`[${run}] ${label}: live slide text reaches the eye at ${r.slideText.toFixed(1)}px`)
  stats.minFont = Math.min(stats.minFont, r.minFont)
}

const stats = { under44: new Set(), minFont: 99, slideText: 99, screens: 0, shots: 0 }

async function shoot(page, dir, file) {
  mkdirSync(join(OUT, dir), { recursive: true })
  // Full-page shots with the sticky bars in flow, or they land mid-page and hide content in the picture.
  const y = await page.evaluate(() => window.scrollY)
  const style = await page.addStyleTag({ content: '.c-top, .c-actions, .c-chips { position: static !important; }' })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: join(OUT, dir, `${file}.png`), fullPage: true })
  await style.evaluate((el) => el.remove())
  await page.evaluate((v) => window.scrollTo(0, v), y)
  stats.shots++
}

/** What the learner actually sees: the viewport, sticky bars included. */
async function shoot2(page, dir, file) {
  mkdirSync(join(OUT, dir), { recursive: true })
  await page.screenshot({ path: join(OUT, dir, `${file}.png`) })
  stats.shots++
}

/* ---------- answering ---------- */

async function answer(page, step, input, mode, run) {
  const ex = step.exercise
  const want = mode === 'right'
  switch (ex.type) {
    case 'single': {
      const opt = want ? ex.correct[0] : [...Array(ex.count).keys()].find((i) => !ex.correct.includes(i))
      await input.select(page, `[data-opt="${opt}"]`, run)
      break
    }
    case 'multi': {
      const opts = want ? ex.correct : [[...Array(ex.count).keys()].find((i) => !ex.correct.includes(i))]
      for (const o of opts) await input.select(page, `[data-opt="${o}"]`, run)
      break
    }
    case 'truefalse':
      await input.select(page, `[data-opt="${String(want ? ex.answer : !ex.answer)}"]`, run)
      break
    case 'order': {
      if (!want) break // The starting shuffle is never correct: QA checks that too.
      for (let target = 0; target < ex.count; target++) {
        for (let guard = 0; guard < ex.count + 1; guard++) {
          const order = await page.locator('[data-item]').evaluateAll((els) => els.map((e) => Number(e.dataset.item)))
          const pos = order.indexOf(target)
          if (pos === target) break
          const before = order.join()
          await input.press(page, `[data-item="${target}"] [data-up]`, run)
          const after = await page.locator('[data-item]').evaluateAll((els) => els.map((e) => e.dataset.item).join())
          if (before === after) fail(`[${run}] ordering: the up button did nothing`)
        }
      }
      break
    }
    case 'match': {
      const n = ex.pairs
      for (let i = 0; i < n; i++) {
        const chip = want ? ex.solution[i] : ex.solution[(i + 1) % n]
        await input.press(page, `[data-slot="${i}"]`, run)
        await input.press(page, `[data-chip="${chip}"]`, run)
      }
      break
    }
    case 'cloze':
      for (let i = 0; i < ex.answers.length; i++) await input.type(page, `input[data-blank="${i}"]`, want ? ex.answers[i] : 'zzz', run)
      break
  }
}

/** After checking: right verdict, a live region, words not colour, an explanation on screen. */
async function verifyFeedback(page, step, mode, run) {
  const ex = step.exercise
  const v = page.locator('[data-feedback][data-verdict]')
  if (!(await v.count())) return fail(`[${run}] ${step.id}: no feedback after checking`)
  const verdict = await v.getAttribute('data-verdict')
  if (verdict !== mode) fail(`[${run}] ${step.id}: answered ${mode === 'right' ? 'with the marked correct answer' : 'wrongly'} but it scored "${verdict}"`)
  const f = await v.evaluate((el) => ({ role: el.getAttribute('role'), text: el.textContent.trim(), said: el.querySelector('.c-sr')?.textContent.trim() ?? '', hasText: !!el.querySelector('b')?.textContent.trim(), icon: !!el.querySelector('svg') }))
  if (f.role !== 'status') fail(`[${run}] ${step.id}: feedback is not a status region (WCAG 4.1.3)`)
  if (!f.hasText || !f.icon) fail(`[${run}] ${step.id}: verdict needs words and an icon, not colour alone (WCAG 1.4.1)`)
  if (f.said.length < 8) fail(`[${run}] ${step.id}: the status region has no explanation to announce`)
  const whys = await page.locator('[data-why]').evaluateAll((els) => els.filter((e) => e.getBoundingClientRect().height > 0).map((e) => e.textContent.trim()))
  if (!whys.length || whys.some((t) => t.length < 8)) fail(`[${run}] ${step.id}: no visible explanation after checking`)
  if ((ex.type === 'single' || ex.type === 'multi') && whys.length !== ex.count) fail(`[${run}] ${step.id}: ${whys.length} of ${ex.count} options explain themselves`)
  if (ex.type === 'match' && whys.length !== ex.pairs) fail(`[${run}] ${step.id}: ${whys.length} of ${ex.pairs} pairs explain themselves`)
  if (ex.type === 'single' || ex.type === 'multi') {
    const marked = await page.locator('[data-opt][data-correct="true"]').evaluateAll((els) => els.map((e) => Number(e.dataset.opt)).sort((a, b) => a - b))
    if (marked.join() !== [...ex.correct].sort((a, b) => a - b).join()) fail(`[${run}] ${step.id}: the options shown as correct differ from the marked answer`)
    const labels = await page.locator('[data-opt][data-correct="true"] .c-choice__label').count()
    if (labels !== ex.correct.length) fail(`[${run}] ${step.id}: correct option has no text label (WCAG 1.4.1)`)
  }
  const cited = await page.locator('[data-cite]').count()
  if (cited !== step.cites.length) fail(`[${run}] ${step.id}: shows ${cited} of ${step.cites.length} sources`)
}

async function playCards(page, input, mode, run) {
  for (let guard = 0; guard < 30; guard++) {
    if (await page.locator('[data-cards-done]').count()) return
    await input.press(page, '[data-flip]', run)
    const fb = await page.locator('[data-card] [data-feedback] [data-why]').textContent()
    if (!fb || fb.trim().length < 4) fail(`[${run}] flashcard has no back after flipping`)
    await input.press(page, mode === 'right' ? '[data-know]' : '[data-again]', run)
  }
  fail(`[${run}] flashcards never finish`)
}

async function playLab(page, step, input, run) {
  const label = await page.locator('[data-simulation]').first().textContent().catch(() => '')
  if (!label || label.trim().length < 10) fail(`[${run}] ${step.id}: not labelled as a simulation`)
  for (const a of step.solve) {
    if ('click' in a) await input.press(page, a.click, run)
    else if ('fill' in a) await input.type(page, a.fill[0], a.fill[1], run)
    else if (!(await page.locator(a.expect).count())) fail(`[${run}] ${step.id}: expected ${a.expect} after the scripted step`)
  }
  const done = await page.locator('[data-task][data-state="done"]').count()
  if (done !== step.tasks.length) fail(`[${run}] ${step.id}: ${done} of ${step.tasks.length} tasks completed by the scripted solution`)
  const whys = await page.locator('[data-task] [data-why]').evaluateAll((els) => els.map((e) => e.textContent.trim()))
  if (whys.length !== step.tasks.length || whys.some((t) => t.length < 8)) fail(`[${run}] ${step.id}: a finished task does not explain itself`)
}

/* ---------- a full run ---------- */

async function play(run, device, input, mode, opts = {}) {
  const ctx = await context(run, device, opts.init)
  const page = await open(ctx)
  const manifest = await page.evaluate(() => window.__course.manifest)
  const problems = await page.evaluate(() => window.__course.problems)
  problems.forEach((p) => fail(`content: ${p}`))
  const dir = opts.dir
  if (dir) await shoot(page, dir, '00-start')
  await audit(page, run, 'start', device)
  await input.press(page, '[data-action="start"]', run)

  const positions = []
  for (let i = 0; i < manifest.steps.length; i++) {
    const step = manifest.steps[i]
    const n = String(i + 1).padStart(2, '0')
    // Links change the hash, and the route follows a moment later.
    await page.locator(`[data-step="${step.id}"]`).waitFor({ timeout: 4000 }).catch(() => {})
    const here = await page.locator('[data-step]').getAttribute('data-step', { timeout: 2000 }).catch(() => null)
    if (here !== step.id) {
      fail(`[${run}] step ${i + 1}: expected "${step.id}", found "${here}": a step cannot be reached by continuing`)
      break
    }
    stats.screens++
    if (input === keyboard) {
      const focused = await page.evaluate(() => document.activeElement?.tagName)
      if (focused !== 'H1') fail(`[${run}] ${step.id}: focus is on ${focused} after navigating, not on the heading`)
    }
    if (dir) await shoot(page, dir, `${n}-${step.id}-idle`)
    await audit(page, run, step.id, device)

    if (step.kind === 'read') {
      for (let g = 0; g < 8 && (await page.locator('[data-reveal]').count()); g++) await input.press(page, '[data-reveal]', run)
      if (await page.locator('[data-worked]').count()) {
        if (!(await page.locator('[data-conclusion="shown"]').count())) fail(`[${run}] ${step.id}: the worked example never reaches its conclusion`)
        if (dir) await shoot(page, dir, `${n}-${step.id}-open`)
      }
      if (await page.locator('[data-keyviews]').count()) {
        await input.press(page, '[data-keyviews] [data-folder]', run)
        if (!(await page.locator('[data-keyviews] [data-hit]').count())) fail(`[${run}] ${step.id}: tapping a folder highlights nothing`)
        if (dir) await shoot(page, dir, `${n}-${step.id}-open`)
      }
      if (!step.cites.length && !(await page.locator('.c-cites').count())) fail(`[${run}] ${step.id}: no source line`)
    } else if (step.kind === 'lab') {
      await playLab(page, step, input, run)
      await audit(page, run, `${step.id} done`, device)
      if (dir) await shoot(page, dir, `${n}-${step.id}-${mode}`)
    } else if (step.exercise.type === 'flashcards') {
      if (dir && (await page.locator('[data-flip]').count())) {
        await input.press(page, '[data-flip]', run)
        await shoot(page, dir, `${n}-${step.id}-back`)
        await page.keyboard.press('Escape')
        await input.press(page, mode === 'right' ? '[data-know]' : '[data-again]', run)
      }
      await playCards(page, input, mode, run)
      await audit(page, run, `${step.id} done`, device)
      if (dir) await shoot(page, dir, `${n}-${step.id}-${mode}`)
    } else {
      // Checking with nothing filled in must explain what is missing, not silently score it.
      if (step.exercise.type !== 'order') {
        await input.press(page, '[data-action="check"]', run)
        if (!(await page.locator('[data-problem]').count())) fail(`[${run}] ${step.id}: checking an empty answer says nothing`)
        if (await page.locator('[data-feedback][data-verdict]').count()) fail(`[${run}] ${step.id}: an empty answer was scored`)
      } else {
        const start = await page.locator('[data-item]').evaluateAll((els) => els.map((e) => Number(e.dataset.item)))
        if (start.every((v, k) => v === k)) fail(`[${run}] ${step.id}: ordering starts already solved`)
      }
      if (step.exercise.type === 'single') {
        const pos = await page.locator('[data-opt]').evaluateAll((els, c) => els.findIndex((e) => Number(e.dataset.opt) === c), step.exercise.correct[0])
        positions.push(pos)
      }
      await answer(page, step, input, mode, run)
      await input.press(page, '[data-action="check"]', run)
      await verifyFeedback(page, step, mode, run)
      if (input === keyboard) {
        const onNext = await page.evaluate(() => document.activeElement?.getAttribute('data-action'))
        if (onNext !== 'next') fail(`[${run}] ${step.id}: focus lost after checking (on "${onNext}")`)
      }
      await audit(page, run, `${step.id} ${mode}`, device)
      if (dir) await shoot(page, dir, `${n}-${step.id}-${mode}`)
    }
    if (step.kind !== 'practice' || step.exercise.type === 'flashcards' || !opts.skipNextCheck) await input.press(page, '[data-action="next"]', run)
  }
  await page.locator('[data-finish]').waitFor({ timeout: 5000 }).catch(() => fail(`[${run}] the results page was not reached`))
  stats.screens++
  if (positions.length >= 3 && new Set(positions).size === 1) fail(`[${run}] the correct option is always in position ${positions[0] + 1}`)
  return { ctx, page, manifest }
}

/** The results page agrees with what was played. */
async function verifyFinish(page, manifest, mode, run) {
  const scored = manifest.steps.filter((s) => s.scored)
  const f = await page.locator('[data-finish]').evaluate((el) => ({ state: el.dataset.finish, right: Number(el.dataset.right), total: Number(el.dataset.total), retry: Number(el.dataset.retry) }))
  if (f.state !== 'done') fail(`[${run}] results say unfinished after every step was answered`)
  if (f.total !== scored.length) fail(`[${run}] results count ${f.total} questions, the course has ${scored.length}`)
  const expect = mode === 'right' ? scored.length : 0
  if (f.right !== expect) fail(`[${run}] results say ${f.right} right, ${expect} were played right`)
  const rows = await page.locator('[data-concept]').evaluateAll((els) => els.map((e) => ({ key: e.dataset.concept, first: Number(e.dataset.first), of: Number(e.dataset.of) })))
  if (rows.length !== manifest.concepts.length) fail(`[${run}] ${rows.length} of ${manifest.concepts.length} concepts in the result table`)
  if (rows.reduce((n, r) => n + r.of, 0) !== scored.length) fail(`[${run}] the result table does not add up to ${scored.length} questions`)
  if (rows.reduce((n, r) => n + r.first, 0) !== f.right) fail(`[${run}] per-concept results do not add up to the score`)
  return f
}

/* ---------- runs ---------- */

/** Links change the hash and the route follows a moment later: wait for this step to go away. */
async function leftStep(page, id) {
  await page.locator(`[data-step="${id}"]`).waitFor({ state: 'detached', timeout: 4000 }).catch(() => {})
}

// Desktop, mouse, every answer right. This run also checks the sources.
{
  const run = 'desktop-right'
  const { ctx, page, manifest } = await play(run, DESKTOP, mouse, 'right', { dir: 'desktop' })
  const f = await verifyFinish(page, manifest, 'right', run)
  if (f.retry !== 0) fail(`[${run}] ${f.retry} items offered for retry after a perfect run`)
  if (await page.locator('[data-action="retry"]').count()) fail(`[${run}] a retry is offered with nothing to retry`)
  await audit(page, run, 'results', DESKTOP)
  await shoot(page, 'desktop', 'finish-all-right')
  // Review round: reachable, plays, and is recorded.
  await page.locator('[data-action="review"]').click()
  const reviewIds = await page.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage).find((k) => k.startsWith('pcafe.course')))).drill.ids)
  if (!reviewIds.length) fail(`[${run}] the review round is empty`)
  for (let i = 0; i < reviewIds.length; i++) {
    const id = await page.locator('[data-step][data-mode="review"]').getAttribute('data-step')
    const step = manifest.steps.find((s) => s.id === id)
    await answer(page, step, mouse, 'right', run)
    await mouse.press(page, '[data-action="check"]')
    await verifyFeedback(page, step, 'right', run)
    if (i === 0) await shoot(page, 'desktop', 'review-round')
    await mouse.press(page, '[data-action="next"]')
    await leftStep(page, id)
  }
  await page.locator('[data-finish]').waitFor({ timeout: 4000 }).catch(() => fail(`[${run}] the review round does not end on the results`))
  if (!(await page.locator('[data-last-review]').count())) fail(`[${run}] the finished review round is not recorded`)
  // Every source is listed and has real text.
  await page.locator('[data-nav-sources]').first().click()
  await page.locator('[data-sources]').waitFor()
  const sources = await page.locator('[data-source]').evaluateAll((els) => els.map((e) => e.textContent.trim()))
  if (sources.length < manifest.sources.length) fail(`[${run}] source list shows ${sources.length} of ${manifest.sources.length}`)
  if (sources.some((s) => s.length < 8)) fail(`[${run}] empty source entry`)
  for (const key of manifest.sources) if (!manifest.steps.some((s) => s.cites.includes(key))) notes.push(`source "${key}" is never cited`)
  await audit(page, run, 'sources', DESKTOP)
  await shoot(page, 'desktop', 'sources')
  await ctx.close()
}

// Desktop, mouse, every answer wrong.
{
  const run = 'desktop-wrong'
  const { ctx, page, manifest } = await play(run, DESKTOP, mouse, 'wrong', { dir: 'desktop' })
  await verifyFinish(page, manifest, 'wrong', run)
  await audit(page, run, 'results', DESKTOP)
  await shoot(page, 'desktop', 'finish-all-wrong')
  await page.emulateMedia({ media: 'print' })
  await shoot(page, 'desktop', 'finish-print')
  const printable = await page.evaluate(() => ({
    top: getComputedStyle(document.querySelector('.c-top')).display,
    rail: getComputedStyle(document.querySelector('.c-rail')).display,
    table: document.querySelector('.c-results')?.getBoundingClientRect().height ?? 0,
    missed: document.querySelectorAll('[data-missed]').length,
  }))
  if (printable.top !== 'none' || printable.rail !== 'none') fail(`[${run}] the printed result still shows the app chrome`)
  if (!printable.table || !printable.missed) fail(`[${run}] the printed result is missing the table or the missed questions`)
  await page.emulateMedia({ media: 'screen' })
  await ctx.close()
}

// Phone, touch, every answer right.
{
  const run = 'phone-right'
  const { ctx, page, manifest } = await play(run, PHONE, touch, 'right', { dir: 'phone' })
  await verifyFinish(page, manifest, 'right', run)
  await shoot(page, 'phone', 'finish-all-right')
  await ctx.close()
}

// Phone, touch, every answer wrong, then retry only what was wrong.
{
  const run = 'phone-wrong'
  const { ctx, page, manifest } = await play(run, PHONE, touch, 'wrong', { dir: 'phone' })
  const f = await verifyFinish(page, manifest, 'wrong', run)
  const scored = manifest.steps.filter((s) => s.scored)
  const flash = manifest.steps.filter((s) => s.exercise?.type === 'flashcards')
  if (f.retry !== scored.length + flash.length) fail(`[${run}] retry offers ${f.retry} items, expected ${scored.length + flash.length}`)
  const missed = await page.locator('[data-missed]').count()
  if (missed !== scored.length) fail(`[${run}] the results list ${missed} missed questions, expected ${scored.length}`)
  await audit(page, run, 'results', PHONE)
  await shoot(page, 'phone', 'finish-all-wrong')

  // Retry, getting only the first one right: the rest must stay on the list.
  await page.locator('[data-action="retry"]').tap()
  let seen = 0
  for (let i = 0; i < f.retry; i++) {
    const id = await page.locator('[data-step][data-mode="retry"]').getAttribute('data-step', { timeout: 5000 }).catch(() => null)
    if (!id) {
      fail(`[${run}] retry round stopped at ${i + 1} of ${f.retry}`)
      break
    }
    seen++
    const step = manifest.steps.find((s) => s.id === id)
    if (step.exercise.type === 'flashcards') await playCards(page, touch, 'right', run)
    else {
      if (step.scored === false) fail(`[${run}] the retry round includes unscored "${id}"`)
      await answer(page, step, touch, 'right', run)
      await touch.press(page, '[data-action="check"]')
      await verifyFeedback(page, step, 'right', run)
    }
    if (i === 0) await shoot(page, 'phone', 'retry-round')
    await audit(page, run, `retry ${id}`, PHONE)
    await touch.press(page, '[data-action="next"]')
    await leftStep(page, id)
  }
  if (seen !== f.retry) fail(`[${run}] the retry round played ${seen} of ${f.retry}`)
  await page.locator('[data-finish]').waitFor({ timeout: 5000 }).catch(() => fail(`[${run}] the retry round does not end on the results`))
  const after = await page.locator('[data-finish]').evaluate((el) => ({ right: Number(el.dataset.right), retry: Number(el.dataset.retry) }))
  if (after.right !== 0) fail(`[${run}] retrying changed the first-try score to ${after.right}`)
  if (after.retry !== 0) fail(`[${run}] ${after.retry} items still wrong after retrying them right`)
  const nowTotal = await page.locator('[data-concept]').evaluateAll((els) => els.reduce((n, e) => n + Number(e.dataset.now), 0))
  if (nowTotal !== scored.length) fail(`[${run}] results show ${nowTotal} right now, expected ${scored.length}`)
  await shoot(page, 'phone', 'finish-after-retry')
  await ctx.close()
}

// Keyboard only: no mouse call anywhere in this run.
{
  const run = 'keyboard'
  const { ctx, page, manifest } = await play(run, DESKTOP, keyboard, 'right')
  await verifyFinish(page, manifest, 'right', run)
  await ctx.close()
}

// Phone lab flow: the task list and the form are a screen apart, so each must bring the next one into view.
{
  const run = 'lab-phone'
  const ctx = await context(run, PHONE)
  const page = await open(ctx)
  const lab = (await page.evaluate(() => window.__course.manifest)).steps.find((s) => s.kind === 'lab')
  if (lab) {
    await page.goto(`${url}#/s/${encodeURIComponent(lab.id)}`)
    const seen = (sel) => page.locator(sel).first().evaluate((el) => {
      const b = el.getBoundingClientRect()
      return b.bottom > 0 && b.top < innerHeight
    })
    await page.locator('[data-fill]').first().tap()
    await page.waitForTimeout(120)
    if (!(await seen('[data-send]'))) fail(`[${run}] filling in a task leaves the send button off screen`)
    await shoot2(page, 'phone', 'lab-viewport-filled')
    await page.locator('[data-send]').first().tap()
    await page.waitForTimeout(120)
    if (!(await seen('[data-response]'))) fail(`[${run}] the response is off screen after sending`)
    await shoot2(page, 'phone', 'lab-viewport-response')
    if (await page.locator('[data-next]').count()) {
      await page.locator('[data-next]').first().tap()
      await page.waitForTimeout(120)
      if (!(await seen('[data-send]'))) fail(`[${run}] the next-task button leaves the send button off screen`)
      await page.locator('[data-send]').first().tap()
      if (!(await page.locator('[data-task][data-state="done"]').nth(1).count())) fail(`[${run}] the next-task button did not lead to a finished task`)
    }
  }
  await ctx.close()
}

// Keyboard at phone width: the contents drawer opens, traps and closes.
{
  const run = 'drawer'
  const ctx = await context(run, { viewport: { width: 390, height: 844 } })
  const page = await open(ctx)
  const manifest = await page.evaluate(() => window.__course.manifest)
  await page.goto(`${url}#/s/${manifest.steps[0].id}`)
  await keyboard.press(page, '[data-contents]', run)
  const dialog = page.locator('dialog[open]')
  if (!(await dialog.count())) fail(`[${run}] the contents drawer did not open`)
  await shoot(page, 'phone', 'contents')
  const links = await dialog.locator('[data-nav-step]').count()
  if (links !== manifest.steps.length) fail(`[${run}] the drawer lists ${links} of ${manifest.steps.length} steps`)
  await page.keyboard.press('Escape')
  await page.locator('dialog.c-drawer').waitFor({ state: 'detached', timeout: 3000 }).catch(() => fail(`[${run}] Escape does not close the drawer`))
  const refocus = await page.evaluate(() => document.activeElement?.getAttribute('data-contents'))
  if (refocus === null || refocus === undefined) fail(`[${run}] focus does not return to the contents button`)
  await keyboard.press(page, '[data-contents]', run)
  await page.locator(`dialog[open] [data-nav-step="${manifest.steps[3].id}"]`).focus()
  await page.keyboard.press('Enter')
  await page.locator(`[data-step="${manifest.steps[3].id}"]`).waitFor({ timeout: 3000 }).catch(() => fail(`[${run}] a drawer link does not navigate`))
  if (await page.locator('dialog[open]').count()) fail(`[${run}] the drawer stays open after navigating`)
  await ctx.close()
}

// Every step reachable from the contents and by deep link, and skipping works.
{
  const run = 'contents'
  const ctx = await context(run, DESKTOP)
  const page = await open(ctx)
  const manifest = await page.evaluate(() => window.__course.manifest)
  for (const s of [...manifest.steps].reverse()) {
    await page.goto(`${url}#/s/${encodeURIComponent(s.id)}`)
    await page.locator(`[data-nav-step="${s.id}"]`).click()
    const got = await page.locator('[data-step]').getAttribute('data-step')
    if (got !== s.id) fail(`[${run}] the contents link for "${s.id}" opened "${got}"`)
    const fresh = await open(ctx, `#/s/${encodeURIComponent(s.id)}`)
    if ((await fresh.locator('[data-step]').getAttribute('data-step')) !== s.id) fail(`[${run}] deep link to "${s.id}" fails`)
    await fresh.close()
  }
  // Skip the first exercise: unanswered, counted as such, and offered again.
  const first = manifest.steps.find((s) => s.scored)
  await page.goto(`${url}#/s/${encodeURIComponent(first.id)}`)
  await page.locator('[data-action="skip"]').click()
  await page.locator('[data-nav-finish]').first().click()
  const f = await page.locator('[data-finish]').evaluate((el) => el.dataset.finish)
  if (f !== 'partial') fail(`[${run}] results claim the course is finished with nothing answered`)
  if (!(await page.locator('[data-action="go-unanswered"]').count())) fail(`[${run}] no way back to the unanswered questions`)
  await audit(page, run, 'results (partial)', DESKTOP)
  await shoot(page, 'desktop', 'finish-partial')
  await ctx.close()
}

// Reload and resume.
{
  const run = 'reload'
  const ctx = await context(run, DESKTOP)
  let page = await open(ctx)
  const manifest = await page.evaluate(() => window.__course.manifest)
  await page.locator('[data-action="start"]').click()
  const practice = manifest.steps.filter((s) => s.kind === 'practice' && s.exercise.type !== 'flashcards').slice(0, 4)
  if (practice.length < 4) throw new Error('the reload test needs at least 4 questions that are not flashcards')
  const lab = manifest.steps.find((s) => s.kind === 'lab')
  let lastHash = ''
  for (const s of practice) {
    await page.goto(`${url}#/s/${encodeURIComponent(s.id)}`)
    await answer(page, s, mouse, s === practice[1] ? 'wrong' : 'right', run)
    await mouse.press(page, '[data-action="check"]')
    lastHash = `#/s/${encodeURIComponent(s.id)}`
  }
  const before = await page.locator('[data-feedback][data-verdict]').getAttribute('data-verdict')
  await page.reload()
  await ready(page)
  if (!page.url().endsWith(lastHash)) fail(`[${run}] reload lost the step: ${page.url().split('#')[1]}`)
  const after = await page.locator('[data-feedback][data-verdict]').getAttribute('data-verdict').catch(() => null)
  if (after !== before) fail(`[${run}] the answer did not survive a reload (${before} → ${after})`)
  if (await page.locator('[data-action="check"]').count()) fail(`[${run}] an answered question can be answered again after reload`)
  await page.goto(`${url}#/s/${encodeURIComponent(practice[1].id)}`)
  if ((await page.locator('[data-feedback][data-verdict]').getAttribute('data-verdict')) !== 'wrong') fail(`[${run}] a wrong answer did not survive`)

  // Close everything and come back with no hash: resume where you left off.
  await page.goto(`${url}#/s/${encodeURIComponent(practice[3].id)}`)
  await page.close()
  page = await open(ctx)
  const resumed = await page.locator('[data-step]').getAttribute('data-step').catch(() => null)
  if (resumed !== practice[3].id) fail(`[${run}] reopening resumed at "${resumed}", expected "${practice[3].id}"`)
  if (!(await page.locator('[data-resumed]').count())) fail(`[${run}] reopening does not say where you came back to`)
  await shoot(page, 'desktop', 'resumed')

  // Lab progress survives, and so does an interrupted retry round.
  if (lab) {
    await page.goto(`${url}#/s/${encodeURIComponent(lab.id)}`)
    await playLab(page, lab, mouse, run)
    await page.reload()
    await ready(page)
    const done = await page.locator('[data-task][data-state="done"]').count()
    if (done !== lab.tasks.length) fail(`[${run}] lab progress did not survive a reload (${done}/${lab.tasks.length})`)
  }
  await page.goto(`${url}#/start`)
  if (!(await page.locator('[data-action="start"]').textContent()).trim()) fail(`[${run}] no resume button`)
  await page.locator('[data-action="reset"]').click()
  await page.locator('[data-action="reset"]').click()
  const stored = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('pcafe.course')).length)
  const left = await page.evaluate(() => {
    const k = Object.keys(localStorage).find((x) => x.startsWith('pcafe.course'))
    return k ? JSON.parse(localStorage.getItem(k)).seen?.length ?? 0 : 0
  })
  if (stored && left) fail(`[${run}] start over left progress behind`)
  await ctx.close()
}

// Storage throwing on access (blocked site data, some file: origins, private modes).
const BLOCK_READ = `Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError') } })`
const BLOCK_WRITE = `Storage.prototype.setItem = function () { throw new DOMException('full', 'QuotaExceededError') }`
for (const [run, init] of [
  ['storage-blocked', BLOCK_READ],
  ['storage-full', BLOCK_WRITE],
]) {
  const { ctx, page, manifest } = await play(run, PHONE, touch, 'right', { init })
  await verifyFinish(page, manifest, 'right', run)
  if ((await page.locator('html').evaluate(() => document.querySelector('[data-storage-banner]') === null))) fail(`[${run}] no notice that progress will not be saved`)
  const note = await page.locator('[data-storage-note="memory"]').count()
  if (!note) fail(`[${run}] the results page claims progress is saved`)
  if (run === 'storage-blocked') await shoot(page, 'phone', 'storage-blocked')
  await page.reload()
  await ready(page)
  if (await page.locator('#root:empty').count()) fail(`[${run}] blank page after reload`)
  await ctx.close()
}

// Corrupted, foreign and stale storage: starts clean and never crashes.
for (const [run, value] of [
  ['storage-corrupt', '{not json'],
  ['storage-foreign', '{"v":99,"first":"x"}'],
  ['storage-stale', '{"v":1,"at":"#/s/nope","seen":["a"],"first":{"p-guess":{"response":{"type":"order","order":[9]},"ok":true,"at":1}},"latest":{"x":true},"labs":{"lab-s3":"oops"},"cards":{"f-cards":{"queue":[99,"x"]}},"drill":{"kind":"retry","ids":["gone"],"round":1,"answers":null,"cards":null},"reviews":"no"}'],
]) {
  const ctx = await context(run, DESKTOP)
  const seed = await open(ctx)
  const id = await seed.evaluate(() => window.__course.manifest.id)
  await seed.evaluate(([k, v]) => localStorage.setItem(k, v), [`pcafe.course.${id}`, value])
  await seed.close()
  const page = await open(ctx)
  if (!(await page.locator('h1').count())) fail(`[${run}] nothing rendered`)
  const steps = await page.evaluate(() => window.__course.manifest.steps.map((s) => s.id))
  await page.goto(`${url}#/s/${encodeURIComponent(steps[0])}`)
  if (!(await page.locator('[data-step]').count())) fail(`[${run}] the first step does not open`)
  await page.goto(`${url}#/finish`)
  if (!(await page.locator('[data-finish]').count())) fail(`[${run}] the results page does not open`)
  await ctx.close()
}

await browser.close()

const bytes = statSync(FILE).size
writeFileSync(join(OUT, 'report.json'), JSON.stringify({ name, bytes, ...stats, under44: [...stats.under44], notes, failures }, null, 2))
console.log(`${name}: ${stats.screens} screens played, ${stats.shots} screenshots, HTML ${(bytes / 1048576).toFixed(2)} MB, smallest text ${stats.minFont}px (live slide ${stats.slideText.toFixed(1)}px), ${stats.under44.size} distinct controls under 44px at 390px (minimum enforced: 24)`)
notes.forEach((n) => console.log(`note: ${n}`))
failures.slice(0, 20).forEach((f) => console.log(`FAIL: ${f}`))
if (failures.length > 20) console.log(`FAIL: and ${failures.length - 20} more, see qa/course/${name}/report.json`)
console.log(failures.length ? 'FAIL' : 'PASS — all deterministic checks')
process.exit(failures.length ? 1 : 0)
