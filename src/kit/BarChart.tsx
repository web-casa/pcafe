import { Reveal } from '../deck/primitives'
import { RAMP, fmt, niceMax } from './chart-util'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface BarSeries {
  /** Legend name, ≤ 8 CJK characters. */
  name: string
  /** One value per category. */
  values: number[]
}

export interface BarChartProps extends SlideBase {
  /** 2–8 categories, each ≤ 6 CJK characters. */
  categories: string[]
  /** 1–3 series. With one series the legend is hidden. */
  series: BarSeries[]
  /** 'group' puts series side by side; 'stack' piles them and labels the total. */
  mode?: 'group' | 'stack'
  /** Unit after each value label, ≤ 4 characters. */
  unit?: string
  /** Decimals in value labels. */
  decimals?: number
  /** Index of the category to emphasise; the others fade. */
  focus?: number
  /** The takeaway under the chart, ≤ 36 CJK characters. */
  note?: string
}

/** Vertical bars, grouped or stacked, with every value printed on the bar. */
export function BarChart({ kicker, title, lead, source, hint, categories, series, mode = 'group', unit = '', decimals = 0, focus, note }: BarChartProps) {
  const stack = mode === 'stack'
  const totals = categories.map((_, c) => series.reduce((n, s) => n + (s.values[c] ?? 0), 0))
  const max = niceMax(stack ? Math.max(...totals) : Math.max(...series.flatMap((s) => s.values)))
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max)
  const label = (v: number) => `${fmt(v, decimals)}${unit}`
  return (
    <section className="slide">
      <Hint id="bar">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        {series.length > 1 && (
          <Reveal i={3} className="chart-legend">
            {series.map((s, k) => (
              <span key={s.name} style={vars({ '--c': RAMP[k] })}>
                <i />
                {s.name}
              </span>
            ))}
          </Reveal>
        )}
        <Reveal i={3} className={`bar bar--${mode}${focus === undefined ? '' : ' has-focus'}`} style={vars({ '--n': categories.length, '--m': stack ? 1 : series.length })}>
          <div className="bar__grid" aria-hidden>
            {ticks.map((t) => (
              <span key={t} style={vars({ '--y': t / max })}>
                {fmt(t, t % 1 ? 1 : 0)}
              </span>
            ))}
          </div>
          <div className="bar__plot">
            {categories.map((cat, c) => (
              <div key={cat} className={`bar__col${focus === c ? ' is-focus' : ''}`} data-build={c}>
                <div className="bar__bars">
                  {stack ? (
                    <div className="bar__stack" style={vars({ '--h': totals[c] / max, '--k': c })}>
                      <b className="bar__val">{label(totals[c])}</b>
                      {series.map((s, k) => (
                        <i key={s.name} style={vars({ '--f': (s.values[c] ?? 0) / (totals[c] || 1), '--c': RAMP[k] })} />
                      ))}
                    </div>
                  ) : (
                    series.map((s, k) => (
                      <div key={s.name} className="bar__bar" style={vars({ '--h': (s.values[c] ?? 0) / max, '--c': RAMP[k], '--k': c + k * 0.3 })}>
                        <b className="bar__val">{label(s.values[c] ?? 0)}</b>
                      </div>
                    ))
                  )}
                </div>
                <span className="bar__cat">{cat}</span>
              </div>
            ))}
          </div>
        </Reveal>
        {note && (
          <Reveal i={6} className="chart-note">
            {note}
          </Reveal>
        )}
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
