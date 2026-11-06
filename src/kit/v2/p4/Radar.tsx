import { Reveal } from '../../../deck/primitives'
import { fmt } from '../../chart-util'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface RadarSeries {
  /** ≤ 8 CJK characters. */
  name: string
  /** One value per axis, between 0 and `max`. */
  values: number[]
}

export interface RadarProps extends SlideBase {
  /** 5–8 axes, ≤ 6 CJK characters each. */
  axes: string[]
  /** 1–2 series. The first is the accent; the second is a grey outline (a build step). */
  series: RadarSeries[]
  /** Outer ring value. Default: the largest value rounded up. */
  max?: number
  unit?: string
  decimals?: number
  /** Right-hand reading: 2–3 lines, key ≤ 8, text ≤ 30 CJK characters. */
  notes?: { key: string; text: string }[]
}

const R = 250
const C = 300

/** A spider chart for a profile across 5–8 dimensions; a second series overlays for comparison. */
export function Radar({ kicker, title, lead, source, hint, axes, series, max, unit = '', decimals = 0, notes }: RadarProps) {
  const top = max ?? Math.ceil(Math.max(...series.flatMap((s) => s.values)) / 10) * 10
  const n = axes.length
  const pt = (i: number, f: number) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2
    return [C + Math.cos(a) * R * f, C + Math.sin(a) * R * f]
  }
  const poly = (vals: number[]) => vals.map((v, i) => pt(i, Math.min(1, v / top)).join(',')).join(' ')
  const [a, b] = series
  return (
    <section className="slide">
      <Hint id="radar">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="radar">
          <Reveal i={3} className="radar__plot">
            <svg viewBox="0 0 600 600" aria-hidden className="radar__grid">
              {[0.25, 0.5, 0.75, 1].map((f) => (
                <polygon key={f} points={axes.map((_, i) => pt(i, f).join(',')).join(' ')} />
              ))}
              {axes.map((_, i) => {
                const [x, y] = pt(i, 1)
                return <line key={i} x1={C} y1={C} x2={x} y2={y} />
              })}
            </svg>
            {b && (
              <div className="radar__layer is-b" data-build="radar-b">
                <svg viewBox="0 0 600 600" aria-hidden>
                  <polygon points={poly(b.values)} />
                </svg>
              </div>
            )}
            <div className="radar__layer is-a">
              <svg viewBox="0 0 600 600" aria-hidden>
                <polygon points={poly(a.values)} />
                {a.values.map((v, i) => {
                  const [x, y] = pt(i, Math.min(1, v / top))
                  return <circle key={i} cx={x} cy={y} r={7} />
                })}
              </svg>
            </div>
            {axes.map((ax, i) => {
              const [x, y] = pt(i, 1.2)
              return (
                <span key={ax} className="radar__axis" style={vars({ '--x': x / 600, '--y': y / 600 })}>
                  <em>{ax}</em>
                  <b>
                    {fmt(a.values[i], decimals)}
                    {unit}
                    {b && <i data-build="radar-b"> / {fmt(b.values[i], decimals)}{unit}</i>}
                  </b>
                </span>
              )
            })}
          </Reveal>
          <div className="radar__side">
            <Reveal i={4} className="radar__legend">
              <span className="is-a">{a.name}</span>
              {b && (
                <span className="is-b" data-build="radar-b">
                  {b.name}
                </span>
              )}
            </Reveal>
            {notes && (
              <dl className="radar__notes">
                {notes.map((nt, i) => (
                  <Reveal key={nt.key} build i={i + 6}>
                    <dt>{nt.key}</dt>
                    <dd>{nt.text}</dd>
                  </Reveal>
                ))}
              </dl>
            )}
          </div>
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
