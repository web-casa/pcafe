import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'

export interface LanyardProps {
  /** 2–8 CJK characters. */
  kicker: string
  /** ≤ 2 lines × 10 CJK characters. */
  title: Text
  badge: {
    /** Event / org line at the top of the badge, ≤ 12 CJK characters. */
    event: string
    /** 1–2 characters in the monogram circle. */
    initials: string
    /** ≤ 6 CJK characters. */
    name: string
    /** ≤ 14 CJK characters. */
    role: string
    /** ≤ 10 characters, printed on the badge foot. */
    code?: string
  }
  /** 2–4 points beside the badge, each ≤ 36 CJK characters. Each is one build step. */
  points: { label: string; text: string }[]
  /** Text woven on the strap, ≤ 16 characters. */
  strap?: string
  source?: string
  hint?: string
}

/** Speaker / person intro: a badge swings in on a lanyard, with 2–4 points beside it. */
export function Lanyard({ kicker, title, badge, points, strap = '', source, hint }: LanyardProps) {
  return (
    <section className="slide">
      <Hint id="lanyard">{hint}</Hint>
      <div className="c3lan" aria-hidden={false}>
        <div className="c3lan__swing">
          <div className="c3lan__strap" aria-hidden data-crop>
            <span>{`${strap}  ·  ${strap}  ·  ${strap}`}</span>
          </div>
          <i className="c3lan__clip" aria-hidden />
          <div className="c3lan__badge">
            <i className="c3lan__hole" aria-hidden />
            <p className="c3lan__event">{badge.event}</p>
            <span className="c3lan__mono" aria-hidden>
              {badge.initials}
            </span>
            <p className="c3lan__name">{badge.name}</p>
            <p className="c3lan__role">{badge.role}</p>
            {badge.code && <p className="c3lan__code">{badge.code}</p>}
          </div>
        </div>
      </div>
      <div className="frame c3-frame c3lan-frame">
        <div className="c3lan__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          <ul className="c3lan__points">
            {points.map((p, i) => (
              <Reveal key={i} i={3 + i} build>
                <li>
                  <span>{p.label}</span>
                  <p>{p.text}</p>
                </li>
              </Reveal>
            ))}
          </ul>
          <SlideFoot source={source} />
        </div>
      </div>
    </section>
  )
}
