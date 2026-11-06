import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface BeamNode {
  /** ≤ 10 CJK characters or ≤ 18 Latin characters. */
  label: string
  /** ≤ 14 CJK characters. */
  sub?: string
}

export interface BeamFlowProps extends SlideBase {
  /** 2–4 nodes on the left. */
  inputs: BeamNode[]
  /** The centre node. */
  hub: BeamNode
  /** 2–4 nodes on the right. */
  outputs: BeamNode[]
  /** Column captions [left, right], ≤ 8 CJK characters each. */
  heads?: [string, string]
}

const W = 1776
const H = 520
const NW = 400

function ys(n: number) {
  return Array.from({ length: n }, (_, i) => ((i + 0.5) / n) * H)
}

/** Inputs flow into a hub and out to outputs along curved lines with a light pulse travelling on them. Build: inputs, hub, outputs. */
export function BeamFlow({ kicker, title, lead, source, hint, inputs, hub, outputs, heads }: BeamFlowProps) {
  const cx = W / 2
  const hubW = 360
  const curve = (x1: number, y1: number, x2: number, y2: number) => {
    const m = (x1 + x2) / 2
    return `M${x1} ${y1} C${m} ${y1} ${m} ${y2} ${x2} ${y2}`
  }
  const inY = ys(inputs.length)
  const outY = ys(outputs.length)
  const node = (n: BeamNode, cls = '') => (
    <div className={`t3-bf__node ${cls}`}>
      <b>{n.label}</b>
      {n.sub && <small>{n.sub}</small>}
    </div>
  )
  return (
    <section className="slide">
      <Hint id="beamflow">{hint}</Hint>
      <div className="frame t3">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="t3-bf">
          {heads && (
            <div className="t3-bf__heads">
              <span>{heads[0]}</span>
              <span>{heads[1]}</span>
            </div>
          )}
          <div className="t3-bf__plot">
            <svg viewBox={`0 0 ${W} ${H}`} aria-hidden data-build="in">
              {inY.map((y, i) => (
                <g key={i} style={vars({ '--k': i })}>
                  <path className="t3-bf__wire" d={curve(NW, y, cx - hubW / 2, H / 2)} />
                  <path className="t3-bf__pulse" d={curve(NW, y, cx - hubW / 2, H / 2)} pathLength={100} />
                </g>
              ))}
            </svg>
            <div className="t3-bf__col is-in" data-build="in">
              {inputs.map((n, i) => (
                <div key={i} className="t3-bf__slot" style={vars({ '--y': inY[i] })}>
                  {node(n)}
                </div>
              ))}
            </div>
            <div className="t3-bf__slot t3-bf__hub" style={vars({ '--y': H / 2 })} data-build="hub">
              {node(hub, 'is-hub')}
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} aria-hidden data-build="out">
              {outY.map((y, i) => (
                <g key={i} style={vars({ '--k': i + 2 })}>
                  <path className="t3-bf__wire" d={curve(cx + hubW / 2, H / 2, W - NW, y)} />
                  <path className="t3-bf__pulse" d={curve(cx + hubW / 2, H / 2, W - NW, y)} pathLength={100} />
                </g>
              ))}
            </svg>
            <div className="t3-bf__col is-out" data-build="out">
              {outputs.map((n, i) => (
                <div key={i} className="t3-bf__slot" style={vars({ '--y': outY[i] })}>
                  {node(n)}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
