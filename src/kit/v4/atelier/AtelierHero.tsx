import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'
import { Photo, type PhotoImage } from '../../v2/p1/img'

export interface AtelierHeroProps {
  /** Status pill above the title with a live dot, ≤ 16 字. */
  badge: string
  /** ≤ 2 lines × 11 字. */
  title: Text
  /** ≤ 40 字. */
  lead?: string
  /** Main button (ink) and a second plain button, each ≤ 8 字. */
  ctas?: [string, string?]
  /** 3–6 client or product names set as small wordmarks, each ≤ 10 个字符. */
  clients?: string[]
  /** 4–6 work images in a strip along the foot that drifts sideways. */
  strip: PhotoImage[]
  hint?: string
}

/** A studio opening: status pill, a big centred promise, two buttons, client wordmarks, and a strip of work drifting along the foot. Made for `atelier`, works in any style. */
export function AtelierHero({ badge, title, lead, ctas, clients = [], strip, hint }: AtelierHeroProps) {
  const run = [...strip, ...strip]
  return (
    <section className="slide at-hero">
      <Hint id="atelierhero">{hint}</Hint>
      <div className="frame at-hero__frame">
        <Reveal i={0} className="at-badge">
          <i />
          {badge}
        </Reveal>
        <Reveal i={1}>
          <h1 className="at-hero__title">
            <Lines text={title} />
          </h1>
        </Reveal>
        {lead && (
          <Reveal i={2}>
            <p className="at-hero__lead">{lead}</p>
          </Reveal>
        )}
        {ctas && (
          <Reveal i={3} className="at-ctas">
            <span className="at-btn is-ink">
              <i />
              {ctas[0]}
            </span>
            {ctas[1] && <span className="at-btn">{ctas[1]} →</span>}
          </Reveal>
        )}
        {clients.length > 0 && (
          <Reveal i={4} className="at-clients">
            {clients.map((c) => (
              <span key={c}>◆ {c}</span>
            ))}
          </Reveal>
        )}
      </div>
      <div className="at-strip" data-crop>
        <div className="at-strip__track">
          {run.map((im, i) => (
            <Photo key={i} image={i < strip.length ? im : { ...im, alt: '' }} className="at-strip__item" style={{ animationDelay: `${0.5 + (i % strip.length) * 0.08}s` }} />
          ))}
        </div>
      </div>
    </section>
  )
}
