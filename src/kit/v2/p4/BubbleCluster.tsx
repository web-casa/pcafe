import { Reveal } from '../../../deck/primitives'
import { fmt } from '../../chart-util'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface ClusterItem {
  /** ≤ 6 CJK characters. */
  name: string
  value: number
}

export interface BubbleClusterProps extends SlideBase {
  /** 5–14 items. Area is proportional to value. */
  items: ClusterItem[]
  unit?: string
  decimals?: number
  /** Item drawn in the accent; the others are grey. Default: the largest. */
  focus?: string
  /** Right-hand reading: 1–3 lines, key ≤ 8, text ≤ 30 CJK characters. */
  notes?: { key: string; text: string }[]
}

interface Placed {
  x: number
  y: number
  r: number
}

/** Greedy front packing: each circle goes to the free tangent spot nearest the centre. */
function pack(radii: number[]) {
  const out: Placed[] = []
  const hits = (c: Placed) => out.some((o) => Math.hypot(o.x - c.x, o.y - c.y) < o.r + c.r - 0.01)
  radii.forEach((r, i) => {
    if (i === 0) return out.push({ x: 0, y: 0, r })
    if (i === 1) return out.push({ x: out[0].r + r + 2, y: 0, r })
    let best: Placed | null = null
    for (let a = 0; a < out.length; a++)
      for (let b = a + 1; b < out.length; b++) {
        const A = out[a]
        const B = out[b]
        const ra = A.r + r + 2
        const rb = B.r + r + 2
        const d = Math.hypot(B.x - A.x, B.y - A.y)
        if (d > ra + rb || d < Math.abs(ra - rb) || d === 0) continue
        const l = (ra * ra - rb * rb + d * d) / (2 * d)
        const h = Math.sqrt(Math.max(0, ra * ra - l * l))
        const mx = A.x + ((B.x - A.x) * l) / d
        const my = A.y + ((B.y - A.y) * l) / d
        for (const s of [1, -1]) {
          // Flatten vertically so the cluster fills a wide slide.
          const c = { x: mx + (s * h * (A.y - B.y)) / d, y: my + (s * h * (B.x - A.x)) / d, r }
          if (hits(c)) continue
          if (!best || Math.hypot(c.x, c.y * 1.7) < Math.hypot(best.x, best.y * 1.7)) best = c
        }
      }
    out.push(best ?? { x: 0, y: 1e3, r })
  })
  return out
}

/** Packed bubbles sized by value: shares at a glance, no axis. Big bubbles carry their label inside. */
export function BubbleCluster({ kicker, title, lead, source, hint, items, unit = '', decimals = 0, focus, notes }: BubbleClusterProps) {
  const sorted = [...items].sort((a, b) => b.value - a.value)
  const fx = focus ?? sorted[0]?.name
  const max = sorted[0]?.value || 1
  const placed = pack(sorted.map((it) => Math.sqrt(it.value / max) * 100))
  const x0 = Math.min(...placed.map((p) => p.x - p.r))
  const x1 = Math.max(...placed.map((p) => p.x + p.r))
  const y0 = Math.min(...placed.map((p) => p.y - p.r))
  const y1 = Math.max(...placed.map((p) => p.y + p.r))
  // Plot box in u: fit the cluster into 1100 × 600.
  const W = 1100
  const H = 600
  const s = Math.min(W / (x1 - x0), H / (y1 - y0))
  const ox = (W - (x1 - x0) * s) / 2
  const oy = (H - (y1 - y0) * s) / 2
  return (
    <section className="slide">
      <Hint id="cluster">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className={`cluster${notes ? ' has-notes' : ''}`}>
          <Reveal i={3} className="cluster__plot">
            {sorted.map((it, i) => {
              const p = placed[i]
              const r = p.r * s
              const label = r >= 64
              return (
                <div
                  key={it.name}
                  className={`cluster__b${it.name === fx ? ' is-focus' : ''}${label ? '' : ' is-small'}`}
                  style={vars({ '--x': (p.x - x0) * s + ox, '--y': (p.y - y0) * s + oy, '--d': r * 2, '--k': i })}
                >
                  {label ? (
                    <span>
                      <em>{it.name}</em>
                      <b>
                        {fmt(it.value, decimals)}
                        {unit && <small>{unit}</small>}
                      </b>
                    </span>
                  ) : (
                    <span className="cluster__tag">{it.name}</span>
                  )}
                </div>
              )
            })}
          </Reveal>
          {notes && (
            <dl className="cluster__notes">
              {notes.map((n, i) => (
                <Reveal key={n.key} build i={i + 6}>
                  <dt>{n.key}</dt>
                  <dd>{n.text}</dd>
                </Reveal>
              ))}
            </dl>
          )}
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
