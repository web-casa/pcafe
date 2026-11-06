import type { ReactNode } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Icon, type IconName } from '../../Icon'
import { Hint, Lines, SlideFoot, type Text } from '../../shared'

export interface FanCard {
  /** Imported image (a real screenshot). */
  src: string
  alt: string
}

export interface FanCoverProps {
  /** Pill above the title, ≤ 20 CJK characters, with 1–3 icon dots in front. */
  badge: { icons: IconName[]; text: string }
  /** 1–2 lines, ≤ 12 CJK characters each. */
  title: Text
  /** ≤ 40 CJK characters. */
  lead: string
  /** 1–2 pill buttons; each label ≤ 22 characters. The first is filled white. */
  actions: string[]
  /** 3–5 cards fanned along the bottom edge, middle one upright. */
  cards: FanCard[]
  source?: string
  hint?: ReactNode
}

/** Studio-site hero: centred pill badge, big tight headline, two pill buttons with round arrows, and a fan of tilted screenshot cards rising from the bottom edge. Use with tone 'accent'. */
export function FanCover({ badge, title, lead, actions, cards, source, hint }: FanCoverProps) {
  const list = cards.slice(0, 5)
  const mid = (list.length - 1) / 2
  return (
    <section className="slide">
      <Hint id="fancover">{hint}</Hint>
      <div className="frame el-fan">
        <div className="el-fan__copy">
          <Reveal i={0} className="el-fan__badge">
            <span className="el-fan__dots" aria-hidden>
              {badge.icons.slice(0, 3).map((n) => (
                <span key={n}>
                  <Icon name={n} size={22} variant="bold" />
                </span>
              ))}
            </span>
            {badge.text}
          </Reveal>
          <Reveal i={1}>
            <h1 className="el-fan__title">
              <Lines text={title} />
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p className="el-fan__lead">{lead}</p>
          </Reveal>
          <Reveal i={3} className="el-fan__actions">
            {actions.slice(0, 2).map((a, i) => (
              <span key={a} className={`el-btn${i === 0 ? ' el-btn--solid' : ''}`}>
                {a}
                <span className="el-btn__arrow" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </span>
            ))}
          </Reveal>
        </div>
        <div className="el-fan__cards" data-crop>
          {list.map((c, i) => {
            const d = i - mid
            return (
              <Reveal key={c.alt} i={4 + Math.abs(d)} y={80} className="el-fan__slot" style={{ ['--d' as string]: d }}>
                <figure className="el-fan__card">
                  <img src={c.src} alt={c.alt} />
                </figure>
              </Reveal>
            )
          })}
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
