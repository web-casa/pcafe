// Helpers shared by the phase-4 (v2) data and relation templates.

import { useEffect, useState, type RefObject } from 'react'

/** Round ticks from lo to ≥ hi, about four steps. */
export function niceTicks(lo: number, hi: number, steps = 4) {
  const raw = (hi - lo) / steps || 1
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw)!
  const ticks: number[] = []
  for (let t = Math.floor(lo / step) * step; t <= Math.ceil(hi / step) * step + step / 2; t += step) ticks.push(+t.toFixed(10))
  return ticks
}

/**
 * Neutral shades for the non-focus parts of a chart, darkest first.
 * Mixed from the theme's ink and canvas so they follow light and dark tones.
 */
export const SHADES = [62, 46, 34, 25, 18, 12].map((p) => `color-mix(in srgb, var(--ink) ${p}%, var(--canvas))`)

/** Categorical colours for relation diagrams: the theme's spot palette. */
export const SPOT = (i: number) => `var(--spot-${(i % 6) + 1})`

/**
 * How many of the `[data-step]` markers inside `ref` are revealed. Build steps
 * are applied to the DOM by the deck, so this watches their state attribute.
 * Fully built (no build state, e.g. a jump or print) counts every marker.
 */
export function useStepCount(ref: RefObject<HTMLElement | null>) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const read = () => setN([...el.querySelectorAll<HTMLElement>('[data-step]')].filter((m) => m.dataset.buildState !== 'pending').length)
    read()
    const mo = new MutationObserver(read)
    mo.observe(el, { subtree: true, attributes: true, attributeFilter: ['data-build-state'] })
    return () => mo.disconnect()
  }, [ref])
  return n
}
