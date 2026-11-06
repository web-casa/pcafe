import { Kicker, Reveal, Source } from '../deck/primitives'
import { Hint, Lines, vars, type SlideBase } from './shared'

export interface DeltaRow {
  /** ≤ 10 CJK characters. */
  label: string
  /** Muted second line, ≤ 14 characters. */
  sub?: string
  /** Signed change. Positive bars grow right in accent, negative bars grow left in ink. */
  value: number
}

export interface DeltaBarsProps extends SlideBase {
  /** 2–6 rows. */
  rows: DeltaRow[]
  /** Appended to every value, e.g. '%' or ' pp'. ≤ 4 characters. */
  unit?: string
  /** Axis half-width. Defaults to the largest |value| rounded up. */
  scale?: number
  /** Axis end labels, e.g. ['引用减少', '引用增加']. ≤ 6 CJK characters each. */
  ends?: [negative: string, positive: string]
  /** Optional takeaway in the left column. */
  pull?: { figure: string; text: string }
}

const fmt = (v: number, unit = '') => `${v > 0 ? '+' : v < 0 ? '−' : '±'}${Math.abs(v)}${unit}`

/** Signed changes around a zero line: what went up, what went down, by how much. */
export function DeltaBars({ kicker, title, lead, source, hint, rows, unit = '', scale, ends, pull }: DeltaBarsProps) {
  const max = scale ?? Math.ceil(Math.max(...rows.map((r) => Math.abs(r.value))))
  return (
    <section className="slide">
      <Hint id="delta">{hint}</Hint>
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
          <Reveal i={6} className="s-foot">
            {pull && (
              <p className="pull">
                <em>{pull.figure}</em>
                <span>{pull.text}</span>
              </p>
            )}
            {source && <Source>{source}</Source>}
          </Reveal>
        </div>
        <div className="delta">
          <Reveal i={2} className="delta__axis">
            <span />
            <span>{ends?.[0] ?? fmt(-max, unit)}</span>
            <span>0</span>
            <span>{ends?.[1] ?? fmt(max, unit)}</span>
          </Reveal>
          {rows.map((r, i) => {
            const p = Math.min(1, Math.abs(r.value) / max)
            const dir = r.value >= 0 ? 'is-up' : 'is-down'
            return (
              <Reveal key={r.label} build i={i + 3} className={`delta__row ${dir}`}>
                <span className="delta__label">
                  <b>{r.label}</b>
                  {r.sub && <small>{r.sub}</small>}
                </span>
                <span className="delta__track" aria-hidden>
                  <span className="delta__bar" style={vars({ '--p': p, '--i': i })} />
                  <span className="delta__value" style={vars({ '--p': p })}>
                    {fmt(r.value, unit)}
                  </span>
                </span>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
