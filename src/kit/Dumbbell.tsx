import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface DumbbellRow {
  /** ≤ 8 CJK characters. */
  label: string
  /** Muted second line, ≤ 14 characters. */
  sub?: string
  a: number
  b: number
}

export interface DumbbellProps extends SlideBase {
  /** Names of the two measurements: a (hollow ink dot) and b (solid accent dot). ≤ 8 CJK characters each. */
  legend: [a: string, b: string]
  /** 2–5 rows. */
  rows: DumbbellRow[]
  /** Axis maximum. Defaults to 100. */
  max?: number
  /** Appended to values, e.g. '%'. */
  unit?: string
  /** One muted line under the chart, ≤ 60 CJK characters. */
  footnote?: string
}

/** Two measurements of the same thing, per row, joined by a line: the length of the line is the story. */
export function Dumbbell({ kicker, title, lead, source, hint, legend, rows, max = 100, unit = '%', footnote }: DumbbellProps) {
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(t * max))
  return (
    <section className="slide">
      <Hint id="dumbbell">{hint}</Hint>
      <div className="frame s-dumb">
        <SlideHead
          kicker={kicker}
          title={title}
          lead={lead}
          aside={
            <ul className="dumb__legend">
              <li className="is-a">{legend[0]}</li>
              <li className="is-b">{legend[1]}</li>
            </ul>
          }
        />
        <div className="dumb">
          <Reveal i={3} className="dumb__axis">
            <span />
            <span className="dumb__ticks">
              {ticks.map((t) => (
                <span key={t} style={vars({ '--x': t / max })}>
                  {t}
                  {t === max ? unit : ''}
                </span>
              ))}
            </span>
            <span>差值</span>
          </Reveal>
          {rows.map((r, i) => {
            const lo = Math.min(r.a, r.b) / max
            const hi = Math.max(r.a, r.b) / max
            const gap = Math.abs(r.b - r.a)
            return (
              <Reveal key={r.label} build i={i + 4} className="dumb__row">
                <span className="dumb__label">
                  <b>{r.label}</b>
                  {r.sub && <small>{r.sub}</small>}
                </span>
                <span className="dumb__track">
                  {ticks.map((t) => (
                    <i key={t} className="dumb__grid" style={vars({ '--x': t / max })} />
                  ))}
                  <span className={`dumb__line${r.b < r.a ? ' is-rev' : ''}`} style={vars({ '--lo': lo, '--hi': hi, '--i': i })} />
                  <span className="dumb__dot is-a" style={vars({ '--x': r.a / max, '--i': i })}>
                    <em className={r.a <= r.b ? 'is-left' : 'is-right'}>
                      {r.a}
                      {unit}
                    </em>
                  </span>
                  <span className="dumb__dot is-b" style={vars({ '--x': r.b / max, '--i': i })}>
                    <em className={r.b < r.a ? 'is-left' : 'is-right'}>
                      {r.b}
                      {unit}
                    </em>
                  </span>
                </span>
                <span className="dumb__gap">
                  {gap}
                  <small>{unit === '%' ? ' 个百分点' : unit}</small>
                </span>
              </Reveal>
            )
          })}
        </div>
        {footnote && (
          <Reveal i={rows.length + 5} className="mx__foot">
            {footnote}
          </Reveal>
        )}
        <SlideFoot source={source} i={rows.length + 6} />
      </div>
    </section>
  )
}
