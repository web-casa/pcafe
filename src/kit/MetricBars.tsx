import { Kicker, Reveal, Source } from '../deck/primitives'
import { Hint, Lines, vars, type SlideBase } from './shared'

export interface MetricRow {
  label: string
  value: number
  /** Appended in grey, e.g. '+' for "more than", '%' or a unit. */
  suffix?: string
}

export interface MetricBarsProps extends SlideBase {
  /** 2–4 rows. Values up to 6 digits (they render at 92u). */
  rows: MetricRow[]
  /** Highlighted final row; bars and shares are measured against it. Without it, against the largest row. */
  total?: MetricRow
  /** Optional editorial takeaway in the left column, e.g. { figure: '1 / 5', text: '…' }. */
  pull?: { figure: string; text: string }
  /** Show the ≈% column. Turn off when rows are not parts of one whole. */
  shares?: boolean
}

/** Big numbers with proportional bars. Left: argument; right: the evidence. */
export function MetricBars({ kicker, title, lead, source, hint, rows, total, pull, shares = true }: MetricBarsProps) {
  const base = total?.value ?? Math.max(...rows.map((r) => r.value))
  const all = total ? [...rows, total] : rows
  return (
    <section className="slide">
      <Hint id="metrics">{hint}</Hint>
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
        <dl className="metrics">
          {all.map((row, i) => {
            const share = row.value / base
            const isTotal = row === total
            return (
              <Reveal key={row.label} build i={i + 2} className={`metrics__row${isTotal ? ' is-total' : ''}`}>
                <dt>{row.label}</dt>
                <dd className="metrics__value">
                  {row.value.toLocaleString('en-US')}
                  {row.suffix && <sup>{row.suffix}</sup>}
                </dd>
                <dd className="metrics__bar" aria-hidden>
                  <span style={vars({ '--p': share, '--i': i })} />
                </dd>
                <dd className="metrics__share">{shares ? (isTotal ? '100%' : `≈ ${Math.round(share * 100)}%`) : ''}</dd>
              </Reveal>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
