import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface SparkCard {
  /** ≤ 10 CJK characters. */
  label: string
  /** ≤ 7 characters. */
  value: string
  unit?: string
  /** Change badge, e.g. '+12%'; `down` colours it as a fall. */
  delta?: { text: string; tone?: 'up' | 'down' }
  /** 4–32 points, oldest first. */
  series: number[]
  /** Period under the line, e.g. '近 12 周', ≤ 12 CJK characters. */
  note?: string
}

export interface SparkCardsProps extends SlideBase {
  /** 3–4 cards. */
  cards: SparkCard[]
}

function Spark({ series, k }: { series: number[]; k: number }) {
  const lo = Math.min(...series)
  const hi = Math.max(...series)
  const pts = series.map((v, i) => [(i / (series.length - 1)) * 100, 92 - ((v - lo) / (hi - lo || 1)) * 84] as const)
  const line = pts.map(([x, y]) => `${x},${y}`).join(' ')
  const [lx, ly] = pts[pts.length - 1]
  return (
    <div className="spark__plot" style={vars({ '--k': k })}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <polygon points={`0,100 ${line} 100,100`} className="spark__area" />
        <polyline points={line} className="spark__line" />
      </svg>
      <i className="spark__dot" style={vars({ '--x': lx / 100, '--y': ly / 100 })} />
    </div>
  )
}

/** 3–4 KPI cards, each a big number, a change badge and a small trend line. */
export function SparkCards({ kicker, title, lead, source, hint, cards }: SparkCardsProps) {
  return (
    <section className="slide">
      <Hint id="spark">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="spark" style={vars({ '--n': cards.length })}>
          {cards.map((c, i) => (
            <Reveal key={c.label} build i={3 + i * 0.6} className="spark__card">
              <div className="spark__head">
                <span>{c.label}</span>
                {c.delta && <em className={`is-${c.delta.tone ?? 'up'}`}>{c.delta.text}</em>}
              </div>
              <b className="spark__value">
                {c.value}
                {c.unit && <small>{c.unit}</small>}
              </b>
              <Spark series={c.series} k={i} />
              {c.note && <span className="spark__note">{c.note}</span>}
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
