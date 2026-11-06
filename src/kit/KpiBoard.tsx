import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface Kpi {
  /** ≤ 10 CJK characters. */
  label: string
  /** As it should read, ≤ 7 characters: '42%', '1.8 万', '¥3,200'. */
  value: string
  /** Change vs the comparison period, e.g. '+6 pt', '−12%'. */
  delta?: string
  /** Whether the change is good news. Colours the delta; omit for neutral. */
  good?: boolean
  /** 6–12 points for a sparkline. Any scale; it is normalised. */
  trend?: number[]
  /** Muted line: definition or target, ≤ 18 CJK characters. */
  note?: string
}

export interface KpiBoardProps extends SlideBase {
  /** The north-star metric: a tall tile on the left with a larger figure. */
  star: Kpi
  /** 4 or 6 supporting metrics in a grid to its right. */
  items: Kpi[]
}

function Spark({ data }: { data: number[] }) {
  const lo = Math.min(...data)
  const hi = Math.max(...data)
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${hi === lo ? 50 : 92 - ((v - lo) / (hi - lo)) * 84}`).join(' ')
  const [lx, ly] = pts.split(' ').at(-1)!.split(',')
  return (
    <svg className="kpi__spark" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      <polyline points={pts} />
      <circle cx={lx} cy={ly} r={3.2} />
    </svg>
  )
}

function Tile({ k, i, star }: { k: Kpi; i: number; star?: boolean }) {
  const tone = k.good === undefined ? '' : k.good ? ' is-good' : ' is-bad'
  return (
    <Reveal i={i} build className={`kpi__tile${star ? ' is-star' : ''}`}>
      <div className="kpi__head">
        <span className="kpi__label">{k.label}</span>
        {k.delta && <span className={`kpi__delta${tone}`}>{k.delta}</span>}
      </div>
      <p className="kpi__value">{k.value}</p>
      {k.trend && <Spark data={k.trend} />}
      {k.note && <p className="kpi__note">{k.note}</p>}
    </Reveal>
  )
}

/** A metrics board: one north-star tile plus supporting metrics with deltas and sparklines. */
export function KpiBoard({ kicker, title, lead, source, hint, star, items }: KpiBoardProps) {
  return (
    <section className="slide">
      <Hint id="kpi">{hint}</Hint>
      <div className="frame s-kpi">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className={`kpi kpi--${items.length > 4 ? 6 : 4}`}>
          <Tile k={star} i={3} star />
          {items.map((k, i) => (
            <Tile key={k.label} k={k} i={i * 0.5 + 3.6} />
          ))}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
