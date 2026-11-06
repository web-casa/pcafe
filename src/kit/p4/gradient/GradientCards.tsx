import { Reveal } from '../../../deck/primitives'
import { Icon, type IconName } from '../../Icon'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'

export interface GradientCard {
  icon: IconName
  /** Mono tag, ≤ 18 characters. Omit if there is none. */
  tag?: string
  /** ≤ 10 CJK characters. */
  title: string
  /** 24–48 CJK characters; keep the three close in length. */
  body: string
}

export interface GradientCardsProps extends SlideBase {
  /** Exactly 3 cards. */
  items: GradientCard[]
}

/** Three feature cards, each topped with its own vivid gradient panel and a glass icon disc. */
export function GradientCards({ kicker, title, lead, source, hint, items }: GradientCardsProps) {
  return (
    <section className="slide">
      <Hint id="gradientcards">{hint}</Hint>
      <div className="frame s-gcards">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="gcards__row">
          {items.slice(0, 3).map((c, i) => (
            <Reveal key={c.title} i={3 + i} build className={`gcard gcard--${i + 1}`}>
              <div className="gcard__panel" aria-hidden>
                <span className="gcard__disc">
                  <Icon name={c.icon} size={56} variant="bold-duotone" />
                </span>
              </div>
              <div className="gcard__body">
                {c.tag && <span className="gcard__tag">{c.tag}</span>}
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
