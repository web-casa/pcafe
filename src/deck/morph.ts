// Shared-element transition between slides ("magic move").
// Any element with data-morph="key" on the outgoing slide flies to the element
// with the same key on the incoming one. A text ghost in the stage's morph layer
// does the flying, so both slides can keep their own markup and intros.

const DURATION = 820
// In-out, so the flight reads as movement instead of a jump followed by a crawl.
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function morph(next: HTMLElement, layer: HTMLElement) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const stage = layer.parentElement
  if (!stage) return
  const prev = [...stage.querySelectorAll<HTMLElement>(':scope > .slide-frame')].filter((f) => f !== next).at(-1)
  if (!prev) return
  for (const target of next.querySelectorAll<HTMLElement>('[data-morph]')) {
    const source = prev.querySelector<HTMLElement>(`[data-morph="${CSS.escape(target.dataset.morph!)}"]`)
    if (source) fly(source, target, stage, layer)
  }
}

function fly(source: HTMLElement, target: HTMLElement, stage: HTMLElement, layer: HTMLElement) {
  const box = () => stage.getBoundingClientRect()
  const from = rel(source.getBoundingClientRect(), box())
  const fromStyle = getComputedStyle(source)
  const toStyle = getComputedStyle(target)
  const size = parseFloat(toStyle.fontSize)
  const s0 = parseFloat(fromStyle.fontSize) / size

  const ghost = document.createElement('span')
  ghost.className = 'morph-ghost'
  ghost.textContent = target.textContent
  Object.assign(ghost.style, {
    font: toStyle.font,
    letterSpacing: toStyle.letterSpacing,
    color: fromStyle.color,
    transition: `color ${DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
  })
  layer.append(ghost)
  const gw = ghost.offsetWidth
  const gh = ghost.offsetHeight

  source.style.visibility = 'hidden'
  target.style.visibility = 'hidden'
  requestAnimationFrame(() => (ghost.style.color = toStyle.color))

  // The target may still be moving (its own entrance), so track it live.
  const t0 = performance.now()
  const tick = (now: number) => {
    const t = Math.min(1, (now - t0) / DURATION)
    const e = ease(t)
    const to = rel(target.getBoundingClientRect(), box())
    const s = s0 + (1 - s0) * e
    const cx = from.cx + (to.cx - from.cx) * e
    const cy = from.cy + (to.cy - from.cy) * e
    ghost.style.transform = `translate(${cx - (gw * s) / 2}px, ${cy - (gh * s) / 2}px) scale(${s})`
    if (t < 1) requestAnimationFrame(tick)
    else {
      target.style.visibility = ''
      ghost.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140 }).finished.then(() => ghost.remove())
    }
  }
  tick(t0)
}

function rel(r: DOMRect, s: DOMRect) {
  return { cx: r.left - s.left + r.width / 2, cy: r.top - s.top + r.height / 2 }
}
