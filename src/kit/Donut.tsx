import { Reveal } from '../deck/primitives'
import { RAMP, fmt } from './chart-util'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface DonutSegment {
  /** ≤ 8 CJK characters. */
  label: string
  value: number
  /** Optional muted line, ≤ 16 CJK characters. */
  note?: string
}

export interface DonutProps extends SlideBase {
  /** 2–5 parts of one whole, largest first. */
  segments: DonutSegment[]
  /** Big figure in the hole: the total or the focus share, ≤ 6 characters. */
  center: { value: string; label: string }
  /** Unit after each legend value. */
  unit?: string
  decimals?: number
  /** Segment drawn in the accent; the rest are greys. Defaults to 0. */
  focus?: number
}

const R = 80
const C = 2 * Math.PI * R

/** One ring split into 2–5 parts, the focus part in the accent, with a legend of values and shares. */
export function Donut({ kicker, title, lead, source, hint, segments, center, unit = '', decimals = 0, focus = 0 }: DonutProps) {
  const total = segments.reduce((n, s) => n + s.value, 0) || 1
  // Greys follow the order given; the focus always takes the accent.
  const colour = (i: number) => (i === focus ? RAMP[0] : RAMP[1 + ((i < focus ? i : i - 1) % (RAMP.length - 1))])
  let at = 0
  return (
    <section className="slide">
      <Hint id="donut">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="donut">
          <Reveal i={3} className="donut__ring">
            <svg viewBox="0 0 200 200" aria-hidden>
              <circle cx="100" cy="100" r={R} className="donut__track" />
              {segments.map((s, i) => {
                const len = (s.value / total) * C
                const el = (
                  <circle
                    key={s.label}
                    cx="100"
                    cy="100"
                    r={R}
                    className={i === focus ? 'is-focus' : undefined}
                    style={vars({ '--c': colour(i), '--len': Math.max(0, len - 1.6), '--C': C, '--off': -at, '--k': i })}
                  />
                )
                at += len
                return el
              })}
            </svg>
            <div className="donut__center">
              <b>{center.value}</b>
              <span>{center.label}</span>
            </div>
          </Reveal>
          <ul className="donut__legend">
            {segments.map((s, i) => (
              <Reveal key={s.label} build i={4 + i * 0.5} className={`donut__row${i === focus ? ' is-focus' : ''}`} style={vars({ '--c': colour(i) })}>
                <i />
                <div>
                  <span>{s.label}</span>
                  {s.note && <em>{s.note}</em>}
                </div>
                <b>
                  {fmt(s.value, decimals)}
                  {unit}
                </b>
                <small>{Math.round((s.value / total) * 100)}%</small>
              </Reveal>
            ))}
          </ul>
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
