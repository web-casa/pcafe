import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface OutageSpan {
  /** 'HH:MM'. */
  from: string
  to: string
  state: 'down' | 'degraded'
}

export interface OutageRow {
  /** ≤ 10 CJK characters. */
  name: string
  spans: OutageSpan[]
  /** ≤ 20 CJK characters. */
  note?: string
}

export interface OutageBoardProps extends SlideBase {
  /** Window shown, 'HH:MM' (same day). */
  from: string
  to: string
  /** 3–8 'HH:MM' axis ticks. */
  ticks: string[]
  /** 2–6 services. With build, one row per step. */
  rows: OutageRow[]
  /** 0–3 moments drawn across all rows: at 'HH:MM', label ≤ 10 CJK characters. */
  events?: { at: string; label: string }[]
  /** Time-zone label, e.g. 'UTC'. */
  zone?: string
  /** Legend texts, ≤ 6 CJK characters each. */
  legend?: { down: string; degraded: string }
}

const min = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

/** A status-page style board: each service is a time track with outage and degraded segments; key moments cut across. */
export function OutageBoard({ kicker, title, lead, source, hint, from, to, ticks, rows, events = [], zone, legend = { down: '中断', degraded: '部分受影响' } }: OutageBoardProps) {
  const a = min(from)
  const span = min(to) - a || 1
  const pos = (t: string) => Math.max(0, Math.min(1, (min(t) - a) / span))
  return (
    <section className="slide">
      <Hint id="outage">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="v33-out">
          <div className="v33-out__legend">
            <span className="is-down">{legend.down}</span>
            <span className="is-degraded">{legend.degraded}</span>
            {zone && <em>{zone}</em>}
          </div>
          <div className="v33-out__body">
            <div className="v33-out__events" aria-hidden>
              {events.map((e) => (
                <i key={e.at} style={vars({ '--x': pos(e.at) })} />
              ))}
            </div>
            <div className="v33-out__evl">
              {events.map((e) => (
                <span key={e.at} style={vars({ '--x': pos(e.at) })}>
                  <b>{e.at}</b> {e.label}
                </span>
              ))}
            </div>
            {rows.map((r) => (
              <div key={r.name} className="v33-out__row" data-build="">
                <div className="v33-out__name">
                  <h3>{r.name}</h3>
                  {r.note && <p>{r.note}</p>}
                </div>
                <div className="v33-out__track">
                  {r.spans.map((s, k) => (
                    <i key={k} className={`is-${s.state}`} aria-hidden style={vars({ '--a': pos(s.from), '--b': pos(s.to) })} />
                  ))}
                </div>
              </div>
            ))}
            <div className="v33-out__axis">
              {ticks.map((t) => (
                <span key={t} style={vars({ '--x': pos(t) })}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
