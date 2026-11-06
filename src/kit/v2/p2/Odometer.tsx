import type { CSSProperties } from 'react'
import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'

export interface OdometerStat {
  /** The final number as text, ≤ 7 characters (digits, separators, decimal point). Digits roll, other characters stay put. */
  value: string
  /** Unit after the number, ≤ 4 characters. */
  unit?: string
  /** What it measures, ≤ 12 CJK characters. */
  label: string
  /** One line of context, ≤ 28 CJK characters. */
  note?: string
}

export interface OdometerProps {
  kicker: string
  /** ≤ 1 line × 18 CJK characters. */
  title: Text
  /** 1–3 figures; each is a build step and rolls when it appears. */
  stats: OdometerStat[]
  source?: string
  hint?: React.ReactNode
}

/** One number as rolling digit wheels; the real number is the text in the DOM, the wheels are decoration on top. */
export function OdoNumber({ value }: { value: string }) {
  const chars = [...value]
  let k = 0
  return (
    <span className="x2-od__num">
      {chars.map((c, i) => {
        if (!/\d/.test(c)) return <span key={i} className="x2-od__sep">{c}</span>
        const d = Number(c)
        k++
        const strip = Array.from({ length: 21 + d }, (_, n) => n % 10)
        return (
          <span key={i} className="x2-od__d" data-crop style={{ '--v': 20 + d, '--k': k } as CSSProperties}>
            <span className="x2-od__real">{c}</span>
            <span className="x2-od__strip" aria-hidden>
              {strip.map((n, j) => (
                <span key={j}>{n}</span>
              ))}
            </span>
          </span>
        )
      })}
    </span>
  )
}

/** Odometer: 1–3 big figures whose digits spin up to their value, each one a build step. */
export function Odometer({ kicker, title, stats, source, hint }: OdometerProps) {
  return (
    <section className="slide">
      <Hint id="odometer">{hint}</Hint>
      <div className="frame x2-od" data-n={stats.length}>
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1}>
          <h2 className="s-title">
            <Lines text={title} />
          </h2>
        </Reveal>
        <div className="x2-od__row">
          {stats.map((s, i) => (
            <Reveal key={s.label} i={2 + i} build className="x2-od__stat">
              <div className="x2-od__fig">
                <OdoNumber value={s.value} />
                {s.unit && <span className="x2-od__unit">{s.unit}</span>}
              </div>
              <b className="x2-od__label">{s.label}</b>
              {s.note && <p className="x2-od__note">{s.note}</p>}
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
