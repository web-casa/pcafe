import { PORTRAIT_SAFE, SIZES, type VideoDef } from './types'

interface Problem {
  kind: string
  text: string
}

const SKIP = 'script,style,[aria-hidden="true"],[data-v-bleed]'

/** Checks what is on screen right now. Called by scripts/video-qa.mjs at settled frames. */
export function audit(def: VideoDef) {
  const { width, height } = SIZES[def.size]
  const out = { problems: [] as Problem[], minFont: 999, minFontText: '', hasSource: false, caption: '', pending: 0, builds: 0, loops: 0 }
  const layers = [...document.querySelectorAll<HTMLElement>('[data-v-scene]')]
  const top = layers.at(-1)
  if (!top) return { ...out, problems: [{ kind: 'empty', text: 'no scene mounted' }] }

  const cap = top.querySelector<HTMLElement>('[data-v-caption]')
  if (cap) {
    const span = cap.firstElementChild as HTMLElement
    const r = span.getBoundingClientRect()
    const box = cap.getBoundingClientRect()
    out.caption = span.textContent ?? ''
    const lh = parseFloat(getComputedStyle(cap).lineHeight)
    const lines = Math.round(r.height / lh)
    if (r.left < box.left - 1 || r.right > box.right + 1) out.problems.push({ kind: 'caption-overflow', text: out.caption })
    if (lines > 2) out.problems.push({ kind: 'caption-lines', text: `${lines} lines: ${out.caption}` })
  }

  const safe =
    def.size === '9:16'
      ? { left: PORTRAIT_SAFE.left, top: PORTRAIT_SAFE.top, right: width - PORTRAIT_SAFE.right, bottom: height - PORTRAIT_SAFE.bottom }
      : { left: 0, top: 0, right: width, bottom: height }

  // Every visible text run on the top scene.
  const walker = document.createTreeWalker(top, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = (n.textContent ?? '').trim()
    const el = n.parentElement
    if (!text || !el || el.closest(SKIP)) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none') continue
    let o = 1
    for (let p: HTMLElement | null = el; p && p !== top; p = p.parentElement) o *= parseFloat(getComputedStyle(p).opacity)
    if (o < 0.05) continue
    range.selectNodeContents(n)
    const rects = [...range.getClientRects()]
    if (!rects.length) continue
    const r = { left: Math.min(...rects.map((x) => x.left)), right: Math.max(...rects.map((x) => x.right)), top: Math.min(...rects.map((x) => x.top)), bottom: Math.max(...rects.map((x) => x.bottom)) }
    if (r.left < safe.left - 1 || r.right > safe.right + 1 || r.top < safe.top - 1 || r.bottom > safe.bottom + 1) {
      out.problems.push({ kind: def.size === '9:16' ? 'outside-safe-area' : 'off-canvas', text: `${text.slice(0, 40)} @ ${Math.round(r.left)},${Math.round(r.top)}–${Math.round(r.right)},${Math.round(r.bottom)}` })
    }
    const size = parseFloat(cs.fontSize)
    if (size < out.minFont) {
      out.minFont = size
      out.minFontText = text.slice(0, 30)
    }
  }
  out.hasSource = [...top.querySelectorAll('.s-source, .s-foot, .close__refs, [data-v-source]')].some((n) => (n.textContent ?? '').trim().length > 0)
  out.loops = document.getAnimations().filter((a) => a.effect?.getComputedTiming().endTime === Infinity && top.contains((a.effect as KeyframeEffect).target)).length
  const builds = [...top.querySelectorAll<HTMLElement>('[data-build]')]
  out.builds = new Set(builds.map((el, k) => el.dataset.build || `#${k}`)).size
  out.pending = builds.filter((el) => el.dataset.buildState === 'pending').length
  return out
}
