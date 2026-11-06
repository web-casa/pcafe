import { Reveal } from '../../../deck/primitives'
import { fmt } from '../../chart-util'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'
import { SHADES } from './util'

export interface SankeyNode {
  id: string
  /** ≤ 6 CJK characters. */
  label: string
}

export interface SankeyLink {
  from: string
  to: string
  value: number
}

export interface SankeyProps extends SlideBase {
  /** 4–14 nodes over 2–4 columns; columns follow the links (sources left). */
  nodes: SankeyNode[]
  links: SankeyLink[]
  unit?: string
  decimals?: number
  /** Node whose flows are drawn in the accent. */
  focus?: string
}

const W = 1600
const H = 600
const NODE = 22

/** Flows between stages, band width = value. With build, each column of flows arrives in turn. */
export function Sankey({ kicker, title, lead, source, hint, nodes, links, unit = '', decimals = 0, focus }: SankeyProps) {
  // Column = longest path from a source.
  const col = new Map(nodes.map((n) => [n.id, 0]))
  for (let pass = 0; pass < nodes.length; pass++) for (const l of links) col.set(l.to, Math.max(col.get(l.to)!, col.get(l.from)! + 1))
  const cols = Math.max(...col.values()) + 1
  const inV = (id: string) => links.filter((l) => l.to === id).reduce((n, l) => n + l.value, 0)
  const outV = (id: string) => links.filter((l) => l.from === id).reduce((n, l) => n + l.value, 0)
  const val = new Map(nodes.map((n) => [n.id, Math.max(inV(n.id), outV(n.id))]))
  const byCol = Array.from({ length: cols }, (_, c) => nodes.filter((n) => col.get(n.id) === c))
  const gap = 18
  const scale = Math.min(...byCol.map((ns) => (H - gap * (ns.length - 1)) / ns.reduce((n, x) => n + val.get(x.id)!, 0)))
  const box = new Map<string, { x: number; y: number; h: number }>()
  byCol.forEach((ns, c) => {
    const total = ns.reduce((n, x) => n + val.get(x.id)! * scale, 0) + gap * (ns.length - 1)
    let y = (H - total) / 2
    ns.forEach((n) => {
      const h = val.get(n.id)! * scale
      box.set(n.id, { x: (c * (W - NODE)) / (cols - 1), y, h })
      y += h + gap
    })
  })
  // Band offsets inside each node, in link order.
  const outAt = new Map<string, number>()
  const inAt = new Map<string, number>()
  const bands = links.map((l) => {
    const a = box.get(l.from)!
    const b = box.get(l.to)!
    const h = l.value * scale
    const y0 = a.y + (outAt.get(l.from) ?? 0)
    const y1 = b.y + (inAt.get(l.to) ?? 0)
    outAt.set(l.from, (outAt.get(l.from) ?? 0) + h)
    inAt.set(l.to, (inAt.get(l.to) ?? 0) + h)
    const x0 = a.x + NODE
    const x1 = b.x
    const m = (x0 + x1) / 2
    const d = `M${x0},${y0} C${m},${y0} ${m},${y1} ${x1},${y1} L${x1},${y1 + h} C${m},${y1 + h} ${m},${y0 + h} ${x0},${y0 + h} Z`
    return { l, d, c: col.get(l.to)! }
  })
  const label = (v: number) => `${fmt(v, decimals)}${unit}`
  const hot = (l: SankeyLink) => focus !== undefined && (l.from === focus || l.to === focus)
  return (
    <section className="slide">
      <Hint id="sankey">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className={`sankey${focus ? ' has-focus' : ''}`} style={vars({ '--cols': cols })}>
          {byCol.map((ns, c) => (
            <div key={c} className="sankey__col" data-build={c ? `sankey-${c}` : undefined}>
              {c > 0 && (
                <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
                  {bands
                    .filter((b) => b.c === c)
                    .map((b) => (
                      <path key={`${b.l.from}-${b.l.to}`} d={b.d} className={hot(b.l) ? 'is-hot' : undefined} />
                    ))}
                </svg>
              )}
              {ns.map((n, i) => {
                const b = box.get(n.id)!
                const side = c === cols - 1 ? 'is-end' : c === 0 ? 'is-start' : 'is-mid'
                return (
                  <div key={n.id} className={`sankey__node ${side}${n.id === focus ? ' is-focus' : ''}`} style={vars({ '--x': b.x / W, '--y': b.y / H, '--h': b.h / H, '--c': SHADES[i % 4] })}>
                    <span>
                      <em>{n.label}</em>
                      <b>{label(val.get(n.id)!)}</b>
                    </span>
                  </div>
                )
              })}
            </div>
          ))}
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
