import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface YearBarsProps extends SlideBase {
  /** 1–2 headline figures on the left. value ≤ 5 characters, unit ≤ 3. */
  stats: { value: string; unit?: string; label: string; body?: string }[]
  /** 3–7 rows, oldest first; the last row is highlighted. */
  bars: { year: string; value: number }[]
  /** Formats the number at the end of each bar. Default: thousands separators. */
  format?: (v: number) => string
}

/** Two big figures beside thin horizontal bars by year, the latest year highlighted. Made for `biennale`, works in any style. */
export function YearBars({ kicker, title, lead, source, hint, stats, bars, format = (v) => v.toLocaleString('en-US') }: YearBarsProps) {
  const max = Math.max(...bars.map((b) => b.value))
  return (
    <section className="slide">
      <Hint id="yearbars">{hint}</Hint>
      <div className="frame s-yb">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="yb__body">
          <div className="yb__stats">
            {stats.map((s, i) => (
              <Reveal key={s.label} i={3 + i}>
                <p className="yb__num">{s.value}{s.unit && <sup>{s.unit}</sup>}</p>
                <h3>{s.label}</h3>
                {s.body && <p className="yb__text">{s.body}</p>}
              </Reveal>
            ))}
          </div>
          <Reveal i={4} className="yb__bars">
            <ol>
              {bars.map((b, i) => (
                <li key={b.year} className={i === bars.length - 1 ? 'is-last' : undefined} style={vars({ '--w': b.value / max, '--k': i })}>
                  <span>{b.year}</span>
                  <i><b /></i>
                  <span>{format(b.value)}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
