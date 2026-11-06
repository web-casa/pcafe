import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface TokenPriceGridProps extends SlideBase {
  /** 2–4 price columns (tiers, models), ≤ 10 characters each. */
  columns: string[]
  /** Column drawn in the accent. */
  focus?: number
  /** 2–4 token types; each row is a build step. label ≤ 10 CJK characters. */
  rows: { label: string; note?: string; values: number[] }[]
  /** Currency prefix, default '$'. */
  currency?: string
  /** Unit line, ≤ 16 characters, e.g. '每百万 tokens'. */
  unit: string
}

const pos = (v: number, lo: number, hi: number) => (Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo) || 1)

/** Price per token as a grid: token types × tiers, each cell a price with a log-scaled bar so 100× gaps stay readable. */
export function TokenPriceGrid({ kicker, title, lead, source, hint, columns, focus, rows, currency = '$', unit }: TokenPriceGridProps) {
  const all = rows.flatMap((r) => r.values)
  const lo = Math.min(...all) / 2
  const hi = Math.max(...all)
  return (
    <section className="slide">
      <Hint id="price">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="tpg" style={vars({ '--c': columns.length })}>
          <div className="tpg__row tpg__row--head">
            <span className="tpg__unit">{unit}</span>
            {columns.map((c, i) => (
              <span key={c} className={i === focus ? 'is-focus' : undefined}>
                {c}
              </span>
            ))}
          </div>
          {rows.map((r) => (
            <div key={r.label} className="tpg__row" data-build>
              <span className="tpg__label">
                {r.label}
                {r.note && <small>{r.note}</small>}
              </span>
              {r.values.map((v, i) => (
                <span key={i} className={`tpg__cell${i === focus ? ' is-focus' : ''}`}>
                  <b>
                    <small>{currency}</small>
                    {v}
                  </b>
                  <i style={vars({ '--w': Math.max(0.03, pos(v, lo, hi)) })} aria-hidden />
                </span>
              ))}
            </div>
          ))}
          <p className="tpg__scale">条长按对数刻度</p>
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
