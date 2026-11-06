import { Reveal } from '../deck/primitives'
import { fmt } from './chart-util'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface GaugeProps extends SlideBase {
  value: number
  max: number
  /** Marker on the arc, e.g. a goal. */
  target?: { value: number; label: string }
  /** Unit after the big value, ≤ 4 characters. */
  unit?: string
  decimals?: number
  /** Under the big value, ≤ 12 CJK characters. */
  label: string
  /** 2–3 supporting figures on the right: label ≤ 10, value ≤ 8 characters. */
  points?: { label: string; value: string }[]
}

// The arc runs 240°, from lower left round the top to lower right.
const SWEEP = 240
const R = 80
const polar = (deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180
  return [100 + R * Math.cos(a), 100 + R * Math.sin(a)] as const
}
const LEN = (R * SWEEP * Math.PI) / 180
const ARC = (() => {
  const [x0, y0] = polar(-SWEEP / 2)
  const [x1, y1] = polar(SWEEP / 2)
  return `M ${x0} ${y0} A ${R} ${R} 0 1 1 ${x1} ${y1}`
})()

/** One value against its maximum on a 240° dial, with an optional target tick. */
export function Gauge({ kicker, title, lead, source, hint, value, max, target, unit = '', decimals = 0, label, points = [] }: GaugeProps) {
  const p = Math.min(1, Math.max(0, value / max))
  const tAngle = target ? -SWEEP / 2 + Math.min(1, target.value / max) * SWEEP : 0
  return (
    <section className="slide">
      <Hint id="gauge">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className={`gauge${points.length ? '' : ' gauge--solo'}`}>
          <Reveal i={3} className="gauge__dial">
            <svg viewBox="0 0 200 175" aria-hidden>
              <path d={ARC} className="gauge__track" />
              <path d={ARC} className="gauge__fill" style={vars({ '--d': p * LEN, '--L': LEN })} />
              {target && (
                <g transform={`rotate(${tAngle} 100 100)`} className="gauge__target">
                  <line x1="100" y1={100 - R - 16} x2="100" y2={100 - R + 16} />
                </g>
              )}
            </svg>
            <div className="gauge__center">
              <b>
                {fmt(value, decimals)}
                <small>{unit}</small>
              </b>
              <span>{label}</span>
            </div>
            <span className="gauge__end gauge__end--min">0</span>
            <span className="gauge__end gauge__end--max">
              {fmt(max, decimals)}
              {unit}
            </span>
            {target && (
              <span className="gauge__tlabel" style={vars({ '--a': `${tAngle}deg` })}>
                <span>{target.label}</span>
              </span>
            )}
          </Reveal>
          {points.length > 0 && (
            <dl className="gauge__points">
              {points.map((pt, i) => (
                <Reveal key={pt.label} build i={4 + i * 0.5}>
                  <dt>{pt.label}</dt>
                  <dd>{pt.value}</dd>
                </Reveal>
              ))}
            </dl>
          )}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
