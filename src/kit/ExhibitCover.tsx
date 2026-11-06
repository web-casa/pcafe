import { Kicker, Reveal } from '../deck/primitives'
import { Hint, Lines, type Text } from './shared'

export interface ExhibitCoverProps {
  kicker: string
  /** Very large title, 2–3 lines of ≤ 8 CJK characters (or ≤ 12 Latin). */
  title: Text
  /** The block in the top-right corner, 1–2 short lines: dates, an edition, a place. */
  badge: Text
  /** 3–4 small columns along the bottom: who, when, where, what. */
  meta: { label: string; value: string }[]
  hint?: React.ReactNode
}

/** Exhibition-style opening: an outsized title, a glowing date block and thin ruled columns. Made for `biennale`, works in any style. */
export function ExhibitCover({ kicker, title, badge, meta, hint }: ExhibitCoverProps) {
  return (
    <section className="slide s-excover">
      <Hint id="exhibitcover">{hint}</Hint>
      <i className="excover__glow" aria-hidden />
      <Reveal i={2} className="excover__badge">
        <p><Lines text={badge} /></p>
      </Reveal>
      <div className="excover__main">
        <Reveal i={0}><Kicker>{kicker}</Kicker></Reveal>
        <Reveal i={1}><h1 className="excover__title"><Lines text={title} /></h1></Reveal>
      </div>
      <Reveal i={4} className="excover__meta">
        <dl>
          {meta.map((m) => (
            <div key={m.label}><dt>{m.label}</dt><dd>{m.value}</dd></div>
          ))}
        </dl>
      </Reveal>
    </section>
  )
}
