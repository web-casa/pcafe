// Deterministic audit for a print item: poster, roll-up, tri-fold or long image.
// usage: node scripts/print-qa.mjs <name> [--no-build]   writes dist/print/<name>/ and qa/print/<name>/
// Exit code 1 on any hard failure; the last line is PASS or FAIL. Rules and sources: plans/research-print.md.
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { buildItem, exportItem, htmlPath, launch, openItem, pngSize } from './print-export.mjs'
import { missingCjk } from './font-coverage.mjs'

const ROOT = resolve(import.meta.dirname, '..')
const args = process.argv.slice(2)
const name = args.find((a) => !a.startsWith('--'))
if (!name) { console.error('usage: print-qa <name> [--no-build]'); process.exit(2) }
const OUT = join(ROOT, 'qa', 'print', name)
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const failures = []
const notes = []
const warnings = []
const fail = (m) => { failures.push(m) }
const warn = (m) => { warnings.push(m) }
const step = (m) => console.log(`· ${m}`)
const finish = (extra = {}) => {
  // One overflow reports every line it pushes out: name the cause first.
  const all = [...new Set(failures)]
  const isEffect = (f) => /text (runs off|outside the safe|in the hidden)/.test(f)
  const unique = [...all.filter((f) => !isEffect(f)), ...all.filter(isEffect)]
  writeFileSync(join(OUT, 'report.json'), JSON.stringify({ name, notes, warnings, failures: unique, ...extra }, null, 2))
  notes.forEach((n) => console.log(`note: ${n}`))
  for (const w of new Set(warnings)) console.log(`WARN: ${w}`)
  unique.slice(0, 20).forEach((f) => console.log(`FAIL: ${f}`))
  if (unique.length > 20) console.log(`FAIL: and ${unique.length - 20} more, see qa/print/${name}/report.json`)
  console.log(unique.length ? 'FAIL' : 'PASS')
  process.exit(unique.length ? 1 : 0)
}

// ---- the rules, kept here on their own so a mistake in src/print/ cannot pass itself ----

const PT_PER_MM = 72 / 25.4
const MM_PER_PX = 25.4 / 96

/** Independent copy of src/print/presets.ts. plans/research-print.md gives the source for each. */
const TABLE = {
  'poster-a3': { format: 'poster', w: 297, h: 420, bleed: 3, safe: 8, dpi: 300, pngDpi: 300 },
  'poster-a2': { format: 'poster', w: 420, h: 594, bleed: 3, safe: 10, dpi: 200, pngDpi: 200 },
  'poster-a1': { format: 'poster', w: 594, h: 841, bleed: 3, safe: 12, dpi: 150, pngDpi: 150 },
  'poster-50x70': { format: 'poster', w: 500, h: 700, bleed: 3, safe: 12, dpi: 150, pngDpi: 150 },
  'rollup-80x200': { format: 'rollup', w: 800, h: 2000, bleed: 3, safe: 30, dpi: 150, pngDpi: 100, hidden: 150, top: 10 },
  'rollup-60x160': { format: 'rollup', w: 600, h: 1600, bleed: 3, safe: 25, dpi: 150, pngDpi: 100, hidden: 150, top: 10 },
  'rollup-85x200': { format: 'rollup', w: 850, h: 2000, bleed: 3, safe: 30, dpi: 150, pngDpi: 100, hidden: 150, top: 10 },
  'trifold-a4': { format: 'trifold', w: 297, h: 210, bleed: 3, safe: 5, dpi: 300, pngDpi: 300 },
  'long-1080': { format: 'long', px: 1080 },
  'long-750': { format: 'long', px: 750 },
}
const FOLDS = { outside: [97, 197], inside: [100, 200] }
const FOLD_CLEAR_MM = 4
const SLUG_MM = 8
const CJK_FACTOR = 1.54
const ARCMIN = 16
const arcminMm = (m) => 2 * m * 1000 * Math.tan(((ARCMIN / 60) * Math.PI) / 360)
/** 2010 ADA Standards, Table 703.5.5: height of an uppercase "I" in mm. */
function adaMm(distanceMm, baselineMm) {
  const per = (over) => (Math.max(0, over) / 305) * 3.2
  if (baselineMm <= 1780) return distanceMm < 1830 ? 16 : 16 + per(distanceMm - 1830)
  if (baselineMm <= 3050) return distanceMm < 4570 ? 51 : 51 + per(distanceMm - 4570)
  return distanceMm < 6400 ? 75 : 75 + per(distanceMm - 6400)
}
const HAND = { read: 9, fine: 7 } // pt. Print-trade floors for a piece held in the hand.
const PHONE = { read: 11, fine: 8 } // CSS px on a 390 px phone, the same as social cards.
const CONTRAST = 4.5 // WCAG 2.2 SC 1.4.3
const CONTRAST_LARGE = 3
const WECHAT_MAX_H = 3000
const WECHAT_MAX_PIXELS = 6_000_000
const XHS = { w: 1080, h: 1440, max: 18 }
const PDF_MAX_MM = 5080 // 200 inches, the page limit in Acrobat
const SYSTEM_OK = /OTS-derived|geist|instrument|anton|jakarta|silkscreen/i

const run = (cmd, a) => spawnSync(cmd, a, { encoding: 'utf8', maxBuffer: 1 << 28 })
const tool = (cmd) => run(cmd, ['-v']).error == null
const missing = ['pdfinfo', 'pdffonts', 'pdfimages', 'pdftotext', 'pdftoppm'].filter((t) => !tool(t))
if (missing.length) { fail(`poppler tools not found: ${missing.join(', ')}. Install poppler-utils: the PDF cannot be verified without them.`); finish() }

// ---- build and export ----

const browser = await launch()
let res
try {
  if (!args.includes('--no-build')) buildItem(name)
  if (!existsSync(htmlPath(name))) throw new Error(`not built: ${htmlPath(name)}`)
  res = await exportItem(browser, name)
} catch (e) {
  fail(String(e.message ?? e))
  await browser.close()
  finish()
}
const def = res.def
console.log(`${name}: ${def.format}, preset ${def.preset}, ${def.format === 'long' ? `${Math.round(def.trimW / MM_PER_PX)} px wide` : `trim ${def.trimW} × ${def.trimH} mm, bleed ${def.bleed} mm`}`)

// ---- the declared numbers against the table ----

const T = TABLE[def.preset]
if (!T) fail(`preset "${def.preset}" is not in the QA table. Add it to scripts/print-qa.mjs with its source.`)
else if (T.format !== def.format) fail(`preset ${def.preset} is a ${T.format} size, the item says ${def.format}`)
else if (def.format === 'long') {
  if (Math.abs(def.trimW / MM_PER_PX - T.px) > 0.01) fail(`long image width ${def.trimW / MM_PER_PX} px, the preset says ${T.px}`)
} else {
  const hidden = def.hiddenBottom
  const top = def.topBar
  if (def.format === 'rollup') {
    if (hidden < 40) fail(`roll-up hides ${hidden} mm at the bottom. The smallest value found is 40 mm (PrintSimple); most templates use 100 to 150 mm. Ask your printer and set hiddenBottomMm.`)
    if (def.trimW !== T.w || def.visibleH !== T.h) fail(`visible area ${def.trimW} × ${def.visibleH} mm, preset ${def.preset} says ${T.w} × ${T.h} mm`)
    if (def.trimH !== T.h + hidden + top) fail(`trim height ${def.trimH} mm is not visible ${T.h} + hidden ${hidden} + top bar ${top} mm`)
  } else if (def.trimW !== T.w || def.trimH !== T.h) fail(`trim ${def.trimW} × ${def.trimH} mm, preset ${def.preset} says ${T.w} × ${T.h} mm`)
  if (def.bleed !== T.bleed) fail(`bleed ${def.bleed} mm, preset ${def.preset} says ${T.bleed} mm`)
  if (def.safe !== T.safe) fail(`safe margin ${def.safe} mm, preset ${def.preset} says ${T.safe} mm`)
  if (def.format === 'trifold') {
    if (def.pages[0].folds.join() !== FOLDS.outside.join() || def.pages[1].folds.join() !== FOLDS.inside.join()) fail(`fold lines ${JSON.stringify(def.pages.map((p) => p.folds))}, expected outside ${FOLDS.outside}, inside ${FOLDS.inside}`)
  }
}
if (def.format !== 'long' && def.dpi < (T?.dpi ?? 0)) fail(`targetDpi ${def.dpi} is below the preset's ${T.dpi}`)

/** Floors in mm of glyph height, or points for the hand and px for the phone. */
const floorsFor = () => {
  if (def.format === 'trifold') return { kind: 'hand' }
  if (def.format === 'long') return { kind: 'phone' }
  const V = def.viewing
  const distance = V.distanceM * 1000
  return { kind: 'standing', distance, baseline: (V.baselineM ?? 1.4) * 1000, read: arcminMm(V.readM ?? 1.5), fine: arcminMm(V.nearM ?? 0.8), V }
}
const floors = floorsFor()
if (floors.kind === 'standing') {
  const ada = adaMm(floors.distance, floors.baseline)
  console.log(`rule: headline ADA 2010 Table 703.5.5 at ${def.viewing.distanceM} m: Latin ≥ ${ada.toFixed(1)} mm, Chinese ≥ ${(ada * CJK_FACTOR).toFixed(1)} mm${def.format === 'rollup' ? ' (roll-up: measured from each headline\'s real height above the floor)' : ''}; text ${ARCMIN} arcmin at ${def.viewing.readM ?? 1.5} m ≥ ${floors.read.toFixed(1)} mm; small print ${ARCMIN} arcmin at ${def.viewing.nearM ?? 0.8} m ≥ ${floors.fine.toFixed(1)} mm`)
} else if (floors.kind === 'hand') {
  console.log(`rule: held in the hand: text ≥ ${HAND.read} pt, small print ≥ ${HAND.fine} pt; clear of each fold by ${FOLD_CLEAR_MM} mm`)
} else {
  console.log(`rule: read full screen on a 390 px phone: text ≥ ${PHONE.read} px, small print ≥ ${PHONE.fine} px there`)
}

// ---- page audit ----

const seen = { page: new Set(), console: new Set(), network: new Set() }
const watch = (page) => {
  for (const k of ['page', 'console', 'network']) for (const v of page.printSeen[k]) seen[k].add(v)
}

const inPage = (ctx) => {
  const { def, foldClear } = ctx
  const out = { problems: [], texts: [], tiers: {}, heads: 0, sampleOnAll: true, pageCount: 0, emoji: 0, images: [], sections: [], gaps: [] }
  const MM = 25.4 / 96
  const canvas = document.createElement('canvas').getContext('2d')
  const label = (s) => s.replace(/\s+/g, ' ').trim().slice(0, 28)
  for (const m of document.querySelectorAll('[data-missing-part]')) out.problems.push(`kit part "${m.getAttribute('data-missing-part')}" not found in its template. Check the selector.`)
  for (const m of document.querySelectorAll('.pr-kit')) if (m.getBoundingClientRect().height < 4 && !m.hasAttribute('data-missing-part')) out.problems.push(`kit part "${m.dataset.label}" rendered empty`)
  const pages = [...document.querySelectorAll('.pr-page')]
  out.pageCount = pages.length
  pages.forEach((page, pageIndex) => {
    const side = page.dataset.side
    const trim = (page.querySelector('.pr-trim') ?? page).getBoundingClientRect()
    const pageGeom = def.pages[pageIndex]
    const toMm = (r) => ({ left: (r.left - trim.left) * MM, right: (r.right - trim.left) * MM, top: (r.top - trim.top) * MM, bottom: (r.bottom - trim.top) * MM })
    const safe = def.format === 'long'
      ? { left: 8 * (def.trimW / 285.75), right: def.trimW - 8 * (def.trimW / 285.75), top: -1e9, bottom: 1e9 }
      : { left: def.inset.left, right: def.trimW - def.inset.right, top: def.inset.top, bottom: def.trimH - def.inset.bottom }
    const nodes = []
    const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT)
    for (let t = walker.nextNode(); t; t = walker.nextNode()) {
      const text = t.textContent.trim()
      if (!text) continue
      const el = t.parentElement
      if (el.closest('.pr-marks, .pr-guides, .pr-bleed')) continue
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none') continue
      const range = document.createRange()
      range.selectNodeContents(t)
      const isSvg = el instanceof SVGElement
      const k = isSvg && el.getScreenCTM ? Math.abs(el.getScreenCTM().a) : 1
      const em = parseFloat(cs.fontSize) * k
      const rects = [...range.getClientRects()].filter((r) => r.width > 0.5 && r.height > 0.5).map((r) => {
        const mid = (r.top + r.bottom) / 2
        return { left: r.left, right: r.right, top: mid - em / 2, bottom: mid + em / 2, x: r.left, y: mid - em / 2, w: r.width, h: em }
      })
      if (!rects.length) continue
      let opacity = 1
      for (let a = el; a && a.nodeType === 1; a = a.parentElement) opacity *= parseFloat(getComputedStyle(a).opacity)
      if (opacity < 0.01) continue
      nodes.push({ t, el, cs, text, rects, em, k, opacity, isSvg, tier: el.closest('[data-tier]')?.dataset.tier ?? 'read', kit: el.closest('.pr-kit') })
    }
    for (const n of nodes) {
      const name = label(n.text)
      const hasCjk = /[㐀-鿿豈-﫿]/.test(n.text)
      canvas.font = `${n.cs.fontStyle} ${n.cs.fontWeight} ${parseFloat(n.cs.fontSize)}px ${n.cs.fontFamily}`
      const m = canvas.measureText(hasCjk ? '国' : 'I')
      const glyphMm = (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) * n.k * MM
      const pt = (n.em * MM * 72) / 25.4
      const floorRect = n.rects.reduce((a, b) => (b.bottom > a.bottom ? b : a))
      const baselineMm = (trim.top + (def.topBar + def.visibleH) / MM - floorRect.bottom) * -1 * -MM
      const item = { name, side, tier: n.tier, hasCjk, glyphMm, pt, em: n.em, baselineMm, kit: n.kit?.dataset.label ?? null, clipped: n.cs.webkitBackgroundClip === 'text' || n.cs.backgroundClip === 'text' }
      out.texts.push(item)
      if (n.tier === 'head') out.heads += 1
      for (const r of n.rects) {
        const q = toMm(r)
        if (def.format !== 'long') {
          if (q.left < -0.5 || q.right > def.trimW + 0.5 || q.top < -0.5 || q.bottom > def.trimH + 0.5) out.problems.push(`${side}: text runs off the trim: "${name}"`)
          else if (q.left < safe.left - 0.3 || q.right > safe.right + 0.3 || q.top < safe.top - 0.3 || q.bottom > safe.bottom + 0.3) out.problems.push(`${side}: text outside the safe zone (${def.safe} mm inside the trim${def.hiddenBottom ? ', above the cassette and below the top bar' : ''}): "${name}"`)
          if (def.hiddenBottom && q.bottom > def.topBar + def.visibleH + 0.3) out.problems.push(`${side}: text in the hidden bottom ${def.hiddenBottom} mm, which rolls into the cassette: "${name}"`)
          if (def.topBar && q.top < def.topBar - 0.3) out.problems.push(`${side}: text behind the top bar: "${name}"`)
        } else if (q.left < safe.left - 0.3 || q.right > safe.right + 0.3) out.problems.push(`text closer than ${(8 * def.trimW / 285.75).toFixed(0)} mm to the side of the image: "${name}"`)
        for (const f of pageGeom?.folds ?? []) {
          if (q.left < f + foldClear - 0.2 && q.right > f - foldClear + 0.2) {
            const across = q.left < f && q.right > f
            out.problems.push(`${side}: ${across ? 'text crosses' : `text within ${foldClear} mm of`} the fold at ${f} mm: "${name}"`)
          }
        }
      }
      // A kit part is not clipped, so text that does not fit in it would land on what comes next.
      if (n.kit) {
        const box = n.kit.getBoundingClientRect()
        if (n.rects.some((r) => (r.top + r.bottom) / 2 > box.bottom + 1 || (r.top + r.bottom) / 2 < box.top - 1)) out.problems.push(`${side}: text falls outside kit part "${n.kit.dataset.label}": "${name}". Give the template a taller canvas (dh) or cut content.`)
      }
      // Clipped by a box it should fit in.
      for (let a = n.el.parentElement; a && a !== page; a = a.parentElement) {
        const o = getComputedStyle(a)
        if (o.overflowX === 'visible' && o.overflowY === 'visible') continue
        if (a.classList.contains('stage') || a.classList.contains('slide') || a.classList.contains('slide-frame')) continue
        const box = a.getBoundingClientRect()
        if (n.rects.some((r) => r.right > box.right + 1.5 || r.left < box.left - 1.5 || (r.bottom + r.top) / 2 > box.bottom || (r.bottom + r.top) / 2 < box.top)) {
          out.problems.push(`${side}: text cut off by its box (${(a.className.baseVal ?? a.className).toString().split(' ')[0]}${n.kit ? ` in kit part "${n.kit.dataset.label}"` : ''}): "${name}"`)
          break
        }
      }
      out.textsForContrast ??= []
      const fg = n.isSvg ? n.cs.fill : (n.cs.webkitTextFillColor && n.cs.webkitTextFillColor !== n.cs.color ? n.cs.webkitTextFillColor : n.cs.color)
      if (!item.clipped) out.textsForContrast.push({ text: name, side, color: fg, opacity: n.opacity, large: n.tier === 'head' || pt >= 18 || (pt >= 14 && parseInt(n.cs.fontWeight, 10) >= 700), rects: n.rects.slice(0, 8).map((r) => ({ x: r.x + scrollX, y: r.y + scrollY, w: r.w, h: r.h })) })
    }
    // Text on top of other text.
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]
        const b = nodes[j]
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue
        const min = Math.min(a.em, b.em)
        const hit = a.rects.some((p) => b.rects.some((q) => Math.min(p.right, q.right) - Math.max(p.left, q.left) > min * 0.12 && Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top) > min * 0.28))
        if (hit) out.problems.push(`${side}: text overlaps text: "${label(a.text).slice(0, 18)}" and "${label(b.text).slice(0, 18)}"`)
      }
    }
    // Blocks that must not collide, cross a fold, or leave the live area.
    const keeps = [...page.querySelectorAll('[data-keep]')].map((el) => ({ el, r: el.getBoundingClientRect(), name: el.dataset.keep }))
    for (const k of keeps) {
      const q = toMm(k.r)
      if (def.format !== 'long') {
        if (q.left < safe.left - 0.3 || q.right > safe.right + 0.3 || q.top < safe.top - 0.3 || q.bottom > safe.bottom + 0.3) out.problems.push(`${side}: block "${k.name}" leaves the safe zone (${q.left.toFixed(0)}–${q.right.toFixed(0)} × ${q.top.toFixed(0)}–${q.bottom.toFixed(0)} mm)`)
        if (def.hiddenBottom && q.bottom > def.topBar + def.visibleH + 0.3) out.problems.push(`${side}: block "${k.name}" reaches the hidden bottom ${def.hiddenBottom} mm`)
      }
      for (const f of pageGeom?.folds ?? []) if (q.left < f + foldClear - 0.2 && q.right > f - foldClear + 0.2) out.problems.push(`${side}: block "${k.name}" ${q.left < f && q.right > f ? 'crosses' : 'sits too close to'} the fold at ${f} mm`)
    }
    for (let i = 0; i < keeps.length; i++) {
      for (let j = i + 1; j < keeps.length; j++) {
        const a = keeps[i]
        const b = keeps[j]
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue
        if (Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left) > 2 && Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top) > 2) out.problems.push(`${side}: blocks overlap: "${a.name}" and "${b.name}"`)
      }
    }
    for (const n of nodes) {
      if (n.kit) continue
      for (const k of keeps) {
        if (k.el.contains(n.el)) continue
        if (n.rects.some((r) => Math.min(r.right, k.r.right) - Math.max(r.left, k.r.left) > 2 && Math.min(r.bottom, k.r.bottom) - Math.max(r.top, k.r.top) > n.em * 0.3)) out.problems.push(`${side}: text "${label(n.text).slice(0, 18)}" overlaps block "${k.name}"`)
      }
    }
    // Overflow: what is laid out against what the box can hold.
    for (const box of page.querySelectorAll('.pr-live, .pr-panelin')) {
      const cs = getComputedStyle(box)
      const end = box.getBoundingClientRect().bottom - parseFloat(cs.paddingBottom)
      const right = box.getBoundingClientRect().right - parseFloat(cs.paddingRight)
      const kids = [...box.children].filter((c) => !c.classList.contains('pr-bleed'))
      const over = Math.max(...kids.map((c) => c.getBoundingClientRect().bottom), -1e9) - end
      const wide = Math.max(...kids.map((c) => c.getBoundingClientRect().right), -1e9) - right
      const where = box.closest('[data-panel]')?.dataset.panel ?? 'live area'
      if (over > 1) out.problems.push(`${side}, ${where}: content is ${(over * MM).toFixed(1)} mm too tall. Cut content or split it; text does not shrink.`)
      if (wide > 1) out.problems.push(`${side}, ${where}: content is ${(wide * MM).toFixed(1)} mm too wide.`)
      // Everything nested counts too: a Stack with fixed space can hide an overflow from the check above.
      const lowest = Math.max(...[...box.querySelectorAll('[data-keep], [data-tier]')].filter((c) => !c.closest('.pr-bleed')).map((c) => c.getBoundingClientRect().bottom), -1e9)
      if (lowest - end > 1) out.problems.push(`${side}, ${where}: content reaches ${((lowest - end) * MM).toFixed(1)} mm past the live area`)
      const gap = (end - lowest) * MM
      if (!box.querySelector('.pr-bleed')) out.gaps.push({ side, where, gap, height: (end - box.getBoundingClientRect().top - parseFloat(cs.paddingTop)) * MM })
    }
    if (ctx.needSample && !page.querySelector('[data-sample]')) out.sampleOnAll = false
    const digits = nodes.some((n) => !n.el.closest('[data-source]') && /\d/.test(n.text))
    if (def.format !== 'long' && digits && !page.querySelector('[data-source]')?.textContent.trim()) out.problems.push(`${side}: this side has numbers and no source (use <Sources>). If you cannot source a fact, leave it out.`)
  })
  // Long image: each section stands alone once it is sliced.
  for (const s of document.querySelectorAll('.pr-sec')) {
    const r = s.getBoundingClientRect()
    const rects = []
    const walker = document.createTreeWalker(s, NodeFilter.SHOW_TEXT)
    let digits = false
    for (let t = walker.nextNode(); t; t = walker.nextNode()) if (/\d/.test(t.textContent) && !t.parentElement.closest('[data-source]') && getComputedStyle(t.parentElement).visibility !== 'hidden') digits = true
    if (digits && !s.querySelector('[data-source]')?.textContent.trim()) out.problems.push(`section "${s.dataset.sec}" has numbers and no source. Slices get posted alone, so each section carries its own.`)
    if (ctx.needSample && !s.querySelector('[data-sample]')) out.sampleOnAll = false
    out.sections.push({ id: s.dataset.sec, top: r.top + scrollY, h: r.height })
    void rects
  }
  out.emoji = document.querySelectorAll('img.em').length
  for (const img of document.querySelectorAll('img')) {
    if (img.classList.contains('em') && img.naturalWidth > 0) continue
    const r = img.getBoundingClientRect()
    if (getComputedStyle(img).visibility === 'hidden') continue
    if (!img.complete || img.naturalWidth === 0) out.problems.push('an image failed to load')
    else out.images.push({ w: img.naturalWidth, h: img.naturalHeight, mmW: r.width * MM, src: img.currentSrc.slice(0, 40), decor: !!img.closest('.pr-bleed') })
  }
  return out
}

step('layout, safe zone, folds, sizes')
const auditMode = def.format === 'long' ? 'export=1' : 'mode=bleed&export=1'
const viewW = def.format === 'long' ? Math.ceil(def.trimW / MM_PER_PX) : Math.ceil((def.trimW + 2 * def.bleed) / MM_PER_PX)
const viewH = def.format === 'long' ? 1400 : Math.ceil((def.trimH + 2 * def.bleed) / MM_PER_PX)
const page = await openItem(browser, name, auditMode, { width: viewW, height: viewH })
// A number caught mid-animation prints wrong and still looks right, so the page has to be at rest before anything else is read.
const pageText = () => page.evaluate(() => document.body.innerText)
const firstRead = await pageText()
const missingChars = missingCjk(firstRead)
await page.waitForTimeout(2500)
if (firstRead !== await pageText()) fail('text is still changing after the page is ready: an animation ignores reduced motion, so the PDF would freeze it part way')
const audit = await page.evaluate(inPage, { def, foldClear: FOLD_CLEAR_MM, needSample: !!def.sample })
audit.problems.forEach(fail)
if (audit.pageCount !== def.pages.length && def.format !== 'long') fail(`${audit.pageCount} pages rendered, this format has ${def.pages.length}`)
if (def.sample && !audit.sampleOnAll) fail('sample content: the sample label is missing from a page or section')
if ((def.format === 'poster' || def.format === 'rollup') && !audit.heads) fail('no headline: this format needs at least one text at tier "head", to be read from the declared distance')

// ---- text sizes ----

const smallest = {}
const keepSmall = (key, value, t) => { if (!smallest[key] || value < smallest[key].value) smallest[key] = { value, text: t.name } }
for (const t of audit.texts) {
  const where = `${t.side}${t.kit ? `, kit part "${t.kit}"` : ''}`
  if (floors.kind === 'standing') {
    const factor = t.hasCjk ? CJK_FACTOR : 1
    let need
    let why
    if (t.tier === 'head') {
      const base = def.format === 'rollup' ? Math.max(0, t.baselineMm) : floors.baseline
      need = adaMm(floors.distance, base) * factor
      why = `ADA Table 703.5.5${t.hasCjk ? ` × ${CJK_FACTOR} for Chinese` : ''} at ${def.viewing.distanceM} m, baseline ${(base / 1000).toFixed(2)} m above the floor`
    } else if (t.tier === 'fine') {
      need = floors.fine / (t.hasCjk ? 1 : CJK_FACTOR)
      why = `${ARCMIN} arcmin at ${def.viewing.nearM ?? 0.8} m`
    } else {
      need = floors.read / (t.hasCjk ? 1 : CJK_FACTOR)
      why = `${ARCMIN} arcmin at ${def.viewing.readM ?? 1.5} m`
    }
    keepSmall(`${t.tier}${t.hasCjk ? ' CJK' : ' Latin'}`, t.glyphMm, t)
    if (t.glyphMm + 0.05 < need) fail(`${where}: "${t.name}" (tier ${t.tier}) is ${t.glyphMm.toFixed(1)} mm tall, under ${need.toFixed(1)} mm (${why}). Cut words or give it more room; text never shrinks to fit.`)
  } else if (floors.kind === 'hand') {
    const floor = t.tier === 'fine' ? HAND.fine : HAND.read
    keepSmall(t.tier === 'fine' ? 'fine' : 'read', t.pt, t)
    if (t.pt + 0.05 < floor) fail(`${where}: "${t.name}" is ${t.pt.toFixed(1)} pt, under the ${floor} pt floor for ${t.tier === 'fine' ? 'small print' : 'text'} held in the hand`)
  } else {
    const phone = t.em * (390 / (def.trimW / MM_PER_PX))
    const floor = t.tier === 'fine' ? PHONE.fine : PHONE.read
    keepSmall(t.tier === 'fine' ? 'fine' : 'read', phone, t)
    if (phone + 0.05 < floor) fail(`${where}: "${t.name}" is ${phone.toFixed(1)} px on a 390 px phone (${t.em.toFixed(0)} px in the file), under ${floor} px`)
  }
}
const unit = floors.kind === 'standing' ? 'mm' : floors.kind === 'hand' ? 'pt' : 'px on a phone'
console.log(`smallest text: ${Object.entries(smallest).map(([k, v]) => `${k} ${v.value.toFixed(1)} ${unit} ("${v.text.slice(0, 12)}")`).join('; ')}`)

// ---- system-font fallback ----

{
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('DOM.enable')
  await cdp.send('CSS.enable')
  await page.evaluate(() => {
    const walker = document.createTreeWalker(document.querySelector('#root'), NodeFilter.SHOW_TEXT)
    for (let t = walker.nextNode(); t; t = walker.nextNode()) if (t.textContent.trim() && t.parentElement && !t.parentElement.closest('.pr-marks') && getComputedStyle(t.parentElement).visibility !== 'hidden') t.parentElement.setAttribute('data-qatext', '')
  })
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 })
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: '[data-qatext]' })
  const stray = new Set()
  for (const nodeId of nodeIds.slice(0, 800)) {
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId })
    for (const f of fonts) if (!f.isCustomFont) stray.add(f.familyName)
  }
  await cdp.detach()
  if (stray.size) {
    const chars = missingChars.length ? ` Missing from the committed subsets: ${missingChars.join(' ')}.` : ''
    warn(`text is falling back to a system font (${[...stray].join(', ')}): a glyph is missing from the embedded subset.${chars} The print still renders; maintainers can add the characters with npm run fonts (Python, fonttools, Noto CJK sources).`)
  }
}

// ---- contrast against real pixels, with the text hidden ----

step('contrast')
{
  const pixel = await browser.newPage()
  await pixel.setContent('<!doctype html><title>pixels</title>')
  await pixel.evaluate(() => {
    const lin = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 }
    const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
    const toRgba = (css) => {
      const c = new OffscreenCanvas(1, 1).getContext('2d')
      c.fillStyle = css
      c.fillRect(0, 0, 1, 1)
      return [...c.getImageData(0, 0, 1, 1).data]
    }
    window.contrast = async (b64, items, scale) => {
      const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob())
      const c = new OffscreenCanvas(bmp.width, bmp.height)
      const x = c.getContext('2d', { willReadFrequently: true })
      x.drawImage(bmp, 0, 0)
      return items.map((it) => {
        const [r, g, b, A] = toRgba(it.color)
        const a = (A / 255) * it.opacity
        let worst = 99
        for (const q of it.rects) {
          const px = Math.max(0, Math.floor(q.x * scale))
          const py = Math.max(0, Math.floor(q.y * scale))
          const w = Math.min(bmp.width - px, Math.max(1, Math.floor(q.w * scale)))
          const h = Math.min(bmp.height - py, Math.max(1, Math.floor(q.h * scale)))
          if (w <= 0 || h <= 0) continue
          const data = x.getImageData(px, py, w, h).data
          const lums = []
          const step = Math.max(1, Math.floor((w * h) / 4000))
          for (let i = 0; i < data.length; i += 4 * step) lums.push(lum(data[i], data[i + 1], data[i + 2]))
          lums.sort((p, n) => p - n)
          for (const bg of [lums[Math.floor(lums.length * 0.02)], lums[Math.floor(lums.length * 0.98)]]) {
            const fg = lum(r, g, b) * a + bg * (1 - a)
            worst = Math.min(worst, (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05))
          }
        }
        return worst
      })
    }
  })
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('.pr-page *')) {
      const cs = getComputedStyle(el)
      if (cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text') el.style.visibility = 'hidden'
    }
  })
  // The strike through a refuted claim is drawn as the text's own background: it is not what the text is read against.
  await page.addStyleTag({ content: '.pr-page *{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}.pr-page svg text{fill:transparent!important;stroke:transparent!important}.pr-page img.em{visibility:hidden!important}.claim.is-false .claim__text span{background-image:none!important}' })
  await page.waitForTimeout(80)
  // A huge page is read at a lower scale. The check is about colour, not edges.
  const fullH = await page.evaluate(() => document.documentElement.scrollHeight)
  const png = (await page.screenshot({ type: 'png', fullPage: true })).toString('base64')
  const items = audit.textsForContrast ?? []
  const ratios = await pixel.evaluate(([b, it, s]) => window.contrast(b, it, s), [png, items, 1])
  let lowest = 99
  ratios.forEach((r, i) => {
    lowest = Math.min(lowest, r)
    const min = items[i].large ? CONTRAST_LARGE : CONTRAST
    if (r < min) fail(`${items[i].side}: contrast ${r.toFixed(2)}:1 on "${items[i].text}", under ${min}:1 (WCAG 2.2 SC 1.4.3${items[i].large ? ', large text' : ''})`)
  })
  console.log(`lowest contrast ${lowest.toFixed(1)}:1 across ${items.length} text runs`)
  await pixel.close()
  void fullH
}
watch(page)
await page.close()

// ---- guide images, for a person to look at ----

step('guide images')
if (def.format !== 'long') {
  const g = await openItem(browser, name, 'mode=bleed&export=1&guides=1', { width: viewW, height: viewH, scale: Math.min(1, 1600 / viewH) })
  for (const [i, el] of (await g.locator('.pr-page').all()).entries()) await el.screenshot({ path: join(OUT, `guides-${def.pages[i].id}.png`) })
  watch(g)
  await g.close()
}

// ---- the PDFs ----

step('PDF boxes, fonts, resolution, marks and bleed')
const off = def.bleed + def.slug
const boxesOf = (file) => {
  const info = run('pdfinfo', ['-box', '-f', '1', '-l', '999', file]).stdout
  const pages = Number(info.match(/Pages:\s+(\d+)/)?.[1])
  const read = (nameRe) => [...info.matchAll(new RegExp(`Page\\s+\\d+\\s+${nameRe}:\\s+([\\d.-]+)\\s+([\\d.-]+)\\s+([\\d.-]+)\\s+([\\d.-]+)`, 'g'))].map((m) => m.slice(1, 5).map(Number))
  return { pages, media: read('MediaBox'), trim: read('TrimBox'), bleed: read('BleedBox') }
}
const close = (a, b, tol = 0.02) => Math.abs(a - b) <= tol
const size = (b) => [b[2] - b[0], b[3] - b[1]]
const fmtMm = (pt) => (pt / PT_PER_MM).toFixed(3)

function checkPdf(label, file, expect) {
  if (!existsSync(file)) { fail(`${label} PDF was not written: ${file}`); return }
  const bx = boxesOf(file)
  if (bx.pages !== expect.pages) fail(`${label} PDF has ${bx.pages} pages, expected ${expect.pages}`)
  bx.media.forEach((m, i) => {
    const [w, h] = size(m)
    if (!close(w, expect.w * PT_PER_MM) || !close(h, expect.h * PT_PER_MM)) fail(`${label} PDF page ${i + 1} is ${fmtMm(w)} × ${fmtMm(h)} mm, it must be exactly ${expect.w} × ${expect.h} mm (${expect.why})`)
    const t = bx.trim[i]
    if (expect.trimAt) {
      const [tw, th] = size(t)
      const dx = (t[0] - m[0]) / PT_PER_MM
      const dy = (m[3] - t[3]) / PT_PER_MM
      if (!close(tw, expect.trimW * PT_PER_MM) || !close(th, expect.trimH * PT_PER_MM) || !close(dx, expect.trimAt, 0.01) || !close(dy, expect.trimAt, 0.01)) fail(`${label} PDF page ${i + 1}: TrimBox is ${fmtMm(tw)} × ${fmtMm(th)} mm at ${dx.toFixed(3)}, ${dy.toFixed(3)} mm, expected ${expect.trimW} × ${expect.trimH} mm at ${expect.trimAt} mm`)
    }
    if (expect.bleedW) {
      const b = bx.bleed[i]
      const [bw, bh] = size(b)
      if (!close(bw, expect.bleedW * PT_PER_MM) || !close(bh, expect.bleedH * PT_PER_MM)) fail(`${label} PDF page ${i + 1}: BleedBox is ${fmtMm(bw)} × ${fmtMm(bh)} mm, expected ${expect.bleedW} × ${expect.bleedH} mm (trim + bleed)`)
    }
  })
  // Fonts: all embedded, none a system fallback.
  const fonts = run('pdffonts', [file]).stdout.split('\n').slice(2).filter((l) => l.trim())
  for (const l of fonts) {
    const m = l.match(/^(\S+)\s+(.+?)\s+(\S+)\s+(yes|no)\s+(yes|no)\s+(yes|no)\s+\d+\s+\d+\s*$/)
    if (!m) continue
    if (m[4] !== 'yes') fail(`${label} PDF: font ${m[1]} is not embedded. A print shop would substitute it.`)
    if (!SYSTEM_OK.test(m[1])) {
      const chars = missingChars.length ? ` Missing from the committed subsets: ${missingChars.join(' ')}.` : ''
      warn(`${label} PDF: system font ${m[1]} in the file: a glyph fell back.${chars} The print still exports; maintainers can add the characters with npm run fonts.`)
    }
  }
  if (!fonts.length) notes.push(`${label} PDF: no fonts listed`)
  // Every raster at the resolution this piece asks for.
  const images = run('pdfimages', ['-list', file]).stdout.split('\n').slice(2).filter((l) => l.trim())
  let rasters = 0
  for (const l of images) {
    const p = l.trim().split(/\s+/)
    if (p[2] !== 'image') continue
    rasters += 1
    const ppi = Math.min(Number(p[12]), Number(p[13]))
    if (ppi + 1 < def.dpi) {
      const hint = audit.emoji && def.emojiStyle !== 'noto' && def.emojiStyle !== 'flat' ? ` This item uses ${def.emojiStyle} emoji, which Chrome rasterises: if this image is an emoji, set emojiStyle: 'noto'.` : ' Use a larger source image, or draw it as vector.'
      fail(`${label} PDF page ${p[0]}: raster ${p[3]} × ${p[4]} px at ${ppi} ppi, under the ${def.dpi} ppi this piece needs.${hint}`)
    }
  }
  if (rasters && audit.emoji && def.emojiStyle === 'fluent') notes.push(`${label} PDF: ${rasters} raster images. Fluent emoji have SVG filters, so Chrome rasterises them; noto stays vector.`)
  const allText = run('pdftotext', [file, '-']).stdout.replace(/\s+/g, '')
  const title = audit.texts.find((t) => t.tier === 'head' && !t.clipped)?.name.replace(/\s+/g, '')
  if (title && !allText.includes(title)) fail(`${label} PDF: text "${title}" cannot be extracted: it may be outlined or broken`)
  return { rasters }
}

function ppm(file, dpi, x, y, w, h, pageNo = 1) {
  const a = ['-r', String(dpi), '-f', String(pageNo), '-l', String(pageNo), '-singlefile', '-cropbox']
  if (w) a.push('-x', String(x), '-y', String(y), '-W', String(w), '-H', String(h))
  a.push(file)
  const r = spawnSync('pdftoppm', a, { maxBuffer: 1 << 30 })
  const buf = r.stdout
  if (r.status !== 0 || !buf?.length) throw new Error(`pdftoppm could not read page ${pageNo} of ${file}: ${String(r.stderr).slice(0, 200)}`)
  let i = 0
  const tok = () => {
    while (buf[i] === 0x20 || buf[i] === 0x0a) i += 1
    const s = i
    while (i < buf.length && buf[i] !== 0x20 && buf[i] !== 0x0a) i += 1
    return buf.toString('latin1', s, i)
  }
  tok()
  const W = Number(tok())
  const H = Number(tok())
  tok()
  i += 1
  const at = (px, py) => { const o = i + (py * W + px) * 3; return [buf[o], buf[o + 1], buf[o + 2]] }
  return { W, H, at }
}

/** Crop marks in the raster: right place, right length, at all four corners. Proves nothing scaled the sheet. */
function checkMarks(file, pageNo) {
  const dpi = 300
  const px = (mm) => Math.round((mm / 25.4) * dpi)
  const near = def.bleed + 1
  const far = near + 5
  const W = def.trimW + 2 * off
  const H = def.trimH + 2 * off
  const spots = [
    ['top left', off, off - near, off, off - far, 'v'],
    ['top right', off + def.trimW, off - near, off + def.trimW, off - far, 'v'],
    ['bottom left', off, off + def.trimH + near, off, off + def.trimH + far, 'v'],
    ['bottom right', off + def.trimW, off + def.trimH + near, off + def.trimW, off + def.trimH + far, 'v'],
    ['top left', off - near, off, off - far, off, 'h'],
    ['bottom right', off + def.trimW + near, off + def.trimH, off + def.trimW + far, off + def.trimH, 'h'],
  ]
  for (const [where, x1, y1, x2, y2, dir] of spots) {
    const x0 = Math.min(x1, x2)
    const y0 = Math.min(y1, y2)
    const span = 1.2 // mm searched either side of the expected line
    const cx = dir === 'v' ? x0 - span : x0 + 1
    const cy = dir === 'v' ? y0 + 1 : y0 - span
    const cw = dir === 'v' ? 2 * span : Math.abs(x2 - x1) - 2
    const ch = dir === 'v' ? Math.abs(y2 - y1) - 2 : 2 * span
    if (cx < 0 || cy < 0 || cx + cw > W || cy + ch > H) continue
    const im = ppm(file, dpi, px(cx), px(cy), px(cw), px(ch), pageNo)
    // The darkest line across the search band.
    let best = 255
    let bestAt = 0
    const nA = dir === 'v' ? im.W : im.H
    const nB = dir === 'v' ? im.H : im.W
    for (let a = 0; a < nA; a++) {
      let sum = 0
      for (let b = 0; b < nB; b++) sum += dir === 'v' ? im.at(a, b)[1] : im.at(b, a)[1]
      const v = sum / nB
      if (v < best) { best = v; bestAt = a }
    }
    const found = (dir === 'v' ? cx : cy) + ((bestAt + 0.5) / dpi) * 25.4
    const want = dir === 'v' ? x0 : y0
    if (best > 200) fail(`print PDF page ${pageNo}: no crop mark at the ${where} corner (${dir === 'v' ? 'vertical' : 'horizontal'})`)
    else if (Math.abs(found - want) > 0.2) fail(`print PDF page ${pageNo}: crop mark at the ${where} corner is ${Math.abs(found - want).toFixed(2)} mm off the trim line. Something scaled the sheet.`)
  }
}

/** The art has to reach the bleed: a white outer ring around a coloured piece would show as a white edge after cutting. */
function checkBleedRing(file, pageNo) {
  const dpi = 72
  const im = ppm(file, dpi, 0, 0, 0, 0, pageNo)
  const px = (mm) => Math.round((mm / 25.4) * dpi)
  const outer = def.bleed * 0.5
  const inner = def.bleed + 1.5
  const isWhite = (c) => c[0] > 248 && c[1] > 248 && c[2] > 248
  let bad = 0
  let total = 0
  const sample = (ox, oy, ix, iy) => {
    total += 1
    if (isWhite(im.at(Math.min(im.W - 1, ox), Math.min(im.H - 1, oy))) && !isWhite(im.at(Math.min(im.W - 1, ix), Math.min(im.H - 1, iy)))) bad += 1
  }
  for (let t = 0.02; t < 1; t += 0.04) {
    const x = Math.round(t * (im.W - 1))
    const y = Math.round(t * (im.H - 1))
    sample(x, px(outer), x, px(inner))
    sample(x, im.H - 1 - px(outer), x, im.H - 1 - px(inner))
    sample(px(outer), y, px(inner), y)
    sample(im.W - 1 - px(outer), y, im.W - 1 - px(inner), y)
  }
  if (bad > total * 0.02) fail(`bleed PDF page ${pageNo}: the art stops at the trim on ${bad} of ${total} samples. Run backgrounds to the bleed (use Bleed) or a cut will show white.`)
}

if (def.format === 'long') {
  const heightPx = audit.sections.reduce((n, s) => n + s.h, 0)
  const hMm = heightPx * MM_PER_PX
  if (hMm > PDF_MAX_MM) fail(`long image PDF would be ${hMm.toFixed(0)} mm tall, past the ${PDF_MAX_MM} mm that PDF readers accept. Split it.`)
  checkPdf('long', res.pdfs.long, { pages: 1, w: def.trimW, h: Math.round(hMm * 1e4) / 1e4, why: 'the width and the image height' })
} else {
  const fh = def.format === 'rollup' ? def.visibleH : def.trimH
  const trimFacts = { trimW: def.trimW, trimH: def.trimH }
  checkPdf('print', res.pdfs.print, { pages: def.pages.length, w: def.trimW + 2 * off, h: def.trimH + 2 * off, why: `trim + bleed + ${SLUG_MM} mm for the marks`, trimAt: off, ...trimFacts, bleedW: def.trimW + 2 * def.bleed, bleedH: def.trimH + 2 * def.bleed })
  checkPdf('bleed', res.pdfs.bleed, { pages: def.pages.length, w: def.trimW + 2 * def.bleed, h: def.trimH + 2 * def.bleed, why: 'trim + bleed', trimAt: def.bleed, ...trimFacts, bleedW: def.trimW + 2 * def.bleed, bleedH: def.trimH + 2 * def.bleed })
  checkPdf('proof', res.pdfs.proof, { pages: def.pages.length, w: def.trimW, h: fh, why: def.format === 'rollup' ? 'the visible area' : 'the trim' })
  for (let p = 1; p <= def.pages.length; p++) {
    checkMarks(res.pdfs.print, p)
    checkBleedRing(res.pdfs.bleed, p)
  }
}

// ---- PNGs ----

step('images')
if (def.format === 'long') {
  const expectW = Math.round(def.trimW / MM_PER_PX)
  const full = pngSize(res.pngs[0])
  const heightPx = audit.sections.reduce((n, s) => n + s.h, 0)
  if (full.w !== expectW) fail(`full PNG is ${full.w} px wide, it must be ${expectW}`)
  if (Math.abs(full.h - heightPx) > 2) fail(`full PNG is ${full.h} px tall, the layout is ${heightPx.toFixed(0)} px`)
  // Sections against the real cut lines, read from the PNG files on disk.
  const secs = audit.sections
  const first = secs[0]?.top ?? 0
  const spans = secs.map((s) => ({ id: s.id, a: s.top - first, b: s.top - first + s.h }))
  if (res.slices.wechat) {
    let at = 0
    const lines = []
    let pixels = 0
    res.slices.wechat.forEach((s, i) => {
      const { w, h } = pngSize(s.file)
      if (w !== expectW) fail(`wechat slice ${i + 1} is ${w} px wide, it must be ${expectW}`)
      if (h > WECHAT_MAX_H) fail(`wechat slice ${i + 1} is ${h} px tall, over ${WECHAT_MAX_H} px. A single section is too long: split it.`)
      if (w * h > WECHAT_MAX_PIXELS) fail(`wechat slice ${i + 1} is ${(w * h / 1e6).toFixed(1)} megapixels, over the ${WECHAT_MAX_PIXELS / 1e6} megapixel upload limit reported for 公众号`)
      at += h
      pixels += h
      lines.push(at)
    })
    if (Math.abs(pixels - heightPx) > 2 * res.slices.wechat.length) fail(`wechat slices add up to ${pixels} px, the image is ${heightPx.toFixed(0)} px`)
    for (const l of lines.slice(0, -1)) for (const s of spans) if (l > s.a + 2 && l < s.b - 2) fail(`wechat slice line at ${l} px cuts section "${s.id}" (${s.a.toFixed(0)}–${s.b.toFixed(0)} px)`)
    console.log(`wechat slices: ${res.slices.wechat.length}, heights ${res.slices.wechat.map((s) => pngSize(s.file).h).join(', ')} px`)
  }
  if (res.slices.xhs) {
    if (expectW !== XHS.w) fail(`xhs slices need a ${XHS.w} px image, this one is ${expectW} px. Use long-1080.`)
    if (res.slices.xhs.length > XHS.max) fail(`${res.slices.xhs.length} xhs slices, a note takes ${XHS.max} at most (third-party figure). Cut sections.`)
    res.slices.xhs.forEach((s, i) => {
      const { w, h } = pngSize(s.file)
      if (w !== XHS.w || h !== XHS.h) fail(`xhs slice ${i + 1} is ${w} × ${h} px, it must be exactly ${XHS.w} × ${XHS.h}`)
      for (const id of s.ids) if (spans.find((x) => x.id === id).b - spans.find((x) => x.id === id).a > XHS.h + 1) fail(`section "${id}" is ${(spans.find((x) => x.id === id).b - spans.find((x) => x.id === id).a).toFixed(0)} px tall and cannot fit an xhs slice of ${XHS.h} px. Split it, or it will be cut.`)
      if (s.h < XHS.h * 0.62) notes.push(`xhs slice ${i + 1} carries ${s.h.toFixed(0)} px of content in ${XHS.h} px: it will look loose`)
    })
    console.log(`xhs slices: ${res.slices.xhs.length}, each ${XHS.w} × ${XHS.h} px, content ${res.slices.xhs.map((s) => Math.round(s.h)).join(', ')} px`)
  }
  for (const n of def.slices) if (!res.slices[n]?.length) fail(`${n} slices were asked for and not written`)
} else {
  const fh = def.format === 'rollup' ? def.visibleH : def.trimH
  const expW = (def.trimW / 25.4) * def.pngDpi
  const expH = (fh / 25.4) * def.pngDpi
  for (const f of res.pngs) {
    const { w, h } = pngSize(f)
    if (Math.abs(w - expW) > 1.5 || Math.abs(h - expH) > 1.5) fail(`${f.split('/').pop()} is ${w} × ${h} px, ${def.pngDpi} dpi of the finished size is ${expW.toFixed(0)} × ${expH.toFixed(0)} px`)
  }
  console.log(`PNG: ${res.pngs.map((f) => { const s = pngSize(f); return `${f.split('/').pop()} ${s.w} × ${s.h} px` }).join(', ')} at ${def.pngDpi} dpi`)
}

// ---- notes and environment ----

for (const g of audit.gaps) if (g.height > 0 && g.gap > g.height * 0.2) notes.push(`${g.side}, ${g.where}: ${g.gap.toFixed(0)} mm of empty space at the foot (${Math.round((g.gap / g.height) * 100)}% of the height). Look at it.`)
for (const i of audit.images) {
  const ppi = i.w / (i.mmW / 25.4)
  if (ppi + 1 < def.dpi) fail(`image ${i.w} px wide placed ${i.mmW.toFixed(0)} mm wide is ${ppi.toFixed(0)} ppi, under ${def.dpi} ppi. Use a larger source or place it smaller.`)
}
for (const m of seen.page) fail(`page error: ${m}`)
for (const m of seen.console) fail(`console error: ${m}`)
for (const m of seen.network) fail(`network request: ${m}. An item must open with no network.`)
const htmlBytes = statSync(htmlPath(name)).size
const html = readFileSync(htmlPath(name), 'utf8')
if (/(?:src|href)=["']https?:\/\//.test(html)) fail('the HTML references a remote file')
await browser.close()

const pdfSizes = Object.entries(res.pdfs).map(([k, f]) => `${k} ${(statSync(f).size / 1048576).toFixed(2)} MB`).join(', ')
console.log(`files: HTML ${(htmlBytes / 1048576).toFixed(1)} MB, PDF ${pdfSizes}. Colour is RGB: see docs for what the print shop has to do.`)
if (def.format !== 'long') {
  const bx = boxesOf(res.pdfs.bleed)
  const [w, h] = size(bx.media[0])
  console.log(`bleed PDF page ${fmtMm(w)} × ${fmtMm(h)} mm = trim ${def.trimW} × ${def.trimH} + ${def.bleed} mm on each side`)
}
finish({ def: { format: def.format, preset: def.preset, dpi: def.dpi }, smallest, pdfs: res.pdfs, pngs: res.pngs })
