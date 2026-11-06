import { Reveal } from '../deck/primitives'
import { NameStrip } from './decor'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface RowStat {
  /** ≤ 6 characters. */
  value: string
  /** Mono caption above the value, ≤ 12 characters. */
  label: string
  /** ≤ 28 CJK characters. */
  note: string
}

export interface StatRowProps extends SlideBase {
  /** 3–4 stats. */
  stats: RowStat[]
  /** Optional row of names under the cards (tools, partners), ≤ 8, text only. */
  names?: string[]
}

/** A row of dark number cards with mono captions, like app widgets; optional name pills underneath. */
export function StatRow({ kicker, title, lead, source, hint, stats, names }: StatRowProps) {
  return (
    <section className="slide">
      <Hint id="statrow">{hint}</Hint>
      <div className="frame s-statrow">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="statrow" style={vars({ '--n': stats.length })}>
          {stats.map((s, i) => (
            <Reveal key={s.label} build i={3 + i * 0.5} className="statrow__card">
              <div className="statrow__top">
                <span>{s.label}</span>
                <i aria-hidden>
                  <b />
                  <b />
                  <b />
                </i>
              </div>
              <b className="statrow__value">{s.value}</b>
              <p>{s.note}</p>
            </Reveal>
          ))}
        </div>
        {names && names.length > 0 && (
          <Reveal i={6} className="statrow__names">
            <NameStrip names={names} />
          </Reveal>
        )}
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
