import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'

export interface ClockWindow {
  /** Start hour, 0–24. */
  from: number
  /** End hour, 0–24, greater than from. */
  to: number
}

export interface PeakClockProps extends SlideBase {
  /** 1–4 highlighted windows (e.g. peak hours). */
  windows: ClockWindow[]
  /** Centre label, ≤ 8 characters, e.g. 'UTC'. */
  zone: string
  /** Name of the highlighted windows, ≤ 6 CJK characters. Default '高峰'. */
  onLabel?: string
  /** Name of the rest, ≤ 6 CJK characters. Default '其余时段'. */
  offLabel?: string
  /** 2–4 reading notes: title ≤ 10, body ≤ 40 CJK characters. Each is a build step. */
  notes: { title: string; body: string }[]
}

const R = 150
const pt = (h: number, r = R) => {
  const a = (h / 24) * 2 * Math.PI - Math.PI / 2
  return [200 + r * Math.cos(a), 200 + r * Math.sin(a)]
}
const arc = (a: number, b: number) => {
  const [x1, y1] = pt(a)
  const [x2, y2] = pt(b)
  return `M${x1} ${y1} A${R} ${R} 0 ${b - a > 12 ? 1 : 0} 1 ${x2} ${y2}`
}

/** A 24-hour ring with highlighted windows (peak hours, maintenance slots) and reading notes beside it. */
export function PeakClock({ kicker, title, lead, source, hint, windows, zone, onLabel = '高峰', offLabel = '其余时段', notes }: PeakClockProps) {
  return (
    <section className="slide">
      <Hint id="clock">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="pclk">
          <figure className="pclk__fig">
            <svg viewBox="0 0 400 400" aria-hidden>
              <circle className="pclk__ring" cx={200} cy={200} r={R} />
              {windows.map((w) => (
                <path key={w.from} className="pclk__win" d={arc(w.from, w.to)} />
              ))}
              {Array.from({ length: 24 }, (_, h) => {
                const [x1, y1] = pt(h, R - 34)
                const [x2, y2] = pt(h, R - (h % 6 ? 42 : 50))
                return <line key={h} className="pclk__tick" x1={x1} y1={y1} x2={x2} y2={y2} />
              })}
            </svg>
            {[0, 6, 12, 18].map((h) => {
              const [x, y] = pt(h, R + 40)
              return (
                <span key={h} className="pclk__hour" style={{ left: `${(x / 400) * 100}%`, top: `${(y / 400) * 100}%` }}>
                  {String(h).padStart(2, '0')}:00
                </span>
              )
            })}
            <p className="pclk__zone">{zone}</p>
          </figure>
          <div className="pclk__side">
            <p className="pclk__legend">
              <span>
                <i className="is-on" aria-hidden />
                {onLabel}
              </span>
              <span>
                <i aria-hidden />
                {offLabel}
              </span>
            </p>
            <dl className="pclk__notes">
              {notes.map((n) => (
                <div key={n.title} data-build>
                  <dt>{n.title}</dt>
                  <dd>{n.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
