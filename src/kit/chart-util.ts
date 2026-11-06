// Small helpers shared by the chart templates.

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/** A round axis maximum ≥ v: 1, 2, 2.5 or 5 times a power of ten. */
export function niceMax(v: number) {
  if (v <= 0) return 1
  const p = 10 ** Math.floor(Math.log10(v))
  for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= v) return m * p
  return 10 * p
}

/** Formats with a fixed number of decimals and thin grouping. */
export const fmt = (v: number, decimals = 0) => v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

/** Counts from 0 up to `to` once mounted. Reduced motion shows the value at once. */
export function useCount(to: number, { decimals = 0, delay = 400, duration = 1400 } = {}) {
  const reduce = useReducedMotion()
  const [v, setV] = useState(reduce ? to : 0)
  useEffect(() => {
    if (reduce) return setV(to)
    let raf = 0
    const start = performance.now() + delay
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration))
      setV(to * (1 - (1 - t) ** 3))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, delay, duration, reduce])
  return fmt(v, decimals)
}

/** Monochrome ramp with the accent first: a chart's focus is the only colour. */
export const RAMP = ['var(--accent)', 'var(--ink-2)', 'var(--mute)', 'var(--faint)', 'var(--line-strong)']
