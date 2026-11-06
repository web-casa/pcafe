import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface HeatRow {
  /** ≤ 8 CJK characters. */
  label: string
  /** Muted line under the label, ≤ 10 characters. */
  sub?: string
  /** One value per column; null = no data yet (e.g. the triangle of a cohort table). */
  values: (number | null)[]
}

export interface HeatmapProps extends SlideBase {
  /** 3–8 column labels, ≤ 6 characters each. */
  cols: string[]
  /** 3–7 rows. */
  rows: HeatRow[]
  /** Suffix in each cell, e.g. '%'. */
  unit?: string
  /** Decimal places. Default 0. */
  digits?: number
  /** Value that maps to full colour. Default: the largest value. */
  max?: number
  /** Value that maps to the palest colour. Default: the smallest value. */
  min?: number
  /** Scale labels under the grid, e.g. ['低', '高']. */
  scale?: [string, string]
  /** Right-hand reading: 2–3 lines, key ≤ 8, text ≤ 30 CJK characters. */
  notes?: { key: string; text: string }[]
}

/** A table whose cells are shaded by value: cohort retention, channel × stage conversion, usage by segment. */
export function Heatmap({ kicker, title, lead, source, hint, cols, rows, unit = '', digits = 0, max, min, scale = ['低', '高'], notes }: HeatmapProps) {
  const vals = rows.flatMap((r) => r.values.filter((v): v is number => v !== null))
  const hi = max ?? Math.max(...vals)
  const lo = min ?? Math.min(...vals)
  const norm = (v: number) => Math.max(0, Math.min(1, (v - lo) / (hi - lo || 1)))
  return (
    <section className="slide">
      <Hint id="heatmap">{hint}</Hint>
      <div className="frame s-heat">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className={`heat__body${notes ? ' has-notes' : ''}`}>
          <Reveal i={3} className="heat" y={16} style={vars({ '--cols': cols.length })}>
            <div className="heat__row heat__row--head">
              <span />
              {cols.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            {rows.map((r, ri) => (
              <div key={r.label} className="heat__row" data-build>
                <span className="heat__label">
                  <b>{r.label}</b>
                  {r.sub && <small>{r.sub}</small>}
                </span>
                {r.values.map((v, ci) =>
                  v === null ? (
                    <span key={ci} className="heat__cell is-empty" />
                  ) : (
                    <span
                      key={ci}
                      className={`heat__cell${norm(v) > 0.55 ? ' is-strong' : ''}`}
                      style={vars({ '--a': (0.07 + norm(v) * 0.9).toFixed(3), animationDelay: `${420 + (ri + ci) * 45}ms` })}
                    >
                      {v.toFixed(digits)}
                      <small>{unit}</small>
                    </span>
                  ),
                )}
              </div>
            ))}
            <div className="heat__scale">
              <span>{scale[0]}</span>
              <i aria-hidden />
              <span>{scale[1]}</span>
            </div>
          </Reveal>
          {notes && (
            <dl className="heat__notes">
              {notes.map((n, i) => (
                <Reveal key={n.key} i={i + 6}>
                  <dt>{n.key}</dt>
                  <dd>{n.text}</dd>
                </Reveal>
              ))}
            </dl>
          )}
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
