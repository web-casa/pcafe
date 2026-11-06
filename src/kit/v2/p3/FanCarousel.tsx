import { Reveal } from '../../../deck/primitives'
import { Icon } from '../../Icon'
import type { IconName } from '../../icon-set'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface FanCarouselCard {
  icon: IconName
  /** ≤ 6 characters, shown large. */
  mark: string
  /** ≤ 8 CJK characters. */
  title: string
  /** ≤ 30 CJK characters. */
  body: string
}

export interface FanCarouselProps extends SlideBase {
  /** 4–6 cards spread like a hand of cards. Each build step turns the fan so the next card stands upright in the middle. */
  cards: FanCarouselCard[]
}

/** Hand-of-cards fan: cards spread on an arc; each step rotates the fan so the current card stands centred and raised. */
export function FanCarousel({ kicker, title, lead, cards, source, hint }: FanCarouselProps) {
  const n = cards.length
  return (
    <section className="slide">
      <Hint id="fancarousel">{hint}</Hint>
      <div className="frame c3-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="c3fan" style={vars({ '--last': n - 1 })}>
          {cards.map((c, i) => (
            <div key={i} className="c3fan__card" data-build="" style={vars({ '--k': i })}>
              <div className="c3fan__inner">
                <span className="c3fan__icon" aria-hidden>
                  <Icon name={c.icon} size={40} tone="accent" />
                </span>
                <b>{c.mark}</b>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            </div>
          ))}
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
