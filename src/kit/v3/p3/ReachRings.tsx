import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface ReachRing {
  /** Ring label, ≤ 8 characters, e.g. '50 ms'. */
  label: string
  /** ≤ 6 characters, the headline for this ring, e.g. '95%'. */
  value: string
  /** ≤ 30 CJK characters. */
  text: string
}

export interface ReachRingsProps extends SlideBase {
  /** 2–4 rings, innermost first. With build, each ring and its row arrive together. */
  rings: ReachRing[]
  /** Label at the centre, ≤ 4 CJK characters. */
  center: string
}

/** Concentric reach rings around one point with a slow radar sweep; each ring states how much it covers. */
export function ReachRings({ kicker, title, lead, source, hint, rings, center }: ReachRingsProps) {
  const n = rings.length
  return (
    <section className="slide">
      <Hint id="reach">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="v33-reach">
          <Reveal i={3} className="v33-reach__art">
            <div className="v33-reach__sweep" aria-hidden />
            {rings.map((r, i) => (
              <div key={r.label} className="v33-reach__ring" data-build={`r-${i}`} style={vars({ '--r': (i + 1) / n })}>
                <span>{r.label}</span>
              </div>
            ))}
            <div className="v33-reach__c">{center}</div>
          </Reveal>
          <ol className="v33-reach__list">
            {rings.map((r, i) => (
              <li key={r.label} data-build={`r-${i}`}>
                <em>{r.label}</em>
                <b>{r.value}</b>
                <p>{r.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
