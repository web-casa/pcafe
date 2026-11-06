// A real kit component on a print layout: the whole slide template renders off to the side of the
// crop, everything but one part is hidden, and that part is scaled to the box it sits in. It is the
// résumé's KitPart with two additions for print: the width comes from the layout, and the design
// canvas can be narrower or taller than a slide (`dw`, `dh`) so templates reflow instead of shrinking.
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { StaticSlide } from '../deck/features/presenter'
import type { SlideDef } from '../deck/Deck'
import { usePrint } from './context'
import type { PrintTone, TextTier } from './types'

function layoutBox(el: HTMLElement, stage: Element) {
  let x = 0
  let y = 0
  let n: HTMLElement | null = el
  while (n && n !== stage) {
    x += n.offsetLeft
    y += n.offsetTop
    n = n.offsetParent as HTMLElement | null
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

export interface KitProps {
  /** One template from src/kit, with its kicker and title left empty. */
  children: ReactNode
  /** CSS selector of the part to keep. Tested selectors are listed in docs/en/print.md. */
  part: string
  /** Short name, for error messages and the PDF's structure. */
  label: string
  /** Which distance rule its text is held to. Default 'read'. */
  tier?: TextTier
  /** Share of the available width to use, 0 to 1. Default 1. */
  scale?: number
  /** Width and height of the design canvas the template lays itself out on. Default 1920 × 1080. */
  dw?: number
  dh?: number
  /** Room above and below the part, in design units, for glyphs that overshoot its box. Negative trims a box that is much taller than what it shows. */
  pad?: number
  tone?: PrintTone
}

/** Renders one part of a kit template at the width of its box. */
export function Kit({ children, part, label, tier = 'read', scale = 1, dw = 1920, dh = 1080, pad = 0, tone }: KitProps) {
  const ctx = usePrint()
  const box = useRef<HTMLDivElement>(null)
  const host = useRef<HTMLDivElement>(null)
  const [avail, setAvail] = useState(0)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    // A hidden page reads 0. Keeping the last width means showing it again does not lay the part out from scratch.
    const read = () => { if (el.clientWidth > 0) setAvail(el.clientWidth) }
    read()
    const ro = new ResizeObserver(read)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const width = avail * scale
  const u0 = width / dw
  const [view, setView] = useState<{ u: number; x: number; y: number; h: number } | null>(null)
  useLayoutEffect(() => {
    if (!width) return
    const stage = host.current?.querySelector('.stage')
    const el = stage?.querySelector<HTMLElement>(part)
    if (!stage || !el) {
      host.current?.setAttribute('data-missing-part', part)
      return
    }
    for (let n: HTMLElement | null = el; n && n !== stage; n = n.parentElement) {
      for (const sib of n.parentElement?.children ?? []) if (sib !== n) sib.setAttribute('data-part-off', '')
    }
    const b = layoutBox(el, stage)
    const u = width / (b.w / u0)
    setView({ u, x: (-b.x / u0) * u, y: (-b.y / u0) * u, h: (b.h / u0) * u })
  }, [part, width, u0])
  // A template can hold a few sizes in px, so its part is measured again at the final scale.
  const passes = useRef(0)
  useLayoutEffect(() => {
    const stage = host.current?.querySelector('.stage')
    const el = stage?.querySelector<HTMLElement>(part)
    if (!stage || !el || !view || passes.current >= 6) return
    const b = layoutBox(el, stage)
    if (Math.abs(b.w - width) < 0.5 && Math.abs(b.h - view.h) < 0.5 && Math.abs(b.x + view.x) < 0.5 && Math.abs(b.y + view.y) < 0.5) return
    passes.current += 1
    setView({ u: view.u * (width / b.w), x: -b.x, y: -b.y, h: b.h })
  }, [part, view, width])
  const u = view?.u ?? (u0 || 1)
  const t = tone ?? ctx.tone
  const slide: SlideDef = { id: 'part', label, tone: t === 'light' ? undefined : t, render: () => children }
  return (
    <div ref={box} className="pr-kitbox" data-keep={label}>
      <div ref={host} className="pr-kit" data-tier={tier} data-label={label} data-narrow={dw < 1000 ? '' : undefined} style={{ width: width || '100%', height: (view?.h ?? 1) + 2 * pad * u }}>
        <div style={{ position: 'absolute', left: view?.x ?? 0, top: (view?.y ?? 0) + pad * u, width: u * dw, height: u * dh, '--dw': dw, '--dh': dh } as CSSProperties}>
          <StaticSlide slide={slide} style={ctx.style} u={u} index={0} total={1} />
        </div>
      </div>
    </div>
  )
}
