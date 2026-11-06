import { Reveal } from '../../../deck/primitives'
import { fmt } from '../../chart-util'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface ScoreRow {
  /** Benchmark name, ≤ 16 characters. */
  name: string
  /** Metric, ≤ 10 characters, e.g. 'Pass@1'. */
  metric?: string
  /** One value per model; null = not reported (drawn as '—'). */
  values: (number | null)[]
  /** Overrides the matrix decimals for this row. */
  decimals?: number
}

export interface ScoreMatrixProps extends SlideBase {
  /** 3–7 model names, ≤ 10 characters each. */
  models: string[]
  /** Index of the model column drawn in the accent. */
  focus: number
  /** 3–7 benchmarks; each row is a build step. */
  rows: ScoreRow[]
  decimals?: number
}

/** Benchmarks × models: each cell a score with a thin bar scaled to the row's best; the focus column is tinted, the row leader gets a dot. */
export function ScoreMatrix({ kicker, title, lead, source, hint, models, focus, rows, decimals = 1 }: ScoreMatrixProps) {
  return (
    <section className="slide">
      <Hint id="scores">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="smx" style={vars({ '--m': models.length, '--f': focus + 2 })}>
          <div className="smx__row smx__row--head">
            <span />
            {models.map((m, i) => (
              <span key={m} className={i === focus ? 'is-focus' : undefined}>
                {m}
              </span>
            ))}
          </div>
          {rows.map((r) => {
            const nums = r.values.filter((v): v is number => v !== null)
            const best = Math.max(...nums)
            return (
              <div key={r.name} className="smx__row" data-build>
                <span className="smx__name">
                  {r.name}
                  {r.metric && <small>{r.metric}</small>}
                </span>
                {r.values.map((v, i) => (
                  <span key={i} className={`smx__cell${i === focus ? ' is-focus' : ''}${v === best ? ' is-best' : ''}`}>
                    {v === null ? (
                      <em>—</em>
                    ) : (
                      <>
                        <b>{fmt(v, r.decimals ?? decimals)}</b>
                        <i style={vars({ '--w': v / best })} aria-hidden />
                      </>
                    )}
                  </span>
                ))}
              </div>
            )
          })}
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
