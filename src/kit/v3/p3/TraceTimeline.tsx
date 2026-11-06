import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface TraceEvent {
  /** ≤ 10 characters, e.g. '2010.09'. */
  date: string
  /** ≤ 10 CJK characters. */
  title: string
  /** ≤ 26 CJK characters. */
  note?: string
}

export interface TraceTimelineProps extends SlideBase {
  /** 4–7 events, oldest first; labels alternate above and below. With build, one per step. */
  events: TraceEvent[]
}

const W = 1600
const H = 120

/** History on a glowing signal trace: a blip at each event, a light pulse running along the wire. */
export function TraceTimeline({ kicker, title, lead, source, hint, events }: TraceTimelineProps) {
  const n = events.length
  const xs = events.map((_, i) => ((i + 0.5) / n) * W)
  let d = `M0,${H / 2}`
  xs.forEach((x, i) => {
    const up = i % 2 === 0 ? -1 : 1
    d += `L${x - 34},${H / 2}L${x - 14},${H / 2 + up * -14}L${x},${H / 2 + up * 46}L${x + 14},${H / 2 + up * -10}L${x + 34},${H / 2}`
  })
  d += `L${W},${H / 2}`
  return (
    <section className="slide">
      <Hint id="trace">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="v33-trace" style={vars({ '--n': n })}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="v33-trace__svg" aria-hidden>
            <path d={d} className="v33-trace__base" />
            <path d={d} pathLength={1} className="v33-trace__pulse" />
          </svg>
          {events.map((e, i) => (
            <div key={e.date + e.title} className={`v33-trace__ev ${i % 2 ? 'is-low' : 'is-high'}`} data-build="" style={vars({ '--x': xs[i] / W })}>
              <i aria-hidden />
              <div className="v33-trace__txt">
                <em>{e.date}</em>
                <h3>{e.title}</h3>
                {e.note && <p>{e.note}</p>}
              </div>
            </div>
          ))}
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
