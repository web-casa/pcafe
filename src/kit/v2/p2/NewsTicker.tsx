import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'

export interface NewsTickerProps {
  kicker: string
  /** Dateline above the headline, ≤ 16 characters. */
  dateline?: string
  /** The headline, ≤ 2 lines × 14 CJK characters; pass an array to break lines. */
  headline: string | string[]
  /** Standfirst under the headline, ≤ 56 CJK characters. */
  dek?: string
  /** Label on the ticker band, ≤ 4 CJK characters. */
  label: string
  /** 2–4 ticker items, each ≤ 18 CJK characters. The band slides in and stops (a build step); it never loops. */
  items: string[]
  source?: string
  hint?: React.ReactNode
}

/** Front-page headline with a news ticker band along the bottom that runs in from the right and settles. */
export function NewsTicker({ kicker, dateline, headline, dek, label, items, source, hint }: NewsTickerProps) {
  const lines = typeof headline === 'string' ? [headline] : headline
  return (
    <section className="slide">
      <Hint id="newsticker">{hint}</Hint>
      <div className="frame x2-nt">
        <Reveal i={0} className="x2-nt__top">
          <Kicker>{kicker}</Kicker>
          {dateline && <span className="x2-nt__date">{dateline}</span>}
        </Reveal>
        <Reveal i={1}>
          <h2 className="x2-nt__head">
            {lines.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </h2>
        </Reveal>
        {dek && (
          <Reveal i={2}>
            <p className="x2-nt__dek">{dek}</p>
          </Reveal>
        )}
        <Reveal i={3} y={0} build className="x2-nt__band">
          <span className="x2-nt__label">{label}</span>
          <div className="x2-nt__track" data-crop>
            <ul className="x2-nt__items">
              {items.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
