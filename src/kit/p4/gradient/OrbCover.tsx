import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type SlideBase } from '../../shared'

export interface OrbChip {
  /** ≤ 6 characters. */
  value: string
  /** ≤ 10 CJK characters. */
  label: string
}

export interface OrbCoverProps extends SlideBase {
  /** title ≤ 3 lines × 6 CJK characters; lead ≤ 48 CJK characters. */
  title: SlideBase['title']
  /** 2–3 glass chips floating over the orb. */
  chips: OrbChip[]
}

/** Opening slide: heading on the left, a large glowing gradient orb on the right with 2–3 frosted-glass fact chips floating over it. */
export function OrbCover({ kicker, title, lead, source, hint, chips }: OrbCoverProps) {
  return (
    <section className="slide">
      <Hint id="orbcover">{hint}</Hint>
      <div className="frame s-gorb">
        <div className="gorb__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h1 className="gorb__title">
              <Lines text={title} />
            </h1>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="gorb__lead">{lead}</p>
            </Reveal>
          )}
          <SlideFoot source={source} i={7} />
        </div>
        <div className="gorb__art">
          <Reveal i={1} y={0}>
            <div className="gorb__orb" data-crop aria-hidden>
              <div className="gorb__mesh" />
              <div className="gorb__shine" />
            </div>
          </Reveal>
          {chips.slice(0, 3).map((c, i) => (
            <Reveal key={c.label} i={3 + i} className={`gorb__chip gorb__chip--${i + 1}`}>
              <b>{c.value}</b>
              <span>{c.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
