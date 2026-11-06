import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface SlopeItem {
  /** ≤ 10 CJK characters. */
  name: string
  /** Rank at the first point, 1 = top. */
  from: number
  /** Rank at the second point. */
  to: number
}

export interface SlopeRankProps extends SlideBase {
  /** Column heads, e.g. ['2024', '2025'], ≤ 8 characters each. */
  periods: [string, string]
  /** 4–8 items; ranks run 1…n in both columns. */
  items: SlopeItem[]
  /** Name of the item to draw in the accent. */
  focus?: string
  /** Reading of the change, ≤ 40 CJK characters. */
  note?: string
}

/** Rank at two points in time, joined by lines: who climbed, who fell. */
export function SlopeRank({ kicker, title, lead, source, hint, periods, items, focus, note }: SlopeRankProps) {
  const n = items.length
  const y = (r: number) => ((r - 0.5) / n) * 100
  const sorted = (key: 'from' | 'to') => [...items].sort((a, b) => a[key] - b[key])
  const move = (it: SlopeItem) => it.from - it.to
  return (
    <section className="slide">
      <Hint id="slope">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="slope">
          <Reveal i={3} className="slope__board" style={vars({ '--n': n })}>
            <div className="slope__head">
              <span>{periods[0]}</span>
              <span>{periods[1]}</span>
            </div>
            <div className="slope__body">
              <ol className="slope__col slope__col--from">
                {sorted('from').map((it) => (
                  <li key={it.name} className={it.name === focus ? 'is-focus' : undefined}>
                    <span>{it.name}</span>
                    <b>{it.from}</b>
                  </li>
                ))}
              </ol>
              <div className="slope__mid">
                <svg className="slope__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                  {items.map((it) => (
                    <line
                      key={it.name}
                      x1="0"
                      x2="100"
                      y1={y(it.from)}
                      y2={y(it.to)}
                      className={it.name === focus ? 'is-focus' : move(it) > 0 ? 'is-up' : move(it) < 0 ? 'is-down' : undefined}
                    />
                  ))}
                </svg>
              </div>
              <ol className="slope__col slope__col--to">
                {sorted('to').map((it) => (
                  <li key={it.name} className={it.name === focus ? 'is-focus' : undefined}>
                    <b>{it.to}</b>
                    <span>{it.name}</span>
                    <em className={move(it) > 0 ? 'is-up' : move(it) < 0 ? 'is-down' : undefined}>{move(it) > 0 ? `↑${move(it)}` : move(it) < 0 ? `↓${-move(it)}` : '–'}</em>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
          {note && (
            <Reveal i={6} className="chart-note slope__note">
              {note}
            </Reveal>
          )}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
