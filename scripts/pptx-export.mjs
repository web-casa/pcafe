// Hybrid PowerPoint export: dist/<deck>.html → dist/<deck>.pptx + dist/<deck>.pptx.json
// usage: node scripts/pptx-export.mjs <deck> [--build] [--scale 2]
//
// Reads the rendered page instead of the source (the approach of oil-ppt's pptx_export.py and
// huashu-design's pptx_from_rendered.py, both MIT; this is a separate Node implementation).
// Per slide, in the #/print view with reduced motion (every reveal step shown, motion settled):
//   1. collect plain horizontal text that PowerPoint can reproduce, one box per rendered line
//      segment, so line breaks and positions come from the browser rather than from PowerPoint;
//   2. screenshot the slide with exactly those glyphs made transparent (layout unchanged) and
//      use it as the slide background; everything else (SVG/chart text, gradient text,
//      transformed text, emoji images, decoration) stays in that picture;
//   3. place native text boxes on top; raster <img> photos become separate pictures when a
//      pixel comparison proves they are cleanly separable;
//   4. speaker notes go into the PPTX notes.
// Pixel checks per slide catch the classic bug of text drawn both in the background and as a box.
import { launchChromium } from './playwright.mjs'
import PptxGenJS from 'pptxgenjs'
import JSZip from 'jszip'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = resolve(import.meta.dirname, '..')
const args = process.argv.slice(2)
const NAME = args.find((a, i) => !a.startsWith('--') && !['--scale', '--shots'].includes(args[i - 1]))
const FORCE_BUILD = args.includes('--build')
const scaleAt = args.indexOf('--scale')
const SCALE = scaleAt >= 0 ? Math.max(1, Math.min(3, Number(args[scaleAt + 1]) || 2)) : 2
const shotsAt = args.indexOf('--shots')
const SHOTS = shotsAt >= 0 ? resolve(args[shotsAt + 1]) : null
if (!NAME || !/^[a-z0-9][a-z0-9-]*$/.test(NAME)) {
  console.error('usage: node scripts/pptx-export.mjs <deck> [--build] [--scale 1|2|3] [--shots <dir>]')
  process.exit(2)
}
const HTML = join(ROOT, 'dist', `${NAME}.html`)
const OUT = join(ROOT, 'dist', `${NAME}.pptx`)
const REPORT = `${OUT}.json`
const W = 1920
const H = 1080
const PX_PER_IN = W / 13.333 // LAYOUT_WIDE: 1920 px → 13.333 in, so 1 px = 0.5 pt
const inch = (px) => +(px / PX_PER_IN).toFixed(4)
const pt = (px) => +(px * 0.5).toFixed(2)

// ── 1. Build when the single file is missing or older than the sources ─────────
function newest(dir) {
  let t = 0
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    t = Math.max(t, e.isDirectory() ? newest(p) : statSync(p).mtimeMs)
  }
  return t
}
const sourcesTime = () => Math.max(newest(join(ROOT, 'src')), ...['index.html', 'vite.config.ts'].map((f) => (existsSync(join(ROOT, f)) ? statSync(join(ROOT, f)).mtimeMs : 0)))
if (FORCE_BUILD || !existsSync(HTML) || statSync(HTML).mtimeMs < sourcesTime()) {
  console.log(`building dist/${NAME}.html first`)
  const r = spawnSync(process.execPath, [join(ROOT, 'cli', 'pcafe.mjs'), 'build', NAME], { cwd: ROOT, stdio: 'inherit' })
  if (r.status !== 0 || !existsSync(HTML)) {
    console.error('pptx: build failed.')
    process.exit(r.status || 1)
  }
}

// ── Fonts: the CSS names map to the families a viewer can install ─────────────
// Weights become the legacy family names PowerPoint shows ("Geist Medium"), except 700 = bold.
const WEIGHT_NAME = { 100: 'Thin', 200: 'ExtraLight', 300: 'Light', 500: 'Medium', 600: 'SemiBold', 800: 'ExtraBold', 900: 'Black' }
const LATIN = {
  Geist: { min: 100, max: 900 },
  'Geist Mono': { min: 100, max: 900 },
  'Plus Jakarta Sans': { min: 200, max: 800 },
  'Instrument Serif': { fixed: true, synth: true },
  Anton: { fixed: true },
  Silkscreen: { fixed: true, synth: true },
}
// The embedded CJK faces are subsets of Noto Sans SC / Noto Serif SC at one weight each.
const CJK = {
  'Deck Sans SC': (w) => (w >= 500 ? 'Noto Sans SC Medium' : 'Noto Sans SC'),
  'Deck Serif SC': () => 'Noto Serif SC SemiBold',
  'Deck Heavy SC': () => 'Noto Sans SC Black',
}
const GENERIC = { 'sans-serif': 'Arial', serif: 'Times New Roman', monospace: 'Courier New', 'system-ui': 'Arial', cursive: 'Comic Sans MS' }
const unknownFonts = new Set()

function fontsFor(stack, weight, italic) {
  const fams = stack.split(',').map((f) => f.trim().replace(/^["']|["']$/g, ''))
  const w = Math.round(weight / 100) * 100
  const cjkName = fams.find((f) => CJK[f])
  const ea = cjkName ? CJK[cjkName](w) : 'Noto Sans SC'
  let latin = null
  let bold = false
  for (const f of fams) {
    if (CJK[f]) {
      latin = CJK[f](w)
      break
    }
    const info = LATIN[f]
    if (info) {
      if (info.fixed) {
        latin = f
        bold = !!info.synth && w >= 600
      } else {
        const ww = Math.max(info.min, Math.min(info.max, w))
        latin = ww === 700 ? f : ww === 400 ? f : `${f} ${WEIGHT_NAME[ww]}`
        bold = ww === 700
      }
      break
    }
    if (GENERIC[f]) {
      latin = GENERIC[f]
      bold = w >= 600
      break
    }
    // Any other family (the style presets' display faces) is a real font name: keep it.
    if (f && !/^(-apple-system|BlinkMacSystemFont|ui-|emoji)/.test(f)) {
      unknownFonts.add(f)
      latin = w === 700 || w === 400 ? f : `${f} ${WEIGHT_NAME[w]}`
      bold = w === 700
      break
    }
  }
  return { latin: latin ?? 'Arial', ea, bold, italic, cjkBold: false }
}

// ── 2. Browser ─────────────────────────────────────────────────────────────
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

/** Runs in the page: lists text, pictures and what must stay in the background. */
function collectSlide() {
  const page = document.querySelector('.pp__page.pptx-on')
  const stage = page.querySelector(':scope > .stage')
  const S = stage.getBoundingClientRect()
  const cache = new Map()
  const cs = (el) => {
    let v = cache.get(el)
    if (!v) cache.set(el, (v = getComputedStyle(el)))
    return v
  }
  const near0 = (v) => Math.abs(v) < 1e-3
  const translateOnly = (t) => {
    if (t === 'none') return true
    try {
      const m = new DOMMatrixReadOnly(t)
      return near0(m.m11 - 1) && near0(m.m12) && near0(m.m21) && near0(m.m22 - 1) && (m.is2D || (near0(m.m13) && near0(m.m23) && near0(m.m31) && near0(m.m32) && near0(m.m33 - 1) && near0(m.m14) && near0(m.m24) && near0(m.m34) && near0(m.m44 - 1)))
    } catch {
      return false
    }
  }
  const noneOr = (v, ok) => v === 'none' || v === ok
  // Reasons inherited from an element or any ancestor inside the stage.
  const chainMemo = new Map()
  function chainReason(el) {
    if (!el || el === page) return null
    if (chainMemo.has(el)) return chainMemo.get(el)
    const s = cs(el)
    let r = null
    if (el instanceof SVGElement) r = 'svg-text'
    else if (!translateOnly(s.transform) || !noneOr(s.rotate, '0deg') || !noneOr(s.scale, '1')) r = 'transformed'
    else if (s.filter !== 'none') r = 'filter'
    else if ((s.maskImage && s.maskImage !== 'none') || (s.webkitMaskImage && s.webkitMaskImage !== 'none')) r = 'masked'
    else if (s.clipPath !== 'none') r = 'clip-path'
    else if (s.mixBlendMode !== 'normal') r = 'blend-mode'
    else if (s.textDecorationLine !== 'none') r = 'text-decoration'
    else if (s.writingMode !== 'horizontal-tb') r = 'vertical-text'
    else if (s.webkitLineClamp && s.webkitLineClamp !== 'none') r = 'line-clamp'
    else if (s.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1) r = 'ellipsis'
    if (!r) r = chainReason(el.parentElement)
    chainMemo.set(el, r)
    return r
  }
  const opacityMemo = new Map()
  function opacityOf(el) {
    if (!el || el === page) return 1
    if (opacityMemo.has(el)) return opacityMemo.get(el)
    const v = Number(cs(el).opacity) * opacityOf(el.parentElement)
    opacityMemo.set(el, v)
    return v
  }
  const clipMemo = new Map()
  /** The visible region left by overflow clipping, in viewport px. */
  function clipOf(el) {
    if (!el || el === page) return { l: S.left, t: S.top, r: S.right, b: S.bottom }
    if (clipMemo.has(el)) return clipMemo.get(el)
    let c = clipOf(el.parentElement)
    const s = cs(el)
    if (s.overflowX !== 'visible' || s.overflowY !== 'visible' || el === stage) {
      const b = el.getBoundingClientRect()
      const l = b.left + el.clientLeft
      const t = b.top + el.clientTop
      c = {
        l: s.overflowX !== 'visible' ? Math.max(c.l, l) : c.l,
        t: s.overflowY !== 'visible' ? Math.max(c.t, t) : c.t,
        r: s.overflowX !== 'visible' ? Math.min(c.r, l + (el.clientWidth || b.width)) : c.r,
        b: s.overflowY !== 'visible' ? Math.min(c.b, t + (el.clientHeight || b.height)) : c.b,
      }
    }
    clipMemo.set(el, c)
    return c
  }
  const blockOf = (el) => {
    while (el && el !== stage && /^inline$|^contents$|^ruby/.test(cs(el).display)) el = el.parentElement
    return el
  }
  const parseColor = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/)
    if (!m) return null
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number)
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }
  }
  const rel = (r) => ({ x: r.left - S.left, y: r.top - S.top, w: r.width, h: r.height })
  const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  const label = page.querySelector('.slide-header__muted')?.textContent?.trim() ?? ''

  const ctx2d = document.createElement('canvas').getContext('2d')
  const inkMemo = new Map()
  /** Glyph ink relative to the content-area top-left (canvas text metrics, same fonts). */
  function inkOf(s, ch) {
    const font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`
    const key = font + '\u0000' + ch
    let v = inkMemo.get(key)
    if (!v) {
      ctx2d.font = font
      const m = ctx2d.measureText(ch)
      v = { ascent: m.fontBoundingBoxAscent, up: m.actualBoundingBoxAscent, down: m.actualBoundingBoxDescent, left: m.actualBoundingBoxLeft, right: m.actualBoundingBoxRight }
      inkMemo.set(key, v)
    }
    return v
  }
  const owners = new Map() // element → { chars, reason, partial, style }
  const allChars = [] // document order
  const order = []
  const svgText = []
  const walker = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  while (walker.nextNode()) {
    const node = walker.currentNode
    const text = node.textContent
    if (!text.trim()) continue
    const el = node.parentElement
    if (!el || el.closest('style, script, noscript, title')) continue
    if (el.closest('svg')) {
      const sv = el.closest('text') ?? el
      if (!svgText.includes(sv)) svgText.push(sv)
      continue
    }
    const s = cs(el)
    if (s.visibility !== 'visible') continue
    let o = owners.get(el)
    if (!o) {
      const color = parseColor(s.color) ?? { r: 0, g: 0, b: 0, a: 1 }
      const fill = parseColor(s.webkitTextFillColor) ?? color
      const alpha = fill.a * opacityOf(el)
      let reason = chainReason(el)
      if (!reason && fill.a < 0.02) {
        let clipText = false
        for (let a = el; a && a !== page && !clipText; a = a.parentElement) clipText = /text/.test(`${cs(a).backgroundClip} ${cs(a).webkitBackgroundClip}`)
        reason = clipText ? 'gradient-or-clipped-text' : 'transparent-fill'
      }
      if (!reason && s.textShadow !== 'none') reason = 'text-shadow'
      if (!reason && parseFloat(s.webkitTextStrokeWidth) > 0) reason = 'text-stroke'
      if (!reason && !/^(none|uppercase|lowercase)$/.test(s.textTransform)) reason = 'text-transform'
      if (!reason && s.fontVariantCaps !== 'normal') reason = 'small-caps'
      o = {
        el,
        chars: [],
        reason,
        invisible: alpha < 0.02,
        partial: false,
        style: {
          family: s.fontFamily,
          size: parseFloat(s.fontSize),
          weight: Number(s.fontWeight) || (s.fontWeight === 'bold' ? 700 : 400),
          italic: s.fontStyle !== 'normal',
          color: `${[fill.r, fill.g, fill.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`.toUpperCase(),
          alpha,
          spacing: s.letterSpacing === 'normal' ? 0 : parseFloat(s.letterSpacing) || 0,
          transform: s.textTransform,
        },
        block: blockOf(el),
        pre: /^pre/.test(s.whiteSpace),
      }
      owners.set(el, o)
      order.push(o)
    }
    const clip = clipOf(el)
    const em = parseFloat(s.fontSize)
    for (const g of seg.segment(text)) {
      range.setStart(node, g.index)
      range.setEnd(node, g.index + g.segment.length)
      const r = [...range.getClientRects()].find((q) => q.width > 0.01)
      if (!r) continue // collapsed white space
      // Clipping is judged on the glyph ink, not the taller font content area (display numerals
      // sit in masks no taller than their digits).
      const ink = inkOf(s, g.segment)
      const base = r.top + ink.ascent
      const il = r.left - ink.left, ir = r.left + ink.right
      const it = base - ink.up, ib = base + ink.down
      const inside = il >= clip.l - 1 && ir <= clip.r + 1 && it >= clip.t - 1 && ib <= clip.b + 1
      const outside = ir <= clip.l || il >= clip.r || ib <= clip.t || it >= clip.b
      if (outside) continue
      if (!inside) o.partial = true
      let ch = g.segment
      if (!o.pre && /^\s+$/.test(ch)) ch = ' '
      if (o.style.transform === 'uppercase') ch = ch.toUpperCase()
      else if (o.style.transform === 'lowercase') ch = ch.toLowerCase()
      const c = { ch, o, l: r.left - S.left, r: r.right - S.left, t: r.top - S.top, b: r.bottom - S.top, em }
      o.chars.push(c)
      allChars.push(c)
    }
  }

  const editable = []
  const background = []
  const textOf = (chars) => chars.map((c) => c.ch).join('').replace(/\s+/g, ' ').trim()
  const union = (chars) => {
    const l = Math.min(...chars.map((c) => c.l)), t = Math.min(...chars.map((c) => c.t))
    return { x: l, y: t, w: Math.max(...chars.map((c) => c.r)) - l, h: Math.max(...chars.map((c) => c.b)) - t }
  }
  // Owners decide as a whole, so hiding one element never hides text kept in the background.
  for (const o of order) {
    if (!o.chars.length || o.invisible) continue
    if (!o.reason && o.partial) o.reason = 'clipped'
    if (o.reason) {
      const t = textOf(o.chars)
      if (t) background.push({ text: t.slice(0, 160), reason: o.reason, rect: union(o.chars) })
    }
  }
  for (const sv of svgText) {
    const t = sv.textContent.replace(/\s+/g, ' ').trim()
    if (t) background.push({ text: t.slice(0, 160), reason: 'svg-text', rect: rel(sv.getBoundingClientRect()) })
  }
  // Generated content (::before / ::after text) has no text node and stays in the picture.
  for (const el of stage.querySelectorAll('*')) {
    for (const p of ['::before', '::after']) {
      const c = getComputedStyle(el, p).content
      if (!c || c === 'none' || c === 'normal') continue
      const str = c.replace(/^"|"$/g, '').replace(/\\"/g, '"')
      if (/^[\s\u200b]*$/.test(str) || /^url\(/.test(c)) continue
      background.push({ text: str.slice(0, 160), reason: 'generated-content', rect: rel(el.getBoundingClientRect()) })
    }
  }

  // Lines: chars of one block in DOM order; a new line when the vertical bands stop overlapping
  // or the pen jumps back left. Segments: a horizontal gap (inline image, badge) starts a new box.
  // Which edge a box keeps when PowerPoint draws the text wider or narrower than the browser
  // (substituted fonts, tabular figures): the edge the browser put flush against its container.
  function alignOf(block, textAlign, box, whole, wrapped) {
    // A wrapped paragraph follows its own text-align; its full lines touch both edges.
    if (wrapped) return /center/.test(textAlign) ? 'center' : /right|end/.test(textAlign) ? 'right' : 'left'
    let c = block
    const inner = (el) => {
      const r = el.getBoundingClientRect()
      const s = cs(el)
      const l = r.left + el.clientLeft + parseFloat(s.paddingLeft) - S.left
      return { l, r: l + (el.clientWidth || r.width) - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight) }
    }
    let b = inner(c)
    while (c !== stage && b.r - b.l < box.w + 6 && c.parentElement) {
      c = c.parentElement
      b = inner(c)
    }
    const lg = box.x - b.l
    const rg = b.r - (box.x + box.w)
    if (whole && /center/.test(textAlign)) return 'center'
    if (whole && /right|end/.test(textAlign)) return 'right'
    if (lg > 4 && Math.abs(lg - rg) <= 3) return 'center'
    if (lg > 4 && rg <= 3) return 'right'
    return 'left'
  }
  const blocks = new Map()
  for (const c of allChars) {
    if (c.o.reason || c.o.invisible) continue
    if (!blocks.has(c.o.block)) blocks.set(c.o.block, [])
    blocks.get(c.o.block).push(c)
  }
  for (const [block, chars] of blocks) {
    const blockAlign = cs(block).textAlign
    const lines = []
    let line = null
    for (const c of chars) {
      const prev = line?.at(-1)
      const mid = (c.t + c.b) / 2
      const lt = line ? Math.min(...line.map((q) => q.t)) : 0
      const lb = line ? Math.max(...line.map((q) => q.b)) : 0
      const sameBand = line && ((mid >= lt && mid <= lb) || ((lt + lb) / 2 >= c.t && (lt + lb) / 2 <= c.b))
      if (!line || !sameBand || c.l < prev.l - 0.5 * c.em) lines.push((line = []))
      line.push(c)
    }
    for (const ln of lines) {
      const parts = []
      let part = null
      for (const c of ln) {
        const prev = part?.at(-1)
        const em = Math.max(c.em, prev?.em ?? 0)
        if (!part || c.l - prev.r > 0.12 * em) parts.push((part = []))
        part.push(c)
      }
      for (let p of parts) {
        while (p.length && p[0].ch === ' ') p = p.slice(1)
        while (p.length && p.at(-1).ch === ' ') p = p.slice(0, -1)
        if (!p.length) continue
        const runs = []
        for (const c of p) {
          const last = runs.at(-1)
          if (last && last.o === c.o) last.text += c.ch
          else runs.push({ o: c.o, text: c.ch })
        }
        const box = union(p)
        // One glyph: anchor at its pen position; letter-spacing would only shift it.
        const single = p.length === 1
        const align = single ? 'left' : alignOf(block, blockAlign, box, parts.length === 1, lines.length > 1)
        editable.push({
          text: runs.map((r) => r.text).join(''),
          rect: box,
          align,
          runs: runs.map((r) => ({ text: r.text, ...r.o.style, ...(single ? { spacing: 0 } : {}) })),
          owners: [...new Set(runs.map((r) => r.o.el))],
        })
      }
    }
  }

  // Mark what to hide; the caller makes those glyphs transparent for the background shot.
  const hideOwners = new Set(editable.flatMap((e) => e.owners))
  let id = 0
  for (const el of hideOwners) el.setAttribute('data-pptx-text', String(id++))

  // Pictures: raster <img> (not emoji, not SVG) without effects; a pixel test decides later.
  const pictures = []
  const emoji = stage.querySelectorAll('img.em').length
  let svgImages = 0
  for (const img of stage.querySelectorAll('img')) {
    if (img.classList.contains('em')) continue
    const src = img.currentSrc || img.src
    if (/^data:image\/svg|\.svg(\?|#|$)/i.test(src)) {
      svgImages++
      continue
    }
    const s = cs(img)
    const b = img.getBoundingClientRect()
    if (s.visibility !== 'visible' || b.width < 48 || b.height < 48 || !img.naturalWidth) continue
    const why = chainReason(img) ?? (opacityOf(img) < 0.999 ? 'opacity' : null) ?? (['Top', 'Right', 'Bottom', 'Left'].some((k) => parseFloat(s[`padding${k}`]) || parseFloat(s[`border${k}Width`])) ? 'padding-or-border' : null) ?? (s.boxShadow !== 'none' ? 'box-shadow' : null)
    const clip = clipOf(img.parentElement)
    const vis = { l: Math.max(clip.l, b.left), t: Math.max(clip.t, b.top), r: Math.min(clip.r, b.right), b: Math.min(clip.b, b.bottom) }
    if (vis.r - vis.l < 24 || vis.b - vis.t < 24) continue
    const entry = { rect: rel({ left: vis.l, top: vis.t, width: vis.r - vis.l, height: vis.b - vis.t }), natural: [img.naturalWidth, img.naturalHeight], reason: why }
    if (!why) {
      // Where the image is drawn (object-fit / object-position), then the crop that is visible.
      const [nw, nh] = entry.natural
      const fit = s.objectFit
      let sx = b.width / nw, sy = b.height / nh
      if (fit === 'contain' || fit === 'scale-down') sx = sy = Math.min(sx, sy, fit === 'scale-down' ? 1 : Infinity)
      else if (fit === 'cover') sx = sy = Math.max(sx, sy)
      else if (fit === 'none') sx = sy = 1
      const dw = nw * sx, dh = nh * sy
      const pos = s.objectPosition.split(' ')
      const off = (v, free) => (v.endsWith('%') ? (parseFloat(v) / 100) * free : parseFloat(v) || 0)
      const dx = b.left + off(pos[0] ?? '50%', b.width - dw)
      const dy = b.top + off(pos[1] ?? '50%', b.height - dh)
      const v2 = { l: Math.max(vis.l, dx), t: Math.max(vis.t, dy), r: Math.min(vis.r, dx + dw), b: Math.min(vis.b, dy + dh) }
      if (v2.r - v2.l >= 24 && v2.b - v2.t >= 24) {
        const k = Math.min(3, Math.max(1, 1 / Math.min(sx, sy)))
        const cw = Math.round((v2.r - v2.l) * k), chh = Math.round((v2.b - v2.t) * k)
        const canvas = document.createElement('canvas')
        canvas.width = cw
        canvas.height = chh
        const ctx = canvas.getContext('2d')
        ctx.imageSmoothingQuality = 'high'
        // Rounded corners of the image itself, or of the clipping box that frames it exactly.
        let radius = 0
        const near = (a, c) => Math.abs(a - c) < 1.5
        let host = near(v2.l, b.left) && near(v2.r, b.right) && near(v2.t, b.top) && near(v2.b, b.bottom) ? img : null
        if (!host) for (let a = img.parentElement; a && a !== stage; a = a.parentElement) {
          const ab = a.getBoundingClientRect()
          if (near(ab.left, v2.l) && near(ab.right, v2.r) && near(ab.top, v2.t) && near(ab.bottom, v2.b)) { host = a; break }
        }
        if (host) radius = parseFloat(cs(host).borderTopLeftRadius) || 0
        let alpha = false
        if (radius > 0) {
          ctx.beginPath()
          ctx.roundRect(0, 0, cw, chh, radius * k)
          ctx.clip()
          alpha = true
        }
        try {
          ctx.drawImage(img, (v2.l - dx) / sx, (v2.t - dy) / sy, (v2.r - v2.l) / sx, (v2.b - v2.t) / sy, 0, 0, cw, chh)
          if (!alpha) {
            const d = ctx.getImageData(0, 0, cw, chh).data
            for (let i = 3; i < d.length; i += 4 * 97) if (d[i] < 250) { alpha = true; break }
          }
          entry.rect = rel({ left: v2.l, top: v2.t, width: v2.r - v2.l, height: v2.b - v2.t })
          entry.data = canvas.toDataURL(alpha ? 'image/png' : 'image/jpeg', 0.92)
          entry.mime = alpha ? 'png' : 'jpeg'
          entry.pixels = [cw, chh]
          img.setAttribute('data-pptx-img', String(pictures.length))
        } catch (e) {
          entry.reason = 'unreadable-source'
        }
      } else entry.reason = 'not-visible'
    }
    pictures.push(entry)
  }
  return {
    label,
    editable: editable.map(({ owners, ...e }) => e),
    background,
    pictures,
    emoji,
    svgImages,
    canvases: stage.querySelectorAll('canvas').length,
  }
}

/** Runs in the diff page: per-rectangle pixel statistics between screenshots. */
async function pixelStats({ full, full2, hidden, empty, rects, scale, pictures, noimg }) {
  const load = async (b64) => {
    if (!b64) return null
    const img = new Image()
    img.src = `data:image/png;base64,${b64}`
    await img.decode()
    const c = new OffscreenCanvas(img.width, img.height)
    const x = c.getContext('2d')
    x.drawImage(img, 0, 0)
    return { w: img.width, h: img.height, d: x.getImageData(0, 0, img.width, img.height).data, c, x }
  }
  const A = await load(full)
  const A2 = await load(full2)
  const B = await load(hidden)
  const E = await load(empty)
  const T = 8 // renders are deterministic (checked below), so small differences are real
  const differs = (p, q, i) => Math.max(Math.abs(p[i] - q[i]), Math.abs(p[i + 1] - q[i + 1]), Math.abs(p[i + 2] - q[i + 2])) > T
  let unstable = 0
  for (let i = 0; i < A.d.length; i += 4 * 13) if (differs(A.d, A2.d, i)) unstable++
  const boxes = rects.map((r) => {
    const x0 = Math.max(0, Math.floor(r.x * scale)), y0 = Math.max(0, Math.floor(r.y * scale))
    const x1 = Math.min(A.w, Math.ceil((r.x + r.w) * scale)), y1 = Math.min(A.h, Math.ceil((r.y + r.h) * scale))
    let own = 0, residual = 0, both = 0, seen = 0
    for (let y = y0; y < y1; y++)
      for (let x = x0; x < x1; x++) {
        const i = (y * A.w + x) * 4
        const o = differs(A.d, B.d, i)
        const re = differs(B.d, E.d, i)
        if (o) own++
        if (differs(A.d, E.d, i)) seen++
        if (re) residual++
        if (o && re) both++
      }
    return { own, residual, both, seen }
  })
  // Pictures: background without the images plus each extracted picture must equal the original.
  let pics = []
  if (pictures?.length && noimg) {
    const N = await load(noimg)
    for (const p of pictures) {
      const img = new Image()
      img.src = p.data
      await img.decode()
      const c = new OffscreenCanvas(N.w, N.h)
      const x = c.getContext('2d')
      x.drawImage(N.c, 0, 0)
      x.drawImage(img, p.rect.x * scale, p.rect.y * scale, p.rect.w * scale, p.rect.h * scale)
      const x0 = Math.floor(p.rect.x * scale), y0 = Math.floor(p.rect.y * scale)
      const w = Math.floor(p.rect.w * scale), h = Math.floor(p.rect.h * scale)
      const got = x.getImageData(x0, y0, w, h).data
      const want = B.x.getImageData(x0, y0, w, h).data
      let bad = 0, sum = 0
      for (let i = 0; i < got.length; i += 4) {
        const m = Math.max(Math.abs(got[i] - want[i]), Math.abs(got[i + 1] - want[i + 1]), Math.abs(got[i + 2] - want[i + 2]))
        sum += m
        if (m > 48) bad++
      }
      const n = got.length / 4
      pics.push({ bad: bad / n, mean: sum / n })
    }
  }
  return { unstable, boxes, pics }
}

const t0 = Date.now()
const browser = await launchChromium({ executablePath: findChromium() })
const report = {
  deck: NAME,
  html: relative(ROOT, HTML),
  pptx: relative(ROOT, OUT),
  method: 'Rendered #/print view (reduced motion). Text PowerPoint can reproduce becomes native text boxes, one per rendered line segment; the rest of the slide is a background picture taken with exactly those glyphs transparent.',
  scale: SCALE,
  fonts: 'Font names are written, not embedded: PowerPoint substitutes any font the viewer lacks.',
  slides: [],
}
let notes = []
try {
  const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: SCALE, reducedMotion: 'reduce' })
  await context.setOffline(true)
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.goto(`${pathToFileURL(HTML).href}#/print`)
  await page.waitForSelector('.pp__page > .stage', { timeout: 30000 })
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map((i) => (i.complete ? null : i.decode().catch(() => null))))
  })
  await page.waitForTimeout(800)
  const deckTitle = await page.evaluate(() => document.title)
  const count = await page.locator('.pp__page').count()
  await page.addStyleTag({
    content: `.pp__bar{display:none!important} html,body{margin:0!important;padding:0!important}
      .pp__page{margin:0!important} body.pptx-solo .pp__page:not(.pptx-on){display:none!important}
      body.pptx-empty .pptx-on .stage *, body.pptx-empty .pptx-on .stage *::before, body.pptx-empty .pptx-on .stage *::after{-webkit-text-fill-color:transparent!important}
      body.pptx-noimg [data-pptx-img]{visibility:hidden!important}`,
  })
  const diff = await context.newPage()
  await diff.setContent('<!doctype html><title>diff</title>')
  const shot = async () => (await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H }, animations: 'disabled', caret: 'hide' })).toString('base64')
  for (let n = 0; n < count; n++) {
    await page.evaluate((n) => {
      document.body.classList.add('pptx-solo')
      document.querySelectorAll('.pp__page').forEach((p, i) => p.classList.toggle('pptx-on', i === n))
      window.scrollTo(0, 0)
    }, n)
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
    await page.waitForTimeout(250)
    const at = await page.evaluate(() => {
      const r = document.querySelector('.pptx-on > .stage').getBoundingClientRect()
      return [r.left, r.top, r.width, r.height]
    })
    if (at.some((v, i) => Math.abs(v - [0, 0, W, H][i]) > 0.5)) throw new Error(`slide ${n + 1}: stage is at ${at.join(',')}, expected 0,0,${W},${H}`)
    const full = await shot()
    const data = await page.evaluate(collectSlide)
    const full2 = await shot()
    await page.evaluate(() => document.body.classList.add('pptx-empty'))
    const empty = await shot()
    // Hide exactly the collected glyphs. Descendants keep their own fill, so text left in the
    // background inside a hidden element stays visible; currentColor borders and icons are untouched.
    // PPTX_SELFTEST_LEAVE_TEXT=1 leaves one element's text in the background on purpose, so the
    // selftest can prove the duplicate check below catches it.
    await page.evaluate((leave) => {
      document.body.classList.remove('pptx-empty')
      const hidden = [...document.querySelectorAll('.pptx-on [data-pptx-text]')].slice(leave ? 1 : 0)
      const keep = new Map()
      for (const el of hidden) for (const d of el.querySelectorAll('*')) if (!d.hasAttribute('data-pptx-text')) keep.set(d, getComputedStyle(d).webkitTextFillColor)
      for (const el of hidden) el.style.setProperty('-webkit-text-fill-color', 'transparent', 'important')
      for (const [d, v] of keep) d.style.setProperty('-webkit-text-fill-color', v, 'important')
    }, process.env.PPTX_SELFTEST_LEAVE_TEXT === '1')
    const hidden = await shot()
    const candidates = data.pictures.filter((p) => !p.reason)
    let noimg = null
    if (candidates.length) {
      await page.evaluate(() => document.body.classList.add('pptx-noimg'))
      noimg = await shot()
    }
    const stats = await diff.evaluate(pixelStats, { full, full2, hidden, empty, rects: data.editable.map((e) => e.rect), scale: SCALE, pictures: candidates, noimg })
    // Overlapping candidates cannot be judged one by one; keep them in the background.
    const overlap = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h
    candidates.forEach((p, i) => {
      const s = stats.pics[i]
      p.check = { badPixels: +s.bad.toFixed(4), meanDiff: +s.mean.toFixed(2) }
      if (candidates.some((q) => q !== p && overlap(p.rect, q.rect))) p.reason = 'overlaps-another-image'
      else if (s.bad > 0.0005 || s.mean > 3) p.reason = 'not-separable (something is drawn over it or styled)'
    })
    const kept = candidates.filter((p) => !p.reason)
    let background = hidden
    if (kept.length && kept.length === candidates.length) background = noimg
    else if (kept.length) {
      await page.evaluate((keep) => {
        document.body.classList.remove('pptx-noimg')
        document.querySelectorAll('.pptx-on [data-pptx-img]').forEach((el) => {
          if (!keep.includes(Number(el.getAttribute('data-pptx-img')))) el.removeAttribute('data-pptx-img')
        })
        document.body.classList.add('pptx-noimg')
      }, kept.map((p) => data.pictures.indexOf(p)))
      background = await shot()
    }
    await page.evaluate(() => document.body.classList.remove('pptx-noimg'))
    // The duplicate check: a box whose glyphs did not leave the background, or whose area in the
    // background still holds text of the same shape (Jaccard of changed pixels).
    const unstable = stats.unstable > 40
    const checks = { stable: !unstable, notRemoved: [], duplicates: [], overlapsBackgroundText: [], tooFaintToCheck: [] }
    data.editable.forEach((e, i) => {
      const b = stats.boxes[i]
      e.pixels = b
      if (unstable) return
      const tag = `${e.text.slice(0, 40)}`
      // A glyph that changes no pixel when all text is removed is too faint to judge.
      if (b.seen < 3) {
        checks.tooFaintToCheck.push(tag)
        e.invisible = true
      }
      else if (b.own < 3) checks.notRemoved.push(tag)
      else if (b.residual > 0) {
        const jac = b.both / (b.own + b.residual - b.both)
        if (jac > 0.5) checks.duplicates.push(`${tag} (${jac.toFixed(2)})`)
        else if (b.residual > 0.15 * b.own) checks.overlapsBackgroundText.push(tag)
      }
    })
    // Text the browser draws as nothing (missing glyph, near-zero alpha) gets no box.
    const invisibleText = data.editable.filter((e) => e.invisible).map((e) => e.text)
    data.editable = data.editable.filter((e) => !e.invisible)
    checks.invisibleTextDropped = invisibleText
    const counts = {}
    for (const b of data.background) counts[b.reason] = (counts[b.reason] ?? 0) + 1
    const slide = {
      n: n + 1,
      label: data.label,
      background,
      editable: data.editable,
      backgroundText: data.background,
      backgroundTextByReason: counts,
      pictures: data.pictures,
      emojiImages: data.emoji,
      svgImages: data.svgImages,
      canvases: data.canvases,
      checks,
    }
    report.slides.push(slide)
    if (SHOTS) {
      // For review: what the browser shows, and the picture under the text boxes.
      mkdirSync(SHOTS, { recursive: true })
      const nn = String(n + 1).padStart(2, '0')
      writeFileSync(join(SHOTS, `slide-${nn}-html.png`), Buffer.from(full, 'base64'))
      writeFileSync(join(SHOTS, `slide-${nn}-background.png`), Buffer.from(background, 'base64'))
    }
    const bad = checks.notRemoved.length + checks.duplicates.length
    console.log(`slide ${String(n + 1).padStart(2, '0')}  ${String(data.editable.length).padStart(3)} text boxes  ${String(data.background.length).padStart(3)} text in background  ${kept.length} pictures${data.emoji ? `  ${data.emoji} emoji` : ''}${bad ? `  DUPLICATE ${[...checks.notRemoved, ...checks.duplicates].join(' | ')}` : ''}${unstable ? '  (unstable render, pixel check skipped)' : ''}`)
  }
  if (errors.length) report.pageErrors = errors
  await page.close()
  await diff.close()

  // Notes: the presenter view shows the notes of the slide it is told about.
  const pv = await context.newPage()
  await pv.goto(`${pathToFileURL(HTML).href}#/presenter`)
  try {
    await pv.waitForSelector('.pv__notes', { timeout: 15000 })
    for (let i = 0; i < count; i++) {
      await pv.evaluate(({ i, title }) => {
        window.postMessage({ tag: 'pcafe-presenter', title, id: `pptx-${i}-${Math.random()}`, msg: { kind: 'state', index: i, step: null, builds: 0 } }, '*')
      }, { i, title: deckTitle })
      await pv.waitForFunction((i) => document.querySelector('.pv__page')?.textContent?.trim().startsWith(String(i + 1).padStart(2, '0')), i, { timeout: 5000 })
      notes.push(
        await pv.evaluate(() => {
          const p = document.querySelector('.pv__notes:not(.pv__notes--table) p:not(.pv__empty)')
          if (!p) return ''
          const c = p.cloneNode(true) // emoji are images; their alt text is the character
          c.querySelectorAll('img[alt]').forEach((i) => i.replaceWith(i.alt))
          return c.textContent.trim()
        }),
      )
    }
  } catch (e) {
    report.notesWarning = `speaker notes could not be read from #/presenter: ${e.message.split('\n')[0]}`
    console.warn(`pptx: ${report.notesWarning}`)
    notes = []
  }
  await pv.close()
  await context.close()
  report.title = deckTitle
} finally {
  await browser.close()
}

// ── 3. PowerPoint ────────────────────────────────────────────────────────────
// Characters the Latin faces do not cover; Chrome draws them with the CJK face of the stack.
const CJK_CLASS = '\\p{Script=Han}\\u2e80-\\u9fff\\uf900-\\ufaff\\ufe30-\\ufe4f\\uff00-\\uffef'
const SCRIPT_PIECES = new RegExp(`[${CJK_CLASS}]+|[^${CJK_CLASS}]+`, 'gu')
const isCJK = (ch) => new RegExp(`[${CJK_CLASS}]`, 'u').test(ch)
const SEP = '||'
const pptx = new PptxGenJS()
pptx.layout = 'LAYOUT_WIDE'
pptx.title = report.title ?? NAME
pptx.author = 'pcafe'
for (const [i, s] of report.slides.entries()) {
  const slide = pptx.addSlide()
  slide.background = { data: `image/png;base64,${s.background}` }
  for (const p of s.pictures.filter((p) => !p.reason && p.data))
    slide.addImage({ data: p.data.replace(/^data:/, ''), x: inch(p.rect.x), y: inch(p.rect.y), w: inch(p.rect.w), h: inch(p.rect.h), altText: 'picture from the slide' })
  for (const e of s.editable) {
    const runs = []
    for (const r of e.runs) {
      const f = fontsFor(r.family, r.weight, r.italic)
      // Split by script: CJK glyphs use the East Asian face and its own weight, never a fake bold.
      const pieces = r.text.match(SCRIPT_PIECES) ?? [r.text]
      for (const piece of pieces) {
        const cjk = isCJK(piece[0])
        runs.push({
          text: piece,
          options: {
            fontFace: `${cjk ? f.ea : f.latin}${SEP}${f.ea}`,
            fontSize: pt(r.size),
            bold: cjk ? false : f.bold,
            italic: f.italic,
            color: r.color,
            transparency: r.alpha < 0.995 ? Math.round((1 - r.alpha) * 100) : undefined,
            charSpacing: r.spacing ? pt(r.spacing) : undefined,
            lang: cjk ? 'zh-CN' : 'en-US',
          },
        })
      }
    }
    // One rendered line per box, never wrapped by PowerPoint; centred vertically on the line's
    // content area so a font with different metrics still sits on the same line.
    const width = e.rect.w + 2
    slide.addText(runs, {
      x: inch(e.align === 'center' ? e.rect.x - 1 : e.align === 'right' ? e.rect.x - 2 : e.rect.x),
      y: inch(e.rect.y),
      w: inch(width),
      h: inch(Math.max(e.rect.h, 4)),
      margin: 0,
      wrap: false,
      fit: 'none',
      valign: 'middle',
      align: e.align,
      paraSpaceBefore: 0,
      paraSpaceAfter: 0,
    })
  }
  if (notes[i]) slide.addNotes(notes[i])
  s.notes = notes[i] ?? ''
}
let buf = await pptx.write({ outputType: 'nodebuffer' })
// pptxgenjs writes one face into latin, ea and cs; split "Latin||EastAsian" back into its parts.
const zip = await JSZip.loadAsync(buf)
for (const f of Object.keys(zip.files).filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f))) {
  const xml = await zip.file(f).async('string')
  const fixed = xml
    .replace(
      /<a:latin typeface="([^"|]*)\|\|([^"]*)" pitchFamily="34" charset="0"\/><a:ea typeface="[^"]*" pitchFamily="34" charset="-122"\/><a:cs typeface="[^"]*" pitchFamily="34" charset="-120"\/>/g,
      (_, latin, ea) => `<a:latin typeface="${latin}"/><a:ea typeface="${ea}"/><a:cs typeface="${latin}"/>`,
    )
    // pptxgenjs repeats <a:pPr> before every run of a paragraph; only the first one is valid.
    .replace(/<a:p>([\s\S]*?)<\/a:p>/g, (_, inner) => {
      let first = true
      return `<a:p>${inner.replace(/<a:pPr\b[^>]*?(?:\/>|>[\s\S]*?<\/a:pPr>)/g, (pp) => (first ? ((first = false), pp) : ''))}</a:p>`
    })
  if (fixed.includes(SEP)) throw new Error(`font marker left in ${f}`)
  zip.file(f, fixed)
}
buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
writeFileSync(OUT, buf)

// ── 4. Report ────────────────────────────────────────────────────────────────
const sum = (f) => report.slides.reduce((a, s) => a + f(s), 0)
const byReason = {}
for (const s of report.slides) for (const [k, v] of Object.entries(s.backgroundTextByReason)) byReason[k] = (byReason[k] ?? 0) + v
report.summary = {
  slides: report.slides.length,
  editableTextBoxes: sum((s) => s.editable.length),
  backgroundText: sum((s) => s.backgroundText.length),
  backgroundTextByReason: byReason,
  pictures: sum((s) => s.pictures.filter((p) => !p.reason).length),
  imagesLeftInBackground: sum((s) => s.pictures.filter((p) => p.reason).length + s.svgImages),
  emojiImagesInBackground: sum((s) => s.emojiImages),
  slidesWithNotes: report.slides.filter((s) => s.notes).length,
  duplicates: sum((s) => s.checks.notRemoved.length + s.checks.duplicates.length),
  fontsWithoutMapping: [...unknownFonts], // written under their CSS name
  bytes: buf.length,
  seconds: +((Date.now() - t0) / 1000).toFixed(1),
}
for (const s of report.slides) {
  delete s.background
  for (const p of s.pictures) delete p.data
  for (const e of s.editable) e.rect = Object.fromEntries(Object.entries(e.rect).map(([k, v]) => [k, +v.toFixed(1)]))
}
writeFileSync(REPORT, JSON.stringify(report, null, 2) + '\n')
const S = report.summary
console.log(`wrote ${relative(ROOT, OUT)} (${S.slides} slides, ${S.editableTextBoxes} editable text boxes, ${S.backgroundText} text runs left in the background, ${S.pictures} pictures, ${S.slidesWithNotes} with notes) and ${relative(ROOT, REPORT)}`)
if (S.duplicates) {
  console.error(`pptx: ${S.duplicates} text box(es) are also visible in the background; see checks in ${relative(ROOT, REPORT)}`)
  process.exit(1)
}
