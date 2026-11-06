import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'
import { sqlLine } from './code'

export interface SeqEvent {
  /** Lane index (0-based). */
  lane: number
  /** Statement or action, ≤ 30 characters. */
  text: string
  /** Small status line, ≤ 12 CJK characters. */
  note?: string
  /** 'wait' draws a dashed blocked marker; 'ok' the accent. */
  kind?: 'wait' | 'ok'
}

export interface SessionSequenceProps extends SlideBase {
  /** 2–3 lane names, ≤ 10 CJK characters each. */
  lanes: string[]
  /** 3–7 events in time order; each is a build step. */
  events: SeqEvent[]
  /** Time axis label, ≤ 4 CJK characters. */
  axis?: string
}

/** Sequence diagram: concurrent sessions as columns, statements in time order, waits marked. One event per build step. */
export function SessionSequence({ kicker, title, lead, source, hint, lanes, events, axis = '时间' }: SessionSequenceProps) {
  return (
    <section className="slide">
      <Hint id="sessionseq">{hint}</Hint>
      <div className="frame t3">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="t3-sq" style={vars({ '--n': lanes.length })}>
          <div className="t3-sq__heads">
            <span className="t3-sq__axis">{axis} ↓</span>
            {lanes.map((l) => (
              <b key={l}>{l}</b>
            ))}
          </div>
          <div className="t3-sq__body">
            <span className="t3-sq__rail" aria-hidden />
            {lanes.map((_, i) => (
              <span key={i} className="t3-sq__life" style={vars({ '--c': i })} aria-hidden />
            ))}
            {events.map((e, i) => (
              <div key={i} className={`t3-sq__ev${e.kind ? ` is-${e.kind}` : ''}`} style={vars({ '--c': e.lane })} data-build>
                <span className="t3-sq__t">t{i + 1}</span>
                <div className="t3-sq__box">
                  <code>{sqlLine(e.text)}</code>
                  {e.note && <small>{e.note}</small>}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
