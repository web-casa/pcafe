import { Reveal } from '../../../deck/primitives'
import { useCount } from '../../chart-util'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface GlowMetricItem {
  /** Number to count up to. */
  value: number
  decimals?: number
  /** ≤ 4 characters after the number, e.g. 'TWh' or '%'. */
  unit?: string
  /** ≤ 10 CJK characters. */
  label: string
  /** ≤ 24 CJK characters. */
  note?: string
  /** Small change line, ≤ 12 characters, e.g. '+31% 同比'. */
  delta?: string
  /** 4–16 values for a faint sparkline under the number. */
  trend?: number[]
}

export interface GlowMetricsProps extends SlideBase {
  /** 2–4 metrics; the first glows strongest. Each is a build step. */
  metrics: GlowMetricItem[]
}

function Spark({ v }: { v: number[] }) {
  const lo = Math.min(...v)
  const hi = Math.max(...v)
  const pts = v.map((n, i) => `${(i / (v.length - 1)) * 200},${56 - ((n - lo) / (hi - lo || 1)) * 52}`).join(' ')
  return (
    <svg className="glow__spark" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden>
      <polyline points={pts} />
    </svg>
  )
}

function Card({ m, k }: { m: GlowMetricItem; k: number }) {
  const v = useCount(m.value, { decimals: m.decimals ?? 0, delay: 500 + k * 160 })
  return (
    <div className={`glow__card${k === 0 ? ' is-lead' : ''}`} data-build style={vars({ '--k': k })}>
      <span className="glow__halo" aria-hidden />
      <p className="glow__label">{m.label}</p>
      <p className="glow__value">
        {v}
        {m.unit && <small>{m.unit}</small>}
      </p>
      {m.trend && <Spark v={m.trend} />}
      {m.delta && <p className="glow__delta">{m.delta}</p>}
      {m.note && <p className="glow__note">{m.note}</p>}
    </div>
  )
}

/** Big glowing numbers on dark cards, for the two to four figures a talk hangs on. Best with a dark style or tone 'dark'. */
export function GlowMetrics({ kicker, title, lead, source, hint, metrics }: GlowMetricsProps) {
  return (
    <section className="slide">
      <Hint id="glow">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="glow" style={vars({ '--n': metrics.length })}>
          {metrics.map((m, k) => (
            <Card key={m.label} m={m} k={k} />
          ))}
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
