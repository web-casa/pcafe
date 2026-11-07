import { Numeral, Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'

export interface WhyStat {
  /** ≤ 5 个字符; the digits roll in and a faint outline copy trails behind. */
  value: string
  /** ≤ 14 字. */
  label: string
  /** 0–100: draws a bar under the label. */
  meter?: number
}

export interface WhyStatsProps {
  kicker: string
  /** ≤ 2 lines × 5 字. */
  title: Text
  /** 3–5 short reasons under the title, each ≤ 6 字. */
  reasons?: string[]
  /** The pitch at the top right, ≤ 60 字. */
  lead: string
  /** A short quote at the bottom left: text ≤ 34 字, by ≤ 16 字. */
  quote?: { text: string; by: string }
  /** Exactly 3 figures. */
  stats: WhyStat[]
  source?: string
  hint?: string
}

/** Why choose us: a short title with a list of reasons, the pitch set large, and three figure cards whose numbers roll in over a faint outline echo. Made for `monograph`, works in any style. */
export function WhyStats({ kicker, title, reasons = [], lead, quote, stats, source, hint }: WhyStatsProps) {
  return (
    <section className="slide">
      <Hint id="whystats">{hint}</Hint>
      <div className="frame mg-why">
        <div className="mg-why__l">
          <Reveal i={0} className="mg-k">
            {kicker}
          </Reveal>
          <h2 className="mg-title">
            <span className="mg-lines">
              <Lines text={title} />
            </span>
          </h2>
          {reasons.length > 0 && (
            <Reveal i={3} className="mg-plus">
              {reasons.map((r) => (
                <span key={r}>+ {r}</span>
              ))}
            </Reveal>
          )}
          {quote && (
            <Reveal i={6} className="mg-why__q">
              <i>★★★★★</i>
              <p>“{quote.text}”</p>
              <small>{quote.by}</small>
            </Reveal>
          )}
        </div>
        <div className="mg-why__r">
          <Reveal i={2}>
            <p className="mg-why__lead">{lead}</p>
          </Reveal>
          <div className="mg-stats">
            {stats.slice(0, 3).map((s, i) => (
              <Reveal key={s.label} i={4 + i} y={40} className="mg-stat">
                <div className="mg-stat__ghost" data-crop aria-hidden="true">
                  <span>{s.value}</span>
                </div>
                <div className="mg-stat__v">
                  <Numeral text={s.value} delay={0.5 + i * 0.12} />
                </div>
                <small>{s.label}</small>
                {s.meter !== undefined && (
                  <i className="mg-meter" style={{ ['--m' as string]: `${Math.max(0, Math.min(100, s.meter))}%`, animationDelay: `${0.9 + i * 0.1}s` }} />
                )}
              </Reveal>
            ))}
          </div>
          {source && <span className="mg-src">{source}</span>}
        </div>
      </div>
    </section>
  )
}
