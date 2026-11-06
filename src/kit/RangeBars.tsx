import { Kicker, Reveal, Source } from '../deck/primitives'
import { Hint, Lines, vars, type SlideBase } from './shared'

export interface RangeRow {
  /** ≤ 8 characters, e.g. 'N = 30'. */
  label: string
  /** Point estimate. */
  value: number
  low: number
  high: number
  /** Right-hand label, ≤ 8 characters, e.g. '±9'. Defaults to low–high. */
  note?: string
}

export interface RangeBarsProps extends SlideBase {
  /** 3–6 rows. */
  rows: RangeRow[]
  /** Axis extent and tick values. */
  axis: { from: number; to: number; ticks: number[] }
  /** Appended to tick labels, e.g. '%'. */
  unit?: string
  /** Index of the row to highlight, e.g. the recommended minimum. */
  focus?: number
  /** Pill on the focused row, ≤ 8 CJK characters. */
  focusLabel?: string
  /** Optional block in the left column above the source, e.g. how to write the result. */
  example?: { label: string; text: string }
}

/** Estimates with their uncertainty: each row a range around a point. Narrower is better. */
export function RangeBars({ kicker, title, lead, source, hint, rows, axis, unit = '', focus, focusLabel, example }: RangeBarsProps) {
  const x = (v: number) => (v - axis.from) / (axis.to - axis.from)
  return (
    <section className="slide">
      <Hint id="range">{hint}</Hint>
      <div className="frame frame--split">
        <div className="s-copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="s-lead">{lead}</p>
            </Reveal>
          )}
          <Reveal i={rows.length + 4} className="s-foot">
            {example && (
              <div className="range__example">
                <span>{example.label}</span>
                <code>{example.text}</code>
              </div>
            )}
            {source && <Source>{source}</Source>}
          </Reveal>
        </div>
        <div className="range">
          {rows.map((r, i) => (
            <Reveal key={r.label} build i={i + 2} className={`range__row${i === focus ? ' is-focus' : ''}`}>
              <span className="range__label">
                {r.label}
                {i === focus && focusLabel && <span className="pill">{focusLabel}</span>}
              </span>
              <span className="range__track" aria-hidden>
                <span className="range__span" style={vars({ '--lo': x(r.low), '--hi': x(r.high), '--i': i })} />
                <span className="range__dot" style={vars({ '--x': x(r.value) })} />
              </span>
              <span className="range__note">{r.note ?? `${r.low}–${r.high}`}</span>
            </Reveal>
          ))}
          <Reveal i={rows.length + 2} className="range__axis">
            <span />
            <span className="range__ticks">
              {axis.ticks.map((t) => (
                <span key={t} style={vars({ '--x': x(t) })}>
                  {t}
                  {unit}
                </span>
              ))}
            </span>
            <span />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
