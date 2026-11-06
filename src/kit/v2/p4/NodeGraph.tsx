import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface GraphNode {
  id: string
  /** ≤ 6 CJK characters. */
  label: string
  /** Second line, ≤ 10 CJK characters. */
  sub?: string
  /** Manual position in % of the plot (0–100). Without it nodes sit on a ring around the hub. */
  x?: number
  y?: number
}

export interface GraphEdge {
  from: string
  to: string
  /** ≤ 6 CJK characters, drawn at the middle of the line. */
  label?: string
  /** Draw this edge in the accent. */
  strong?: boolean
}

export interface NodeGraphProps extends SlideBase {
  /** 4–10 nodes. The first is the hub (accent, centre) unless every node has x/y. */
  nodes: GraphNode[]
  /** ≤ 14 edges. */
  edges: GraphEdge[]
  /** Reading beside the graph, ≤ 60 CJK characters. */
  note?: string
}

const W = 1240
const H = 600

/** Nodes and the lines between them. With build, each outer node arrives with its edges. */
export function NodeGraph({ kicker, title, lead, source, hint, nodes, edges, note }: NodeGraphProps) {
  const manual = nodes.every((n) => n.x !== undefined && n.y !== undefined)
  const ring = nodes.slice(1)
  const pos = new Map<string, { x: number; y: number }>()
  nodes.forEach((n, i) => {
    if (manual) return pos.set(n.id, { x: (n.x! / 100) * W, y: (n.y! / 100) * H })
    if (i === 0) return pos.set(n.id, { x: W / 2, y: H / 2 })
    const a = -Math.PI / 2 + ((i - 1) / ring.length) * Math.PI * 2
    pos.set(n.id, { x: W / 2 + Math.cos(a) * W * 0.38, y: H / 2 + Math.sin(a) * H * 0.4 })
  })
  const hub = manual ? null : nodes[0]?.id
  // An edge appears with the later of its two nodes.
  const order = new Map(nodes.map((n, i) => [n.id, i]))
  const step = (e: GraphEdge) => nodes[Math.max(order.get(e.from) ?? 0, order.get(e.to) ?? 0)].id
  return (
    <section className="slide">
      <Hint id="graph">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className={`graph${note ? ' has-note' : ''}`}>
          <Reveal i={3} className="graph__plot">
            {[...edges].sort((p, q) => order.get(step(p))! - order.get(step(q))!).map((e) => {
              const a = pos.get(e.from)
              const b = pos.get(e.to)
              if (!a || !b) return null
              const id = step(e)
              return (
                <div key={`${e.from}-${e.to}`} className={`graph__edge${e.strong ? ' is-strong' : ''}`} data-build={id === hub ? undefined : id}>
                  <svg viewBox={`0 0 ${W} ${H}`} aria-hidden>
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                  </svg>
                  {e.label && (
                    <span style={vars({ '--x': (a.x + b.x) / 2, '--y': (a.y + b.y) / 2 })}>
                      {e.label}
                    </span>
                  )}
                </div>
              )
            })}
            {nodes.map((n, i) => {
              const p = pos.get(n.id)!
              return (
                <div
                  key={n.id}
                  className={`graph__node${n.id === hub ? ' is-hub' : ''}`}
                  style={vars({ '--x': p.x, '--y': p.y, '--k': i })}
                  data-build={n.id === hub ? undefined : n.id}
                >
                  <b>{n.label}</b>
                  {n.sub && <small>{n.sub}</small>}
                </div>
              )
            })}
          </Reveal>
          {note && (
            <Reveal i={6} className="chart-note graph__note">
              {note}
            </Reveal>
          )}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
