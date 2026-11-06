import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'

export interface FlipCard {
  /** Small tag on the front, ≤ 6 CJK characters. */
  tag: string
  /** Front statement, ≤ 3 lines × 9 CJK characters. */
  front: string
  /** Back headline, ≤ 12 CJK characters. */
  title: string
  /** Back body, ≤ 48 CJK characters. */
  body: string
}

export interface FlipCardsProps extends SlideBase {
  /** 2–4 cards. Each build step flips one card from front to back. */
  cards: FlipCard[]
  /** Label on the back of each card, ≤ 6 CJK characters. */
  backTag?: string
}

/** Cards with a front and a back: each build step turns one card over in 3D to reveal the answer. */
export function FlipCards({ kicker, title, lead, cards, backTag = '答案', source, hint }: FlipCardsProps) {
  return (
    <section className="slide">
      <Hint id="flipcards">{hint}</Hint>
      <div className="frame c3-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="c3flip" style={{ gridTemplateColumns: `repeat(${cards.length}, minmax(0, 1fr))` }}>
          {cards.map((c, i) => (
            <Reveal key={i} i={3 + i} className="c3flip__slot">
              <div className="c3flip__card" data-build="">
                <div className="c3flip__inner">
                  <div className="c3flip__face c3flip__front" aria-hidden>
                    <span className="c3-tag">{c.tag}</span>
                    <p>{c.front}</p>
                    <span className="c3flip__no">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="c3flip__face c3flip__back">
                    <span className="c3-tag c3-tag--on">{backTag}</span>
                    <p className="c3flip__q">{c.front}</p>
                    <h3>{c.title}</h3>
                    <p>{c.body}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
