import { Reveal } from '../../../deck/primitives'
import { fmt } from '../../chart-util'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'
import { SHADES } from './util'

export interface TreeItem {
  /** ≤ 6 CJK characters. */
  name: string
  value: number
}

export interface TreemapProps extends SlideBase {
  /** 4–12 items. Area is proportional to value. */
  items: TreeItem[]
  unit?: string
  decimals?: number
  /** Item drawn in the accent. */
  focus?: string
  /** Show each item's share of the total. Default true. */
  shares?: boolean
}

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/** Squarified layout (Bruls et al.) in a w × h box. */
function squarify(vals: number[], box: Rect): Rect[] {
  const out: Rect[] = []
  const total = vals.reduce((a, b) => a + b, 0)
  const scale = (box.w * box.h) / (total || 1)
  let rest = vals.map((v) => v * scale)
  let r = { ...box }
  const worst = (row: number[], side: number) => {
    const s = row.reduce((a, b) => a + b, 0)
    return Math.max(...row.map((a) => Math.max((side * side * a) / (s * s), (s * s) / (side * side * a))))
  }
  while (rest.length) {
    const side = Math.min(r.w, r.h)
    const row = [rest[0]]
    let i = 1
    while (i < rest.length && worst([...row, rest[i]], side) <= worst(row, side)) row.push(rest[i++])
    const s = row.reduce((a, b) => a + b, 0)
    if (r.w >= r.h) {
      const w = s / r.h
      let y = r.y
      for (const a of row) out.push({ x: r.x, y, w, h: a / w }), (y += a / w)
      r = { x: r.x + w, y: r.y, w: r.w - w, h: r.h }
    } else {
      const h = s / r.w
      let x = r.x
      for (const a of row) out.push({ x, y: r.y, w: a / h, h }), (x += a / h)
      r = { x: r.x, y: r.y + h, w: r.w, h: r.h - h }
    }
    rest = rest.slice(row.length)
  }
  return out
}

const W = 1776
const H = 560

/** Nested rectangles sized by value: parts of a whole when there are too many parts for a donut. */
export function Treemap({ kicker, title, lead, source, hint, items, unit = '', decimals = 0, focus, shares = true }: TreemapProps) {
  const sorted = [...items].sort((a, b) => b.value - a.value)
  const total = sorted.reduce((n, it) => n + it.value, 0)
  const rects = squarify(
    sorted.map((it) => it.value),
    { x: 0, y: 0, w: W, h: H },
  )
  return (
    <section className="slide">
      <Hint id="treemap">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="tmap">
          {sorted.map((it, i) => {
            const r = rects[i]
            const size = r.w >= 200 && r.h >= 120 ? 'is-big' : r.w >= 110 && r.h >= 70 ? 'is-mid' : 'is-tiny'
            return (
              <div
                key={it.name}
                className={`tmap__cell ${size}${it.name === focus ? ' is-focus' : ''}`}
                style={vars({ '--x': r.x / W, '--y': r.y / H, '--w': r.w / W, '--h': r.h / H, '--c': SHADES[Math.min(i, 5)], '--k': i })}
              >
                {size !== 'is-tiny' && (
                  <span>
                    <em>{it.name}</em>
                    <b>
                      {fmt(it.value, decimals)}
                      {unit}
                    </b>
                    {shares && size === 'is-big' && <small>{fmt((it.value / total) * 100, 1)}%</small>}
                  </span>
                )}
              </div>
            )
          })}
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
