import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface LaneStep {
  /** Index into `lanes`. */
  lane: number
  /** ≤ 10 CJK characters. */
  text: string
}

export interface SwimlaneProps extends SlideBase {
  /** 2–4 roles, each ≤ 6 CJK characters. */
  lanes: string[]
  /** 4–8 steps in order; each takes the next column, arrows join them in turn. */
  steps: LaneStep[]
}

// Geometry of the lane area, in u.
const W = 1556
const H = 560
const BW = 168

/** A flow split into swimlanes: who does each step, and where the work changes hands. */
export function Swimlane({ kicker, title, lead, source, hint, lanes, steps }: SwimlaneProps) {
  const L = lanes.length
  const C = steps.length
  const cx = (c: number) => ((c + 0.5) * W) / C
  const cy = (l: number) => ((l + 0.5) * H) / L
  const paths = steps.slice(1).map((s, k) => {
    const a = steps[k]
    const x1 = cx(k) + BW / 2
    const x2 = cx(k + 1) - BW / 2 - 6
    const y1 = cy(a.lane)
    const y2 = cy(s.lane)
    if (y1 === y2) return `M${x1} ${y1}H${x2}`
    const mx = (x1 + x2) / 2
    return `M${x1} ${y1}H${mx - 14}Q${mx} ${y1} ${mx} ${y1 + Math.sign(y2 - y1) * 14}V${y2 - Math.sign(y2 - y1) * 14}Q${mx} ${y2} ${mx + 14} ${y2}H${x2}`
  })
  return (
    <section className="slide">
      <Hint id="swimlane">{hint}</Hint>
      <div className="frame s-swim">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="swim" style={vars({ '--L': L })}>
          {lanes.map((name, l) => (
            <div key={name} className="swim__lane" style={vars({ '--l': l })}>
              <b>{name}</b>
            </div>
          ))}
          <div className="swim__area">
            <svg viewBox={`0 0 ${W} ${H}`} aria-hidden>
              <defs>
                <marker id="swim-arrow" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M0 0L10 5L0 10Z" />
                </marker>
              </defs>
              {paths.map((d, k) => (
                <path key={k} d={d} markerEnd="url(#swim-arrow)" />
              ))}
            </svg>
            {steps.map((s, c) => (
              <Reveal
                key={s.text}
                build
                i={3 + c * 0.3}
                className={`swim__step${s.lane !== steps[c - 1]?.lane && c > 0 ? ' swim__step--handoff' : ''}`}
                style={vars({ left: `${(cx(c) / W) * 100}%`, top: `${(cy(s.lane) / H) * 100}%` })}
              >
                <span>{String(c + 1).padStart(2, '0')}</span>
                {s.text}
              </Reveal>
            ))}
          </div>
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
