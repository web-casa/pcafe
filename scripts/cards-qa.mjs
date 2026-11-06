// Deterministic audit for a card set. The last line is PASS or FAIL, and the exit code matches.
// usage: node scripts/cards-qa.mjs <name> [--no-build]
//   writes dist/cards/<name>.html, dist/cards/<name>/NN-<preset>.png, qa/cards/<name>/ (feed thumbnails, gallery, report.json)
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { buildSet, exportSet, htmlPath, launch, openExport, outDir, pngName, pngSize, ROOT } from './cards-export.mjs'
import { missingCjk } from './font-coverage.mjs'

/** Exact-size check on disk. Separate so it can be tested against a tampered file. */
export function checkPngSizes(set) {
  const out = []
  for (const c of set.cards) {
    const file = join(outDir(set.name), pngName(c))
    if (!existsSync(file)) { out.push(`card ${c.index + 1}: PNG missing`); continue }
    const { w, h } = pngSize(file)
    if (w !== c.w || h !== c.h) out.push(`card ${c.index + 1} (${c.preset}): PNG is ${w}×${h}, the platform size is ${c.w}×${c.h}`)
  }
  return out
}

// Everything that can be read from the DOM at real size.
function auditDom() {
  const CJK = /[　-鿿＀-￯]/
  const limitLength = (t) => [...t].reduce((n, c) => n + (CJK.test(c) ? 1 : 0.5), 0)
  const problems = []
  const blocks = []
  const meta = window.__cards.cards
  for (const card of document.querySelectorAll('.cd')) {
    const i = Number(card.dataset.i)
    const c = meta[i]
    const tag = `card ${i + 1} (${c.preset}, ${c.t})`
    const box = card.getBoundingClientRect()
    const scale = Math.min(c.w, c.h) / 1080
    const say = (m) => problems.push(`${tag}: ${m}`)
    if (Math.round(box.width) !== c.w || Math.round(box.height) !== c.h) say(`rendered at ${box.width}×${box.height}`)
    if (card.dataset.unsupported) say(`template "${c.t}" has no layout for a ${card.dataset.unsupported} card`)

    const safe = { top: box.top + c.safe.top, right: box.right - c.safe.right, bottom: box.bottom - c.safe.bottom, left: box.left + c.safe.left }
    const lines = []
    const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT)
    for (let t = walker.nextNode(); t; t = walker.nextNode()) {
      const text = t.textContent.trim()
      if (!text) continue
      const el = t.parentElement
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none') continue
      const size = parseFloat(cs.fontSize)
      const svgText = el.closest('svg') ? el.closest('text') : null
      const svg = svgText ? svgText.ownerSVGElement : null
      // In an SVG the size is in viewBox units, which map to u.
      const px = svg ? (size * svg.getBoundingClientRect().width) / svg.viewBox.baseVal.width : size
      const range = document.createRange()
      range.selectNodeContents(t)
      const rects = svgText ? [svgText.getBoundingClientRect()] : [...range.getClientRects()]
      for (const r of rects) {
        if (!r.width) continue
        // A line box is taller than its glyphs. Measure what the eye sees: the em square around the middle.
        const mid = (r.top + r.bottom) / 2
        const ink = { top: mid - px / 2, bottom: mid + px / 2, left: r.left, right: r.right }
        lines.push({ el, ink, px, text })
        if (ink.right > box.right + 0.5 || ink.left < box.left - 0.5 || ink.bottom > box.bottom + 0.5 || ink.top < box.top - 0.5) say(`text leaves the card: "${text.slice(0, 18)}"`)
        else if (ink.right > safe.right + 1 || ink.left < safe.left - 1 || ink.bottom > safe.bottom + 1 || ink.top < safe.top - 1) say(`text enters the platform safe zone: "${text.slice(0, 18)}"`)
        for (const b of c.blocked ?? []) {
          const bl = box.left + b.x
          const bt = box.top + b.y
          if (ink.right > bl && ink.left < bl + b.w && ink.bottom > bt && ink.top < bt + b.h) say(`text under the platform's ${b.label}: "${text.slice(0, 18)}"`)
        }
      }
      // Readable when the card is opened full screen on a phone. Covers are judged separately in the feed.
      if (px < 10 && !card.dataset.compact) say(`text under 10 px in the file (${px.toFixed(1)}): "${text.slice(0, 18)}"`)
      const onPhone = px * (c.view / c.w)
      const small = !!el.closest('[data-small]')
      if (!card.dataset.compact && c.view && !card.dataset.cover && onPhone < (small ? 8 : 11)) say(`text is ${onPhone.toFixed(1)} px on a phone: "${text.slice(0, 18)}"`)
      // Ugly wraps: one character alone on the last line of a block.
      if (!svgText && rects.length > 1) {
        const last = rects[rects.length - 1]
        const widest = Math.max(...rects.map((r) => r.width))
        // A full-width stop takes a whole em, so "面。" is still one character alone.
        const room = /[。！？，、；：）」』”]$/.test(text) ? 2.1 : 1.6
        if (last.width < px * room && widest > px * 3) say(`one character alone on the last line: "${text.slice(-12)}"`)
      }
      blocks.push({ card: i, text, big: px / scale >= 60, x: rects[0].left - box.left, y: Math.min(...rects.map((r) => r.top)) - box.top, r: Math.max(...rects.map((r) => r.right)) - box.left, b: Math.max(...rects.map((r) => r.bottom)) - box.top, svg: !!svgText, head: !!el.closest('[data-headline]') })
    }

    // Separate blocks must not sit on each other.
    const headOf = (e) => e.closest('[data-headline]')
    for (let a = 0; a < lines.length; a++) {
      for (let b = a + 1; b < lines.length; b++) {
        const [x, y] = [lines[a], lines[b]]
        if (x.el === y.el || (headOf(x.el) && headOf(x.el) === headOf(y.el))) continue
        const w = Math.min(x.ink.right, y.ink.right) - Math.max(x.ink.left, y.ink.left)
        const h = Math.min(x.ink.bottom, y.ink.bottom) - Math.max(x.ink.top, y.ink.top)
        if (w > 2 && h > 2 && w * h > 0.12 * Math.min((x.ink.right - x.ink.left) * x.px, (y.ink.right - y.ink.left) * y.px)) say(`text overlaps: "${x.text.slice(0, 14)}" and "${y.text.slice(0, 14)}"`)
      }
    }

    // Overflow, in the frame and anywhere a box clips.
    const main = card.querySelector('.cd-main')
    if (main && main.scrollHeight > main.clientHeight + 1) say(`content is ${main.scrollHeight - main.clientHeight}px taller than the card. Cut content or split the card.`)
    for (const el of card.querySelectorAll('*')) {
      if (el instanceof SVGElement) continue
      const o = getComputedStyle(el).overflow
      if ((o === 'hidden' || o === 'clip') && !el.matches('.cd-image__box, .cd-rank__track, .cd-compare__track') && (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1)) say(`clipped content in .${el.className}`)
    }
    const head = card.querySelector('.cd-head, .cd-number__value')
    if (head && head.scrollWidth > head.clientWidth + 1) say(`headline is wider than its column`)
    const need = [['.cd-motif-bars__row', 90], ['.cd-chart', 240]]
    for (const [sel, min] of need) {
      const e = card.querySelector(sel)
      if (e && e.getBoundingClientRect().height < min * scale) say(`${sel} squeezed to ${Math.round(e.getBoundingClientRect().height / scale)}u. Cut text or use a taller preset.`)
    }

    // Content limits.
    for (const el of card.querySelectorAll('[data-max]')) {
      const n = limitLength(el.textContent.trim())
      if (n > Number(el.dataset.max)) say(`over the limit (${n} of ${el.dataset.max}): "${el.textContent.trim().slice(0, 20)}"`)
    }

    // Facts need sources.
    const hasOwnSources = !!card.querySelector('.cd-ending__src li')
    const words = [...card.querySelectorAll('.cd-main *, .cd-kicker')].map((e) => (e.children.length || e.closest('[aria-hidden="true"]') ? '' : e.textContent)).join(' ')
    if (/\d/.test(words) && !c.source && !hasOwnSources) say('states a number but has no source')
    if (c.source && !card.dataset.compact && !card.querySelector('.cd-source')?.textContent.trim()) say('source is declared but not on the card')
    for (const n of card.querySelectorAll('.cd-source')) if (c.source && n.getBoundingClientRect().height < 1) say('source line collapsed')
    const img = card.querySelector('[data-image-kind="photo"]')
    if (img && !img.dataset.credit) say('photo has no credit')
    for (const im of card.querySelectorAll('img')) if (!im.complete || !im.naturalWidth) say('image did not load')
  }
  return { problems, blocks }
}

// The checks that only apply to how a cover is shown in the feed.
function auditCovers() {
  const out = []
  const problems = []
  for (const card of document.querySelectorAll('.cd[data-cover]')) {
    const i = Number(card.dataset.i)
    const c = window.__cards.cards[i]
    const tag = `card ${i + 1} (${c.preset}, ${c.t})`
    const box = card.getBoundingClientRect()
    const head = card.querySelector('[data-headline]')
    if (!head) { problems.push(`${tag}: marked as a cover but has no headline. Use cover, wide or number.`); continue }
    const parts = head.children.length ? [...head.children].filter((e) => e.tagName !== 'SMALL') : [head]
    const factor = c.feed.w / c.w
    const rects = []
    for (const el of parts.length ? parts : [head]) {
      const size = parseFloat(getComputedStyle(el).fontSize)
      const range = document.createRange()
      range.selectNodeContents(el)
      const r = range.getBoundingClientRect()
      const mid = (r.top + r.bottom) / 2
      rects.push({ text: el.textContent, feedPx: size * factor, x: r.left - box.left, y: mid - size / 2 - box.top, w: r.width, h: size })
    }
    // A centred crop the platform may apply must not cut the headline.
    if (c.crop) {
      const cw = Math.min(c.w, c.h * c.crop.ratio)
      const ch = Math.min(c.h, c.w / c.crop.ratio)
      const [l, t] = [(c.w - cw) / 2, (c.h - ch) / 2]
      for (const r of rects) {
        if (r.x < l - 1 || r.x + r.w > l + cw + 1 || r.y < t - 1 || r.y + r.h > t + ch + 1) problems.push(`${tag}: headline "${r.text}" falls outside ${c.crop.label}`)
      }
    }
    out.push({ index: i, preset: c.preset, w: c.w, h: c.h, feed: c.feed, rects })
  }
  return { covers: out, problems }
}

// Runs in the page: downscale a PNG the way a feed does and measure contrast in the given rectangles.
async function measurePng({ dataUrl, targetW, targetH, rects }) {
  const img = new Image()
  img.src = dataUrl
  await img.decode()
  const bmp = targetW === img.naturalWidth ? await createImageBitmap(img) : await createImageBitmap(img, { resizeWidth: targetW, resizeHeight: targetH, resizeQuality: 'high' })
  const canvas = new OffscreenCanvas(bmp.width, bmp.height)
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(bmp, 0, 0)
  const scale = targetW / img.naturalWidth
  const lin = (v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
  const contrast = rects.map((r) => {
    const x = Math.max(0, Math.floor(r.x * scale))
    const y = Math.max(0, Math.floor(r.y * scale))
    const w = Math.min(bmp.width - x, Math.ceil(r.w * scale))
    const h = Math.min(bmp.height - y, Math.ceil(r.h * scale))
    if (w < 1 || h < 1) return { contrast: 0 }
    const d = ctx.getImageData(x, y, w, h).data
    const ls = []
    for (let p = 0; p < d.length; p += 4) ls.push(0.2126 * lin(d[p]) + 0.7152 * lin(d[p + 1]) + 0.0722 * lin(d[p + 2]))
    ls.sort((a, b) => a - b)
    const lo = ls[Math.floor(ls.length * 0.02)]
    const hi = ls[Math.floor(ls.length * 0.98)]
    return { contrast: (hi + 0.05) / (lo + 0.05) }
  })
  const blob = await canvas.convertToBlob({ type: 'image/png' })
  const bytes = new Uint8Array(await blob.arrayBuffer())
  let s = ''
  for (let i = 0; i < bytes.length; i += 32768) s += String.fromCharCode(...bytes.subarray(i, i + 32768))
  return { contrast, png: btoa(s) }
}

async function fontFallbacks(page) {
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('DOM.enable')
  await cdp.send('CSS.enable')
  const { root } = await cdp.send('DOM.getDocument', { depth: 0 })
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: '.cd, .cd *' })
  const bad = new Map()
  for (const nodeId of nodeIds) {
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId })
    for (const f of fonts) if (!f.isCustomFont) bad.set(f.familyName, (bad.get(f.familyName) ?? 0) + f.glyphCount)
  }
  await cdp.detach()
  return [...bad]
}

async function main() {
  const [name, ...flags] = process.argv.slice(2)
  if (!name) {
    console.error('usage: cards-qa <name> [--no-build]')
    process.exit(2)
  }
  if (!flags.includes('--no-build')) buildSet(name)
  const QA = join(ROOT, 'qa', 'cards', name)
  rmSync(QA, { recursive: true, force: true })
  mkdirSync(QA, { recursive: true })

  const failures = []
  const notes = []
  const warnings = []
  const fail = (m) => failures.push(m)
  const warn = (m) => warnings.push(m)
  const browser = await launch()
  const watch = (page) => {
    page.on('pageerror', (e) => fail(`page error: ${e.message.slice(0, 160)}`))
    page.on('console', (m) => { if (m.type() === 'error') fail(`console error: ${m.text().slice(0, 160)}`) })
    page.on('request', (r) => { if (/^https?:/.test(r.url())) fail(`network request: ${r.url()}`) })
  }

  const page = await openExport(browser, name)
  watch(page)
  const dom = await page.evaluate(auditDom)
  dom.problems.forEach(fail)
  const feed = await page.evaluate(auditCovers)
  feed.problems.forEach(fail)
  const fallbacks = await fontFallbacks(page)
  if (fallbacks.length) {
    const missing = missingCjk(await page.evaluate(() => document.body.innerText))
    const chars = missing.length ? ` Missing from the committed subsets: ${missing.join(' ')}` : ''
    warn(`${fallbacks.map(([family, glyphs]) => `${glyphs} glyphs in ${family}`).join(', ')} fell back to a system font.${chars} The cards still render; maintainers can add the characters with npm run fonts (Python, fonttools, Noto CJK sources).`)
  }

  const set = await exportSet(browser, name, page)
  set.name = name
  checkPngSizes(set).forEach(fail)

  const feedRows = []
  let minCover = Infinity
  for (const c of set.cards) {
    const file = join(set.dir, pngName(c))
    if (!existsSync(file)) continue
    const dataUrl = `data:image/png;base64,${readFileSync(file).toString('base64')}`
    const bytes = statSync(file).size
    if (c.preset === 'yt-thumb' && bytes > 2 * 1048576) notes.push(`card ${c.index + 1}: ${(bytes / 1048576).toFixed(1)} MB is over the 2 MB YouTube mobile limit`)

    // Every text block at real size. Antialiasing eats a little, so the small-text bar is 4, not 4.5.
    const blocks = dom.blocks.filter((b) => b.card === c.index)
    const full = await page.evaluate(measurePng, { dataUrl, targetW: c.w, targetH: c.h, rects: blocks.map((b) => ({ x: b.x, y: b.y, w: b.r - b.x, h: b.b - b.y })) })
    full.contrast.forEach(({ contrast }, i) => {
      const need = blocks[i].big ? 3 : 4
      if (contrast < need) fail(`card ${c.index + 1} (${c.preset}): low contrast ${contrast.toFixed(1)}:1 (needs ${need}) on "${blocks[i].text.slice(0, 18)}"`)
    })

    // The cover as the feed shows it: downscale the real file, then measure.
    const cover = feed.covers.find((x) => x.index === c.index)
    if (!cover) continue
    const targetW = c.feed.w
    const targetH = Math.round((c.h / c.w) * c.feed.w)
    const small = await page.evaluate(measurePng, { dataUrl, targetW, targetH, rects: cover.rects })
    writeFileSync(join(QA, `feed-${String(c.index + 1).padStart(2, '0')}-${c.preset}.png`), Buffer.from(small.png, 'base64'))
    cover.rects.forEach((r, i) => {
      minCover = Math.min(minCover, r.feedPx)
      const ratio = small.contrast[i].contrast
      if (r.feedPx < c.feed.minPx) fail(`card ${c.index + 1} (${c.preset}): headline "${r.text}" is ${r.feedPx.toFixed(1)} px at feed size (${targetW} px wide, ${c.feed.where}). Minimum ${c.feed.minPx}. Use fewer words per line.`)
      if (ratio < 3) fail(`card ${c.index + 1} (${c.preset}): headline "${r.text}" has ${ratio.toFixed(1)}:1 contrast at feed size. Minimum 3:1.`)
    })
    feedRows.push({ card: c.index + 1, preset: c.preset, feedWidth: targetW, headlinePx: cover.rects.map((r) => Number(r.feedPx.toFixed(1))), contrast: small.contrast.map((x) => Number(x.contrast.toFixed(1))) })
  }
  await page.close()

  // PDFs for document uploads: one page per card, one page size.
  for (const preset of set.pdfs) {
    const pdf = join(set.dir, `${name}-${preset}.pdf`)
    const info = spawnSync('pdfinfo', [pdf], { encoding: 'utf8' })
    const expected = set.cards.filter((c) => c.preset === preset).length
    if (info.status === 0) {
      const pages = Number(info.stdout.match(/Pages:\s+(\d+)/)?.[1])
      if (pages !== expected) fail(`${preset} PDF has ${pages} pages, the set has ${expected} cards`)
    } else {
      notes.push('pdfinfo not found: PDF page count not verified')
    }
  }

  // The gallery itself: no sideways scroll on a phone, and it loads with no network.
  for (const [w, h, tag] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
    const g = await browser.newPage({ viewport: { width: w, height: h } })
    watch(g)
    await g.goto(pathToFileURL(htmlPath(name)).href, { waitUntil: 'load' })
    await g.waitForFunction(() => document.documentElement.dataset.ready === 'true', null, { timeout: 30000 })
    await g.waitForTimeout(300)
    const over = await g.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    if (over > 0) fail(`gallery scrolls sideways by ${over}px at ${w}px wide`)
    await g.screenshot({ path: join(QA, `gallery-${tag}.png`) })
    await g.close()
  }
  await browser.close()

  // One overflow reports every line it pushes out: name the cause first.
  const rank = (f) => (/taller than|over the limit|no layout|no source|squeezed/.test(f) ? 0 : /leaves the card|safe zone|low contrast/.test(f) ? 2 : 1)
  const unique = [...new Set(failures)].sort((a, b) => rank(a) - rank(b))
  const report = { name, title: set.title, cards: set.cards.length, htmlBytes: statSync(htmlPath(name)).size, feed: feedRows, notes, warnings, failures: unique }
  writeFileSync(join(QA, 'report.json'), JSON.stringify(report, null, 2))
  console.log(`${name}: ${set.cards.length} cards, HTML ${(report.htmlBytes / 1048576).toFixed(2)} MB, smallest cover headline ${Number.isFinite(minCover) ? minCover.toFixed(1) : '-'} px at feed size`)
  console.log(`PNG: ${set.dir}`)
  notes.forEach((n) => console.log(`note: ${n}`))
  warnings.forEach((w) => console.log(`WARN: ${w}`))
  unique.slice(0, 14).forEach((f) => console.log(`FAIL: ${f}`))
  if (unique.length > 14) console.log(`FAIL: and ${unique.length - 14} more, see qa/cards/${name}/report.json`)
  console.log(unique.length ? 'FAIL' : 'PASS — all deterministic checks')
  process.exit(unique.length ? 1 : 0)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main()
